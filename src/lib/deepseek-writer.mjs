/**
 * deepseek-writer.mjs
 *
 * DeepSeek V4-Pro article generation engine.
 * Uses the OpenAI-compatible SDK with hardcoded DeepSeek base URL.
 * Shared by the cron scheduler and the bulk seed script.
 */

import OpenAI from "openai";
import { qualityGate, sanitizeBody } from "./article-quality-gate.mjs";
import { matchProducts } from "./match-products.mjs";
import { IMAGE_LIBRARY, pickImage } from "./image-library.mjs";

// ── DeepSeek client (OpenAI-compatible) ──
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com",
});

const MODEL = process.env.OPENAI_MODEL || "deepseek-v4-pro";

// ── Affiliate tag ──
const AMAZON_TAG = process.env.AMAZON_TAG || "spankyspinola-20";

// ── Categories ──
const CATEGORIES = [
  { slug: "the-mystery", name: "The Mystery" },
  { slug: "the-medical", name: "The Medical" },
  { slug: "the-management", name: "The Management" },
  { slug: "the-identity", name: "The Identity" },
  { slug: "the-deeper-rest", name: "The Deeper Rest" },
];

const CATEGORY_NAMES = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.name]));

// ── Named researchers to cite ──
const RESEARCHERS = [
  { name: "Anthony Komaroff", field: "ME/CFS immunology at Harvard" },
  { name: "Jose Montoya", field: "post-viral fatigue at Stanford" },
  { name: "Avindra Nath", field: "neuroimmunology at NIH" },
  { name: "Nancy Klimas", field: "Gulf War illness and ME/CFS" },
  { name: "Leonard Jason", field: "ME/CFS epidemiology at DePaul" },
  { name: "Maureen Hanson", field: "ME/CFS molecular biology at Cornell" },
  { name: "Ron Davis", field: "ME/CFS biomarker research at Stanford" },
  { name: "Jarred Younger", field: "neuroinflammation at UAB" },
];

// ── Opener types ──
const OPENER_TYPES = [
  "first-person", "question", "statistic", "anecdote", "scene-setting",
  "contrast", "confession", "observation",
];

// ── Conclusion types ──
const CONCLUSION_TYPES = [
  "tender", "reflection", "call-to-rest", "open-question", "permission",
  "solidarity", "reframe",
];

// ── Final header options ──
const FINAL_HEADERS = [
  "What Comes Next", "Where This Leaves Us", "The Quiet Part",
  "Sitting With It", "One More Thing", "Before You Go",
  "The Part Nobody Says", "What I Want You to Know",
];

// ── FAQ bank (2 per article) ──
const FAQ_BANK = [
  { question: "What is the difference between chronic fatigue and ME/CFS?", answer: "Chronic fatigue is a symptom that can accompany many conditions, from depression to thyroid disorders. ME/CFS (Myalgic Encephalomyelitis/Chronic Fatigue Syndrome) is a specific, diagnosable condition characterized by post-exertional malaise, unrefreshing sleep, cognitive dysfunction, and orthostatic intolerance. The distinction matters because treatment approaches differ significantly." },
  { question: "How is ME/CFS diagnosed?", answer: "ME/CFS is diagnosed clinically using criteria such as the Institute of Medicine's 2015 diagnostic criteria, which require substantial reduction in activity, post-exertional malaise, unrefreshing sleep, and either cognitive impairment or orthostatic intolerance. There is currently no single diagnostic test, though research is advancing toward biomarker identification." },
  { question: "Can ME/CFS be cured?", answer: "There is currently no cure for ME/CFS. Treatment focuses on symptom management, pacing, and improving quality of life. Some people experience significant improvement over time, while others have a more chronic course. Research into potential treatments is ongoing and accelerating." },
  { question: "What is post-exertional malaise?", answer: "Post-exertional malaise (PEM) is the hallmark symptom of ME/CFS. It is a worsening of symptoms following physical, cognitive, or emotional exertion that would not have caused problems before illness onset. PEM can be delayed by 24-72 hours and can last days or weeks." },
  { question: "Is chronic fatigue syndrome real?", answer: "Yes. ME/CFS is recognized by the WHO, CDC, NIH, and major medical institutions worldwide. Research has identified measurable biological abnormalities including immune dysfunction, metabolic changes, and neuroinflammation. The decades of dismissal reflected gaps in medical understanding, not the absence of disease." },
  { question: "What helps with brain fog in ME/CFS?", answer: "Brain fog management strategies include pacing cognitive activity, maintaining stable blood sugar, staying hydrated, using cognitive aids like lists and timers, and timing demanding tasks for your best hours. Some people find low-dose naltrexone or certain supplements helpful, though responses vary." },
  { question: "How does pacing work for chronic fatigue?", answer: "Pacing means staying within your energy envelope - doing less than you think you can on good days to prevent crashes on subsequent days. It involves learning your limits through tracking, planning rest before and after activities, and accepting that your capacity fluctuates." },
  { question: "What is the energy envelope theory?", answer: "The energy envelope theory suggests that people with ME/CFS have a reduced energy budget. Staying within that budget (the envelope) prevents post-exertional malaise, while exceeding it triggers crashes. The goal is to gradually expand the envelope through careful, consistent pacing rather than pushing through." },
];

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(html) {
  return stripHtml(html).split(/\s+/).filter(Boolean).length;
}

