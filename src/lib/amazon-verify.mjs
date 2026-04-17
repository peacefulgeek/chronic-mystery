/**
 * amazon-verify.mjs
 *
 * Lightweight Amazon ASIN verification via HTTP GET.
 * No API keys needed. Detects soft-404s, dog pages, and unavailable products.
 */

const AMAZON_TAG = "spankyspinola-20";

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Check a single ASIN on Amazon.
 * @param {string} asin - The 10-character Amazon ASIN
 * @param {number} timeout - Request timeout in ms (default 15000)
 * @returns {Promise<object>} Verification result
 */
export async function verifyAsin(asin, timeout = 15000) {
  const url = `https://www.amazon.com/dp/${asin}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timer);

    const body = await res.text();
    const status = res.status;

    // Detect Amazon's "dog page" (soft 404 / bot block)
    const isDogPage =
      body.includes("Sorry, we just need to make sure") ||
      body.includes("To discuss automated access") ||
      body.includes("api-services-support@amazon.com");

    // Detect actual 404 / unavailable product
    const is404 = status === 404 || status === 410;
    const isUnavailable =
      body.includes("Currently unavailable") &&
      body.includes(
        "We don\u2019t know when or if this item will be back in stock"
      );

    // Scrape product title
    let productTitle = "";
    const titleMatch = body.match(
      /<span id="productTitle"[^>]*>([^<]+)<\/span>/
    );
    if (titleMatch) {
      productTitle = titleMatch[1].trim();
    } else {
      const htmlTitle = body.match(/<title>([^<]+)<\/title>/);
      if (htmlTitle) {
        productTitle = htmlTitle[1]
          .replace(/ *: *Amazon\.com.*$/, "")
          .replace(/ *\| *Amazon.*$/, "")
          .trim();
      }
    }

    // Scrape price if visible
    let price = "";
    const priceMatch = body.match(
      /<span class="a-offscreen">\$([0-9]+\.[0-9]{2})<\/span>/
    );
    if (priceMatch) {
      price = `$${priceMatch[1]}`;
    }

    // Scrape availability
    let availability = "unknown";
    if (isUnavailable) {
      availability = "unavailable";
    } else if (body.includes("In Stock")) {
      availability = "in-stock";
    } else if (body.includes("Only") && body.includes("left in stock")) {
      availability = "low-stock";
    }

    return {
      asin,
      status,
      ok: status >= 200 && status < 400 && !is404 && !isDogPage,
      isDogPage,
      is404,
      isUnavailable,
      productTitle,
      price,
      availability,
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      asin,
      status: 0,
      ok: false,
      isDogPage: false,
      is404: false,
      isUnavailable: false,
      productTitle: "",
      price: "",
      availability: "error",
      error: err.message,
    };
  }
}

/**
 * Batch-verify multiple ASINs with respectful delays.
 * @param {string[]} asins - Array of ASINs to verify
 * @param {object} opts - { delayMs: 3000, maxRetries: 1 }
 * @returns {Promise<object[]>} Array of verification results
 */
export async function batchVerify(asins, opts = {}) {
  const delayMs = opts.delayMs || 3000;
  const maxRetries = opts.maxRetries || 1;
  const results = [];

  for (const asin of asins) {
    let result = await verifyAsin(asin);

    // If rate-limited (dog page), wait and retry
    if (result.isDogPage && maxRetries > 0) {
      await delay(60000); // Wait 60s
      result = await verifyAsin(asin);
      if (result.isDogPage) {
        // Still blocked — stop batch
        results.push({ ...result, stoppedBatch: true });
        break;
      }
    }

    results.push(result);

    // Respectful delay between requests (3-5s)
    await delay(delayMs + Math.floor(Math.random() * 2000));
  }

  return results;
}

/**
 * Build an Amazon product URL with affiliate tag.
 * @param {string} asin
 * @returns {string}
 */
export function amazonUrl(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export default { verifyAsin, batchVerify, amazonUrl };
