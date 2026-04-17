/**
 * match-products.mjs
 *
 * Named-params wrapper for product matching.
 * Mirrors the TypeScript findRelevantProducts() from product-catalog.ts
 * but works in plain ESM for the cron script.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load the product catalog at module init ──
const catalogPath = resolve(
  __dirname,
  "../../client/src/data/product-catalog.ts"
);
const catalogSource = readFileSync(catalogPath, "utf-8");

// Parse products from the TypeScript source
function parseProducts() {
  const products = [];
  // Match each object literal in the PRODUCTS array
  const regex =
    /\{\s*name:\s*'([^']+)',\s*asin:\s*'([^']+)',\s*category:\s*'([^']+)',\s*tags:\s*\[([^\]]+)\],\s*softIntro:\s*'([^']+)'\s*\}/g;
  let match;
  while ((match = regex.exec(catalogSource)) !== null) {
    products.push({
      name: match[1],
      asin: match[2],
      category: match[3],
      tags: match[4]
        .split(",")
        .map((t) => t.trim().replace(/'/g, ""))
        .filter(Boolean),
      softIntro: match[5],
    });
  }
  return products;
}

const PRODUCTS = parseProducts();

const AFFILIATE_TAG = "spankyspinola-20";

const SOFT_INTROS = [
  "One option that many people like is",
  "A tool that often helps with this is",
  "Something worth considering might be",
  "For those looking for a simple solution, this works well:",
  "You could also try",
  "A popular choice for situations like this is",
  "Many people in the ME/CFS community have found value in",
  "If you are exploring options, one that comes up often is",
  "A practical option that gets mentioned frequently is",
  "One thing that has helped some people is",
  "Worth looking into if this resonates with you:",
  "A gentle option that many find useful is",
];

function getRandomSoftIntro() {
  return SOFT_INTROS[Math.floor(Math.random() * SOFT_INTROS.length)];
}

/**
 * Find products relevant to an article's topic.
 * @param {object} params - Named parameters
 * @param {string} params.title - Article title
 * @param {string} params.body - Article body (HTML or plain text)
 * @param {number} [params.count=3] - Number of products to return
 * @param {string[]} [params.excludeAsins=[]] - ASINs to exclude (already used in body)
 * @returns {Array<{name, asin, url, softIntro, category, tags}>}
 */
export function matchProducts({
  title,
  body,
  count = 3,
  excludeAsins = [],
} = {}) {
  const text = ((title || "") + " " + (body || ""))
    .toLowerCase()
    .replace(/<[^>]+>/g, " ");
  const excludeSet = new Set(excludeAsins);

  const scored = PRODUCTS.filter((p) => !excludeSet.has(p.asin)).map((p) => {
    let score = 0;
    for (const tag of p.tags) {
      const tagText = tag.toLowerCase().replace(/-/g, " ");
      if (text.includes(tagText)) {
        score += 1;
      }
    }
    if (text.includes(p.category)) score += 0.5;
    return { product: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => ({
      name: s.product.name,
      asin: s.product.asin,
      url: `https://www.amazon.com/dp/${s.product.asin}?tag=${AFFILIATE_TAG}`,
      softIntro: s.product.softIntro || getRandomSoftIntro(),
      category: s.product.category,
      tags: s.product.tags,
    }));
}

/**
 * Build an affiliate link HTML string.
 * @param {object} product - { name, asin }
 * @returns {string} HTML anchor with paid link disclosure
 */
export function affiliateLink(product) {
  const url = `https://www.amazon.com/dp/${product.asin}?tag=${AFFILIATE_TAG}`;
  return `<a href="${url}" target="_blank" rel="nofollow noopener">${product.name}</a> <em>(paid link)</em>`;
}

/**
 * Get the full product catalog.
 * @returns {Array} All products
 */
export function getAllProducts() {
  return [...PRODUCTS];
}

export default { matchProducts, affiliateLink, getAllProducts };