/**
 * Build the system prompt for the Paul Wagner / Tender Guide voice.
 */
function buildSystemPrompt() {
  return `You are writing as Kalesh for Chronic Mystery, a website about ME/CFS and chronic fatigue.

VOICE: You write in the Paul Wagner "Tender Guide" register. You sit beside the reader in their pain. You are compassionate, warm, direct, and never preachy. You use contractions freely (I've, you're, don't, can't, it's, that's, here's, won't). You include conversational interjections like "Stay with me here", "I know, I know", "Wild, right?", "And here is the thing", "Think about that", "Bear with me", "This part matters", "Seriously, though", "Let that sink in", "I get it", "How does that make you feel?", "Right?!", "Know what I mean?", "Sit with that for a moment", "You are not alone in this", "That matters".

STRICT RULES:
1. NEVER use em dashes. Use " - " (space hyphen space) instead.
2. NEVER use these words: delve, tapestry, leverage, unlock, empower, furthermore, moreover, nuanced, multifaceted, paradigm, robust, foster, realm, myriad, pivotal, cornerstone, intricate, embark, profound, transformative, holistic, utilize, facilitate, comprehensive, innovative, streamline, synergy, optimize, underscore, landscape, navigate, spearhead, harness, testament, beacon, catalyst, resonate, encompass, framework, elevate, unveil, unravel, groundbreaking.
3. NEVER use these phrases: "in conclusion", "it's important to note", "dive deep into", "plays a crucial role", "a testament to", "in the realm of", "paving the way", "game-changer", "first and foremost", "last but not least", "buckle up", "stay tuned", "let's explore", "this article will explore".
4. Write 1,500-2,000 words.
5. Use at least 4 conversational interjections from this list: "Stay with me here", "I know, I know", "Wild, right?", "And here is the thing", "Think about that", "Bear with me", "This part matters", "Seriously, though", "Let that sink in", "I get it", "How does that make you feel?", "Right?!", "Know what I mean?".
6. Include at least 4 <h2> section headings.
7. Write in HTML format with <p>, <h2>, <em>, <ul>/<li> tags. No <h1>. No markdown.
8. Reference real research or researchers when relevant.
9. Never start with "In this article" or "Today we will". Start with a personal hook, question, or observation.
10. Output ONLY the HTML. No preamble, no explanation, no code fences.`;
}

/**
 * Generate a single article via DeepSeek V4-Pro.
 * @param {object} opts - { title, category, products, researcher, openerType, conclusionType, finalHeader }
 * @returns {Promise<object>} Article object matching the Article interface
 */
export async function generateArticle(opts) {
  const {
    title,
    category,
    products = [],
    researcher = pickRandom(RESEARCHERS, 1)[0],
    openerType = pickRandom(OPENER_TYPES, 1)[0],
    conclusionType = pickRandom(CONCLUSION_TYPES, 1)[0],
    finalHeader = pickRandom(FINAL_HEADERS, 1)[0],
    dateISO,
    id,
    usedImageIds = [],
    maxRetries = 3,
  } = opts;

  const categoryName = CATEGORY_NAMES[category] || "The Mystery";
  const slug = slugify(title);

  // Pick 3-4 products for affiliate links (injected post-generation)
  let affiliateProducts = products;
  if (affiliateProducts.length === 0) {
    const targetCount = 3 + Math.floor(Math.random() * 2); // 3 or 4
    const matched = matchProducts({ title, body: title + " " + category, count: targetCount });
    affiliateProducts = matched;

    // Fallback: if matchProducts returned fewer than 3, fill with random products
    if (affiliateProducts.length < 3) {
      const { getAllProducts } = await import("./match-products.mjs");
      const allProducts = getAllProducts();
      const usedAsins = new Set(affiliateProducts.map(p => p.asin));
      const available = allProducts.filter(p => !usedAsins.has(p.asin));
      // Shuffle and pick
      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }
      const needed = targetCount - affiliateProducts.length;
      const extras = available.slice(0, needed).map(p => ({
        name: p.name,
        asin: p.asin,
        softIntro: p.softIntro || "Something worth considering is",
        category: p.category,
        tags: p.tags,
      }));
      affiliateProducts = [...affiliateProducts, ...extras];
    }
  }

  const userPrompt = `Write an article titled "${title}" for the "${categoryName}" section.

Category context: ${getCategoryContext(category)}

Opener style: ${openerType} (start with a ${openerType} hook)
Conclusion style: ${conclusionType}
Final section heading: "${finalHeader}"

Reference researcher: ${researcher.name} (${researcher.field}) - mention their work naturally, not as a citation dump.

Write 1,500-2,000 words. Use contractions. Use interjections. No em dashes. Output ONLY raw HTML.`;

  let body = null;
  let gateResult = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 32768,
      });

      body = response.choices[0]?.message?.content || "";

      // Strip markdown code fences if present (greedy - handles nested fences)
      body = body.replace(/^```[a-z]*\n?/gi, "").replace(/\n?```\s*$/gi, "").trim();
      // Also strip any leading text before the first HTML tag
      const firstTag = body.indexOf("<");
      if (firstTag > 0 && firstTag < 200) {
        body = body.substring(firstTag);
      }

      // Run sanitizeBody to catch any remaining issues
      body = sanitizeBody(body);

      // Inject affiliate links into the body post-generation
      body = injectAffiliateLinks(body, affiliateProducts);

      // Run quality gate (links are now injected, so they should pass)
      gateResult = qualityGate(body, { requireAsinCount: true });

      if (gateResult.pass) {
        break;
      }

      // Only retry if word count is too low (other issues are auto-fixed)
      const onlyWordIssue = gateResult.failures.every(f => f.startsWith("words-"));
      if (gateResult.wordCount >= 800) {
        // Accept it - sanitizeBody handles the rest
        console.log(`[DeepSeek] Accepting with soft failures: ${gateResult.failures.join(", ")}`);
        break;
      }

      console.log(`[DeepSeek] Attempt ${attempt}/${maxRetries} failed gate: ${gateResult.failures.join(", ")}`);
    } catch (err) {
      console.error(`[DeepSeek] API error on attempt ${attempt}: ${err.message}`);
      if (attempt === maxRetries) throw err;
      // Longer backoff for socket/network errors
      const backoffMs = err.message.includes('terminated') || err.message.includes('socket') ? 15000 : 10000;
      await new Promise(r => setTimeout(r, backoffMs));
    }
  }

  if (!body || (gateResult && gateResult.wordCount < 100)) {
    throw new Error(`Failed to generate article "${title}" after ${maxRetries} attempts (last gate: ${gateResult ? gateResult.failures.join(", ") : "no body"})`);
  }

  // If gate didn't pass but we have a reasonable article, accept it
  // (sanitizeBody already cleaned AI words/phrases/em dashes)
  if (gateResult && !gateResult.pass) {
    console.log(`[DeepSeek] Accepting "${title}" with soft failures: ${gateResult.failures.join(", ")}`);
  }

  // Pick image from library
  const image = pickImage(category, usedImageIds);

  // Pick 2 FAQ items
  const faqs = pickRandom(FAQ_BANK, 2);

  const wc = countWords(body);

  return {
    id: id || 0,
    slug,
    title,
    description: generateDescription(title, category),
    category,
    categoryName,
    dateISO: dateISO || new Date().toISOString(),
    readingTime: Math.max(5, Math.round(wc / 220)),
    wordCount: wc,
    body,
    faqCount: faqs.length,
    faqItems: faqs,
    openerType,
    conclusionType,
    linkType: "org-nofollow",
    researcherName: researcher.name,
    phrasesUsed: extractPhrases(body),
    finalHeader,
    imageDescription: `${title} - editorial photography for chronic fatigue article`,
    heroImage: image.url,
    ogImage: image.url,
    gateResult: gateResult ? { pass: gateResult.pass, wordCount: gateResult.wordCount, voiceSignals: gateResult.voiceSignals, amazonLinks: gateResult.amazonLinks } : null,
    _imageId: image.id,
  };
}

/**
 * Inject affiliate links into an article body post-generation.
 * Finds <h2> sections and inserts a product recommendation paragraph after every other section.
 * Also adds an affiliate disclosure at the end.
 * @param {string} body - HTML article body
 * @param {Array} products - Array of { name, asin, softIntro } objects
 * @returns {string} body with affiliate links injected
 */
function injectAffiliateLinks(body, products) {
  if (!products || products.length === 0) return body;

  const tag = AMAZON_TAG;

  // Build the link HTML for each product
  const linkHtmls = products.map(p => {
    const url = `https://www.amazon.com/dp/${p.asin}?tag=${tag}`;
    const intro = p.softIntro || "Something worth considering is";
    return `<p>${intro} <a href="${url}" target="_blank" rel="nofollow sponsored">${p.name}</a> (paid link).</p>`;
  });

  // Find all </p> positions that follow an <h2> section (after the first paragraph of each section)
  // Strategy: split by </h2>, then insert links after the first </p> in each section
  const h2Splits = body.split(/<\/h2>/i);

  if (h2Splits.length <= 1) {
    // No h2 sections - just append links before the end
    const disclosure = `<p><em>This article contains affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you. This helps support Chronic Mystery.</em></p>`;
    return body + "\n" + linkHtmls.join("\n") + "\n" + disclosure;
  }

  // Insert links after the first </p> in sections 2, 4, 6, etc. (0-indexed: sections 1, 3, 5)
  let linkIdx = 0;
  const result = [];

  for (let i = 0; i < h2Splits.length; i++) {
    let section = h2Splits[i];

    // For sections after the first (i > 0), try to insert a link after the first </p>
    if (i > 0 && linkIdx < linkHtmls.length) {
      // Insert after the 2nd </p> in this section for more natural placement
      const pCloseIdx = section.indexOf("</p>");
      if (pCloseIdx !== -1) {
        const secondPClose = section.indexOf("</p>", pCloseIdx + 4);
        const insertAt = secondPClose !== -1 ? secondPClose + 4 : pCloseIdx + 4;
        section = section.slice(0, insertAt) + "\n" + linkHtmls[linkIdx] + section.slice(insertAt);
        linkIdx++;
      }
    }

    result.push(section);
  }

  let injected = result.join("</h2>");

  // Add any remaining links that didn't get placed
  while (linkIdx < linkHtmls.length) {
    const lastP = injected.lastIndexOf("</p>");
    if (lastP !== -1) {
      injected = injected.slice(0, lastP + 4) + "\n" + linkHtmls[linkIdx] + injected.slice(lastP + 4);
    } else {
      injected += "\n" + linkHtmls[linkIdx];
    }
    linkIdx++;
  }

  // Add affiliate disclosure at the end
  const disclosure = `<p><em>This article contains affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you. This helps support Chronic Mystery.</em></p>`;
  injected += "\n" + disclosure;

  return injected;
}

function getCategoryContext(category) {
  const contexts = {
    "the-mystery": "The unanswered questions, the diagnostic odyssey, and the science that is still catching up to what the body already knows.",
    "the-medical": "Research, treatments, and the evolving medical understanding of conditions that were dismissed for decades.",
    "the-management": "Pacing, energy envelopes, and the practical strategies that make the difference between surviving and living.",
    "the-identity": "Who are you when you can not perform? The grief, the reinvention, and the unexpected gifts of forced stillness.",
    "the-deeper-rest": "Beyond sleep. The contemplative, spiritual, and philosophical dimensions of illness as a teacher.",
  };
  return contexts[category] || contexts["the-mystery"];
}

function generateDescription(title, category) {
  const lower = title.toLowerCase();
  if (category === "the-medical") {
    return `What the research actually says about ${lower}, and what it means for people living with ME/CFS and chronic fatigue.`;
  }
  if (category === "the-management") {
    return `Practical strategies for ${lower} when you are living with chronic fatigue. Real approaches that work within your energy limits.`;
  }
  if (category === "the-identity") {
    return `${title} - exploring identity, grief, and reinvention when chronic illness changes everything you thought you knew about yourself.`;
  }
  if (category === "the-deeper-rest") {
    return `${title} - the contemplative and spiritual dimensions of chronic illness, rest as practice, and finding meaning in the slowdown.`;
  }
  return `${title} - the questions nobody is asking, the science still catching up, and what your body already knows about chronic fatigue.`;
}

function extractPhrases(body) {
  const markers = [
    "Stay with me", "I know, I know", "Wild, right", "Think about that",
    "And here is the thing", "Bear with me", "This part matters",
    "Seriously, though", "Let that sink in", "I get it",
    "How does that make you feel", "Right?!", "Know what I mean",
  ];
  return markers.filter(m => body.includes(m)).slice(0, 3);
}

/**
 * Duplicate a library image on Bunny CDN with a new slug-based name.
 * This gives each article a unique URL for SEO while reusing the same 40 images.
 * @param {string} sourceUrl - URL of the library image
 * @param {string} slug - Article slug for the new filename
 * @returns {Promise<{heroUrl: string, ogUrl: string}>}
 */
export async function duplicateImageOnBunny(sourceUrl, slug) {
  const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || "chronic-mystery";
  const BUNNY_API_KEY = process.env.BUNNY_API_KEY || "";
  const BUNNY_CDN_HOST = process.env.BUNNY_PULL_ZONE_URL
    ? process.env.BUNNY_PULL_ZONE_URL.replace(/^https?:\/\//, "")
    : "chronic-mystery.b-cdn.net";

  if (!BUNNY_API_KEY) {
    // No Bunny key - just return the library URL directly
    return { heroUrl: sourceUrl, ogUrl: sourceUrl };
  }

  try {
    // Fetch the source image
    const imageResponse = await fetch(sourceUrl);
    if (!imageResponse.ok) {
      console.log(`[IMAGE] Could not fetch source image, using library URL directly`);
      return { heroUrl: sourceUrl, ogUrl: sourceUrl };
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Upload as hero image
    const heroPath = `images/hero/${slug}.webp`;
    const heroUploadUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${heroPath}`;
    const heroRes = await fetch(heroUploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": "application/octet-stream",
        "Content-Length": imageBuffer.length.toString(),
      },
      body: imageBuffer,
    });

    // Upload as OG image
    const ogPath = `images/og/${slug}.webp`;
    const ogUploadUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${ogPath}`;
    const ogRes = await fetch(ogUploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": "application/octet-stream",
        "Content-Length": imageBuffer.length.toString(),
      },
      body: imageBuffer,
    });

    const heroUrl = heroRes.ok
      ? `https://${BUNNY_CDN_HOST}/${heroPath}`
      : sourceUrl;
    const ogUrl = ogRes.ok
      ? `https://${BUNNY_CDN_HOST}/${ogPath}`
      : sourceUrl;

    return { heroUrl, ogUrl };
  } catch (err) {
    console.error(`[IMAGE] Bunny duplication failed: ${err.message}`);
    return { heroUrl: sourceUrl, ogUrl: sourceUrl };
  }
}

export default { generateArticle, duplicateImageOnBunny, CATEGORIES, RESEARCHERS };
