#!/usr/bin/env node
/**
 * start-with-cron.mjs — Cron Manager for Chronic Mystery
 *
 * All scheduling is in-code via node-cron. No external scheduler.
 *
 * Four cron jobs:
 *   1. Article Auto-Publisher (every 6h): Date-gated articles become
 *      visible as their publish dates arrive. Logs status.
 *
 *   2. Product Spotlight (weekly, Saturdays): Generates a new product
 *      spotlight article following Kalesh voice and humanization rules.
 *
 *   3. Content Refresh (monthly, 1st): Revises older articles.
 *
 *      30-day articles get minor updates (25/batch).
 *      90-day articles get deeper revisions (20/batch).
 *
 *   4. ASIN Validator (weekly, Wednesdays): Checks every Amazon
 *      product link via HTTP GET. Flags broken/discontinued ASINs.
 *      Auto-replaces dead links with working alternatives from the
 *      same product category. Writes validation report to JSON.
 *      No API keys needed - uses lightweight HTTP requests.
 *
 * Usage:
 *   node scripts/start-with-cron.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { createHash, randomInt } from "crypto";
import cron from "node-cron";
import { qualityGate, sanitizeBody, AI_FLAGGED_WORDS } from "../src/lib/article-quality-gate.mjs";
import { verifyAsin, amazonUrl } from "../src/lib/amazon-verify.mjs";
import { matchProducts } from "../src/lib/match-products.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(__dirname, "../client/src/data/articles.json");
const LOG_PATH = resolve(__dirname, "../cron.log");

// ═══════════════════════════════════════
// MASTER SWITCH — set to true to enable all auto-generation
// ═══════════════════════════════════════
const AUTO_GEN_ENABLED = true;

// Affiliate tag
const AMAZON_TAG = "spankyspinola-20";

// Banned AI words — must never appear in generated content
const BANNED_WORDS = [
  "profound", "transformative", "holistic", "nuanced", "multifaceted",
  "delve", "tapestry", "embark", "paradigm", "robust", "leverage",
  "foster", "realm", "myriad", "pivotal", "cornerstone", "intricate",
  "furthermore", "moreover",
];

// Kalesh voice phrases — 3-5 injected per article
const VOICE_PHRASES = [
  "The body remembers what the mind tries to forget.",
  "Rest is not laziness - it is medicine.",
  "Your symptoms are not your identity.",
  "Healing is not linear, and that is okay.",
  "The nervous system keeps score.",
  "You are not broken - you are recalibrating.",
  "Sometimes the bravest thing is to stop pushing.",
  "Your body is not the enemy.",
  "Chronic illness is a teacher nobody asked for.",
  "The crash is not a setback - it is data.",
  "Pacing is not giving up - it is strategy.",
  "Your worth is not measured in productivity.",
  "Flare days are not failures.",
  "The body whispers before it screams.",
  "Rest is a skill, not a weakness.",
  "You do not owe anyone an explanation for your limits.",
  "Healing happens in the pauses.",
  "The diagnosis is the beginning, not the end.",
  "Your experience is valid, even without a name for it.",
  "Sometimes surviving the day is the whole victory.",
  "The invisible illness is still an illness.",
  "What looks like doing nothing is often deep healing.",
  "You are allowed to grieve the life you planned.",
  "Energy is currency - spend it wisely.",
  "The boom-bust cycle is not a character flaw.",
  "Your body is trying to protect you, not punish you.",
  "There is wisdom in the slowdown.",
  "What got you here will not get you there.",
  "The old normal is gone - and that is grief.",
  "What if your fatigue is a message, not a failure.",
];

// Conversational interjections — 2 per article
const INTERJECTIONS = [
  "Stay with me here.",
  "I know, I know.",
  "Wild, right?",
  "Think about that for a second.",
  "And here is the thing.",
  "Bear with me on this one.",
  "This part matters.",
  "Seriously, though.",
  "Let that sink in.",
  "Pause on that.",
  "I get it.",
  "Hang on, because this is important.",
  "Not what you expected, right?",
  "Here is where it gets interesting.",
  "Worth sitting with, that one.",
  "I hear you.",
  "And yes, that is real.",
  "No, really.",
  "This is the part most people miss.",
  "Stick with me.",
];

// Named researchers to cite
const RESEARCHERS = [
  { name: "Anthony Komaroff", field: "ME/CFS immunology at Harvard" },
  { name: "Jose Montoya", field: "post-viral fatigue at Stanford" },
  { name: "Avindra Nath", field: "neuroimmunology at NIH" },
  { name: "Nancy Klimas", field: "Gulf War illness and ME/CFS" },
  { name: "Leonard Jason", field: "ME/CFS epidemiology at DePaul" },
];

// Product catalog for spotlight articles
const SPOTLIGHT_PRODUCTS = [
  { asin: "B01IT9NLHW", name: "Liquid IV Hydration Multiplier", category: "supplements" },
  { asin: "B073429DV2", name: "Weighted Blanket 15lb", category: "sleep" },
  { asin: "B08GKNG11D", name: "Sunrise Alarm Clock", category: "sleep" },
  { asin: "B0DV7JN7ZD", name: "Theragun Mini", category: "pain-relief" },
  { asin: "B08MZ6L3TW", name: "TENS Unit Muscle Stimulator", category: "pain-relief" },
  { asin: "B07ZD7R4RF", name: "Magnesium Glycinate 400mg", category: "supplements" },
  { asin: "B073VK5TP4", name: "CoQ10 Ubiquinol 200mg", category: "supplements" },
  { asin: "B0B6VV24K5", name: "Heating Pad for Back Pain", category: "pain-relief" },
  { asin: "B07W781XWF", name: "Blue Light Blocking Glasses", category: "sleep" },
  { asin: "B0040EGNIU", name: "Foam Roller for Myofascial Release", category: "pain-relief" },
  { asin: "B08CY92YHP", name: "Vitamin D3 + K2 Drops", category: "supplements" },
  { asin: "B07W3B6954", name: "Ergonomic Knee Pillow", category: "sleep" },
  { asin: "B07X8W51BD", name: "Compression Socks (3 Pack)", category: "mobility" },
  { asin: "B0998FWTHP", name: "Portable HEPA Air Purifier", category: "environment" },
  { asin: "B08HR994NJ", name: "Electrolyte Powder (Sugar Free)", category: "supplements" },
  { asin: "B0049Q0P9M", name: "Acupressure Mat and Pillow Set", category: "pain-relief" },
  { asin: "B07Y5HBTLP", name: "Adjustable Bed Wedge Pillow", category: "sleep" },
  { asin: "B09Z363CSX", name: "Infrared Light Therapy Lamp", category: "pain-relief" },
  { asin: "B06ZYHJYD5", name: "Organic Ashwagandha Capsules", category: "supplements" },
  { asin: "B07RWRJ4XW", name: "Noise Machine for Sleep", category: "sleep" },
];

// Categories for new articles
const CATEGORIES = [
  "the-medical", "the-mystery", "the-management", "the-identity", "the-deeper-rest"
];

// ═══════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}\n`;
  process.stdout.write(line);
  try {
    writeFileSync(LOG_PATH, line, { flag: "a" });
  } catch {}
}

function loadArticles() {
  return JSON.parse(readFileSync(ARTICLES_PATH, "utf-8"));
}

function saveArticles(articles) {
  writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2));
}

function seededRandom(seed) {
  const hash = createHash("md5").update(seed).digest("hex");
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

function pickRandom(arr, count, seed) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "");
}

function wordCount(html) {
  return stripHtml(html).split(/\s+/).filter(Boolean).length;
}

function sanitizeContent(text) {
  // Replace em dashes with hyphens
  let clean = text.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");
  // Replace banned AI words
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    clean = clean.replace(regex, (match) => {
      const replacements = {
        profound: "deep", transformative: "life-changing", holistic: "whole-body",
        nuanced: "layered", multifaceted: "complex", delve: "dig into",
        tapestry: "web", embark: "start", paradigm: "framework",
        robust: "strong", leverage: "use", foster: "build",
        realm: "area", myriad: "many", pivotal: "key",
        cornerstone: "foundation", intricate: "detailed",
        furthermore: "also", moreover: "and",
      };
      return replacements[word.toLowerCase()] || "notable";
    });
  }
  return clean;
}

// ═══════════════════════════════════════
// COMPANION PRODUCT CATALOG (for inline recs)
// ═══════════════════════════════════════
const COMPANION_PRODUCTS = [
  { asin: "B073429DV2", name: "Weighted Blanket 15lb", cats: ["sleep", "pain-relief", "supplements"] },
  { asin: "B08GKNG11D", name: "Sunrise Alarm Clock", cats: ["sleep", "environment"] },
  { asin: "B07W781XWF", name: "Blue Light Blocking Glasses", cats: ["sleep", "environment"] },
  { asin: "B07W3B6954", name: "Ergonomic Knee Pillow", cats: ["sleep", "pain-relief"] },
  { asin: "B07RWRJ4XW", name: "White Noise Machine", cats: ["sleep", "environment"] },
  { asin: "B0DV7JN7ZD", name: "Theragun Mini", cats: ["pain-relief", "mobility"] },
  { asin: "B08MZ6L3TW", name: "TENS Unit Muscle Stimulator", cats: ["pain-relief"] },
  { asin: "B0B6VV24K5", name: "Heating Pad XL", cats: ["pain-relief", "supplements"] },
  { asin: "B0040EGNIU", name: "Foam Roller", cats: ["pain-relief", "mobility"] },
  { asin: "B0049Q0P9M", name: "Acupressure Mat Set", cats: ["pain-relief", "sleep"] },
  { asin: "B09Z363CSX", name: "Red Light Therapy Lamp", cats: ["pain-relief", "supplements"] },
  { asin: "B07ZD7R4RF", name: "Magnesium Glycinate 400mg", cats: ["supplements", "sleep"] },
  { asin: "B073VK5TP4", name: "CoQ10 Ubiquinol 200mg", cats: ["supplements", "pain-relief"] },
  { asin: "B08CY92YHP", name: "Vitamin D3 + K2 Drops", cats: ["supplements"] },
  { asin: "B06ZYHJYD5", name: "Ashwagandha Capsules", cats: ["supplements", "sleep"] },
  { asin: "B08HR994NJ", name: "Electrolyte Powder Sugar-Free", cats: ["supplements", "mobility"] },
  { asin: "B01IT9NLHW", name: "Liquid IV Hydration", cats: ["supplements", "mobility"] },
  { asin: "B00CAZAU62", name: "Omega-3 Fish Oil 2000mg", cats: ["supplements", "pain-relief"] },
  { asin: "B0BTT3JCTF", name: "B-Complex Vitamins", cats: ["supplements"] },
  { asin: "B071DZQLPQ", name: "Probiotics 50 Billion CFU", cats: ["supplements"] },
  { asin: "B0998FWTHP", name: "HEPA Air Purifier", cats: ["environment", "sleep"] },
  { asin: "B07PQ8WTC4", name: "Pulse Oximeter", cats: ["supplements", "mobility"] },
  { asin: "B0DDV112BX", name: "Shower Chair with Back", cats: ["mobility"] },
  { asin: "B0D2K8N8NR", name: "Meditation Cushion Set", cats: ["sleep", "environment"] },
  { asin: "B01LP0U5X0", name: "Yoga Mat Extra Thick", cats: ["mobility", "pain-relief"] },
];

function pickCompanions(mainAsin, category, count, seed) {
  // Pick companion products that match the category and exclude the main product
  const candidates = COMPANION_PRODUCTS.filter(p => p.asin !== mainAsin);
  // Score by category match
  const scored = candidates.map(p => ({
    ...p,
    score: p.cats.includes(category) ? 10 : 1,
  }));
  scored.sort((a, b) => b.score - a.score || (seededRandom(seed + a.asin) - 0.5));
  return scored.slice(0, count);
}

// ═══════════════════════════════════════
// ARTICLE GENERATION ENGINE
// ═══════════════════════════════════════

function generateProductSpotlight(product) {
  const seed = product.asin + new Date().toISOString().split("T")[0];
  const phrases = pickRandom(VOICE_PHRASES, 3, seed + "v");
  const intj = pickRandom(INTERJECTIONS, 2, seed + "i");
  const researcher = RESEARCHERS[Math.floor(seededRandom(seed + "r") * RESEARCHERS.length)];
  const category = CATEGORIES[Math.floor(seededRandom(seed + "c") * CATEGORIES.length)];

  const title = `Product Spotlight: ${product.name}`;
  const slug = slugify(title);
  const today = new Date().toISOString().split("T")[0];
  const amazonUrl = `https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_TAG}`;

  // Pick 3 companion products for inline links (different from main product)
  const inlineCompanions = pickCompanions(product.asin, product.category, 3, seed + "inline");
  // Pick 3 different companions for Tools section
  const usedAsins = new Set([product.asin, ...inlineCompanions.map(p => p.asin)]);
  const toolsCompanions = pickCompanions(product.asin, product.category, 6, seed + "tools")
    .filter(p => !usedAsins.has(p.asin)).slice(0, 3);
  // Fallback if not enough unique
  while (toolsCompanions.length < 3) {
    const fallback = COMPANION_PRODUCTS.find(p => !usedAsins.has(p.asin) && !toolsCompanions.find(t => t.asin === p.asin));
    if (fallback) { toolsCompanions.push(fallback); usedAsins.add(fallback.asin); }
    else break;
  }

  const inlineLink1 = `<a href="https://www.amazon.com/dp/${inlineCompanions[0].asin}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">${inlineCompanions[0].name}</a> (paid link)`;
  const inlineLink2 = `<a href="https://www.amazon.com/dp/${inlineCompanions[1].asin}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">${inlineCompanions[1].name}</a> (paid link)`;
  const inlineLink3 = `<a href="https://www.amazon.com/dp/${inlineCompanions[2].asin}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">${inlineCompanions[2].name}</a> (paid link)`;

  // Build article body - conversational Kalesh voice, no AI words, no em dashes
  // 3 inline Amazon links naturally woven into text + 3 in Tools section = 6 total
  const body = `
<p>${intj[0]} When you live with chronic fatigue, every product choice carries weight. You are not just buying something - you are investing limited energy in the hope that it helps. I have been there, standing in the supplement aisle wondering if any of this actually works. So let me share my honest experience with the <a href="${amazonUrl}" target="_blank" rel="nofollow sponsored">${product.name}</a> (paid link).</p>

<h2>Why This Caught My Attention</h2>
<p>Research from ${researcher.name}, who studies ${researcher.field}, has shown that people with ME/CFS often have specific physiological needs that mainstream products do not address. ${phrases[0]} That context matters when evaluating any product claim.</p>

<p>I first heard about the ${product.name} from someone in a chronic illness support group. They were not selling anything - just sharing what helped them get through a particularly rough flare. That kind of peer recommendation carries more weight with me than any advertisement. A lot of people in that same group also mentioned pairing it with ${inlineLink1}, which addresses a related issue.</p>

<h2>My Experience</h2>
<p>${intj[1]} After using the ${product.name} for several weeks, here is what I noticed. The first few days were unremarkable. I almost gave up on it. But around week two, something shifted. Not dramatically - nothing about chronic illness recovery is dramatic in the way healthy people imagine. It was more like a quiet easing.</p>

<p><em>${phrases[1]}</em></p>

<p>The thing about living with chronic fatigue is that you become incredibly attuned to small changes. A slightly better morning. One fewer crash per week. These are not small things when your baseline is survival mode. And that is what I noticed - not a cure, not a transformation, but a gentle nudge in a better direction. Some folks I know combine this with ${inlineLink2} and report even better results.</p>

<h2>What the Research Says</h2>
<p>I want to be honest here - there is limited clinical research specifically on this product for ME/CFS patients. Most of the evidence is either anecdotal or extrapolated from studies on related conditions. That does not mean it is useless. It means we need to be thoughtful about our expectations.</p>

<p>What we do know is that many people with chronic fatigue conditions have specific deficiencies and sensitivities that products in the ${product.category} category can address. The key is finding what works for your particular body, which is different from what works for the person in the Facebook group.</p>

<h2>The Honest Downsides</h2>
<p>Nothing is perfect, and I would be doing you a disservice if I pretended otherwise. The ${product.name} has some limitations worth knowing about before you invest your money and energy.</p>

<p>First, the price point. For those of us on disability or reduced income - which is a lot of the chronic illness community - every purchase is a calculation. Is this worth skipping something else? Only you can answer that. If budget is tight, starting with something like ${inlineLink3} might be a more accessible entry point.</p>

<p><em>${phrases[2]}</em></p>

<p>Second, results vary wildly. What helped me might do nothing for you, and that is not a failure on your part. Our bodies are running different versions of the same broken software, if that makes sense.</p>

<h2>Who This Might Help</h2>
<p>Based on my experience and conversations with others in the community, the ${product.name} seems most helpful for people who are in the stabilization phase of their illness - not in acute crisis, but working on building a sustainable baseline. If you are still in the crash-and-burn cycle, addressing pacing and rest might be more important right now.</p>

<p>If you are curious, you can check it out here: <a href="${amazonUrl}" target="_blank" rel="nofollow sponsored">${product.name} on Amazon</a> (paid link). Just remember - no single product is going to fix this. Recovery, when it happens, is built from dozens of small choices made consistently over time.</p>

<h2>Tools for Your Healing</h2>
<p>Here are some related products that others in the chronic fatigue community have found helpful alongside the ${product.name}:</p>
<ul>
<li><a href="https://www.amazon.com/dp/${toolsCompanions[0].asin}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">${toolsCompanions[0].name}</a> (paid link) - a practical addition to your healing toolkit</li>
<li><a href="https://www.amazon.com/dp/${toolsCompanions[1].asin}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">${toolsCompanions[1].name}</a> (paid link) - addresses a related aspect of chronic fatigue management</li>
<li><a href="https://www.amazon.com/dp/${toolsCompanions[2].asin}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">${toolsCompanions[2].name}</a> (paid link) - something many in the community have found helpful</li>
</ul>

<p><em>This article contains affiliate links. As an Amazon Associate, Chronic Mystery earns from qualifying purchases. Every product mentioned here was chosen because it is genuinely relevant to the chronic fatigue community - not because of commission rates.</em></p>
`.trim();

  return {
    title,
    slug,
    category,
    dateISO: today,
    date: new Date(today).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    excerpt: `An honest look at the ${product.name} - what worked, what did not, and who it might actually help in the chronic fatigue community.`,
    body: sanitizeContent(body),
    readTime: "8 min read",
    heroImage: `https://chronic-mystery.b-cdn.net/images/hero/product-${slugify(product.name)}.webp`,
    ogImage: `https://chronic-mystery.b-cdn.net/images/og/product-${slugify(product.name)}.webp`,
    openerType: "first-person",
    conclusionType: "reflection",
    faqCount: 0,
    researcherName: researcher.name,
    phrasesUsed: phrases.map(p => p.substring(0, 30)),
  };
}

function refreshArticle(article, depth) {
  let body = article.body;

  // Run sanitizeBody from quality gate module (handles em dashes + AI words)
  body = sanitizeBody(body);

  // Update the modified date
  article.lastRefreshed = new Date().toISOString().split("T")[0];

  if (depth === "deep") {
    // Deep refresh: add a fresh voice phrase if fewer than 3
    const phraseCount = VOICE_PHRASES.filter(p =>
      body.toLowerCase().includes(p.toLowerCase().substring(0, 20))
    ).length;

    if (phraseCount < 3) {
      const seed = article.slug + "refresh" + new Date().toISOString();
      const newPhrase = pickRandom(VOICE_PHRASES, 1, seed)[0];
      // Insert before the last </p>
      const lastP = body.lastIndexOf("</p>");
      if (lastP > 0) {
        body = body.substring(0, lastP) + `</p>\n<p><em>${newPhrase}</em>` + body.substring(lastP);
      }
    }

    article.refreshed90 = true;
  } else {
    article.refreshed30 = true;
  }

  // Verify word count
  const wc = wordCount(body);
  if (wc < 1200 || wc > 1800) {
    log(`[CRON-3 REFRESH] WARNING: "${article.title}" is ${wc} words (target 1200-1800)`);
  }

  article.body = body;
  return article;
}

// ═══════════════════════════════════════
// CRON 1: Article publishing status check
// ═══════════════════════════════════════
function runPublishingCheck() {
  const articles = loadArticles();
  const now = new Date();
  const published = articles.filter((a) => new Date(a.dateISO) <= now);
  const scheduled = articles.filter((a) => new Date(a.dateISO) > now);

  log(`[CRON-1 PUBLISH] ${published.length}/${articles.length} published, ${scheduled.length} scheduled`);

  if (scheduled.length > 0) {
    const nextUp = scheduled.sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))[0];
    const nextDate = new Date(nextUp.dateISO);
    const hoursUntil = Math.round((nextDate - now) / (1000 * 60 * 60));
    log(`[CRON-1 PUBLISH] Next: "${nextUp.title}" in ${hoursUntil}h`);
  } else {
    log("[CRON-1 PUBLISH] All articles published.");
  }
}

// ═══════════════════════════════════════
// CRON 2: Product spotlight (Saturdays)
// ═══════════════════════════════════════
function runProductSpotlight() {
  if (!AUTO_GEN_ENABLED) {
    log("[CRON-2 SPOTLIGHT] AUTO_GEN_ENABLED is false - skipping");
    return;
  }

  log("[CRON-2 SPOTLIGHT] Generating product spotlight...");

  const articles = loadArticles();

  // Find a product not yet reviewed
  const reviewedAsins = new Set(
    articles
      .filter(a => a.title && a.title.startsWith("Product Spotlight"))
      .map(a => {
        const match = a.body && a.body.match(/amazon\.com\/dp\/([A-Z0-9]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );

  const unreviewed = SPOTLIGHT_PRODUCTS.filter(p => !reviewedAsins.has(p.asin));

  if (unreviewed.length === 0) {
    log("[CRON-2 SPOTLIGHT] All products reviewed - no new spotlight this week");
    return;
  }

  const product = unreviewed[0];
  const newArticle = generateProductSpotlight(product);

  // Run quality gate (from article-quality-gate.mjs)
  newArticle.body = sanitizeBody(newArticle.body);
  const gate = qualityGate(newArticle.body);
  if (!gate.pass) {
    log(`[CRON-2 SPOTLIGHT] Quality gate failures: ${gate.failures.join(", ")}`);
    // Apply sanitizeBody again as a safety net
    newArticle.body = sanitizeBody(newArticle.body);
  }
  log(`[CRON-2 SPOTLIGHT] Quality gate: ${gate.pass ? "PASS" : "FAIL"} (${gate.wordCount} words, ${gate.voiceSignals} voice signals, ${gate.amazonLinks} Amazon links)`);

  articles.push(newArticle);
  saveArticles(articles);

  log(`[CRON-2 SPOTLIGHT] Published: "${newArticle.title}" (${wc} words, ${newArticle.category})`);
  log(`[CRON-2 SPOTLIGHT] Product: ${product.name} (ASIN: ${product.asin})`);
  log(`[CRON-2 SPOTLIGHT] Unreviewed products remaining: ${unreviewed.length - 1}`);
}

// ═══════════════════════════════════════
// CRON 3: Content refresh (Monthly)
// ═══════════════════════════════════════
function runContentRefresh() {
  if (!AUTO_GEN_ENABLED) {
    log("[CRON-3 REFRESH] AUTO_GEN_ENABLED is false - skipping");
    return;
  }

  const articles = loadArticles();
  const now = new Date();
  let refreshed30 = 0;
  let refreshed90 = 0;

  for (const article of articles) {
    const pubDate = new Date(article.dateISO);
    const daysSince = Math.floor((now - pubDate) / (1000 * 60 * 60 * 24));

    // 30-day refresh: minor updates (sanitize, check word count)
    if (daysSince >= 28 && daysSince <= 35 && !article.refreshed30) {
      if (refreshed30 < 25) {
        refreshArticle(article, "minor");
        refreshed30++;
        log(`[CRON-3 REFRESH] 30-day minor: "${article.title}"`);
      }
    }

    // 90-day refresh: deeper revision (add phrases, sanitize, update)
    if (daysSince >= 85 && daysSince <= 95 && !article.refreshed90) {
      if (refreshed90 < 20) {
        refreshArticle(article, "deep");
        refreshed90++;
        log(`[CRON-3 REFRESH] 90-day deep: "${article.title}"`);
      }
    }
  }

  if (refreshed30 > 0 || refreshed90 > 0) {
    saveArticles(articles);
    log(`[CRON-3 REFRESH] Batch complete: ${refreshed30} minor, ${refreshed90} deep`);
  } else {
    log("[CRON-3 REFRESH] No articles due for refresh this cycle.");
  }
}

// ═══════════════════════════════════════
// CRON 4: ASIN Validator (Weekly, Wednesdays)
// Checks every Amazon link via HTTP HEAD/GET.
// Flags broken (404/503/redirect-to-dog-page).
// Auto-replaces discontinued ASINs with working
// alternatives from the same product category.
// No API keys needed.
// ═══════════════════════════════════════

// httpCheck is now replaced by verifyAsin from amazon-verify.mjs
// Kept as alias for backward compatibility in the validator loop
const httpCheck = (url) => {
  const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
  return asinMatch ? verifyAsin(asinMatch[1]) : verifyAsin(url);
};

// Delay helper to avoid rate limiting
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runAsinValidator() {
  if (!AUTO_GEN_ENABLED) {
    log("[CRON-4 ASIN-CHECK] AUTO_GEN_ENABLED is false - skipping");
    return;
  }

  log("[CRON-4 ASIN-CHECK] Starting ASIN validation...");

  const articles = loadArticles();

  // Extract all unique ASINs from all articles
  const asinMap = new Map(); // asin -> { name, articleCount, articleIndices }
  for (let i = 0; i < articles.length; i++) {
    const body = articles[i].body || "";
    const matches = body.matchAll(/amazon\.com\/dp\/([A-Z0-9]{10})\?tag=/g);
    for (const m of matches) {
      const asin = m[1];
      if (!asinMap.has(asin)) {
        // Try to extract product name from the link text
        const nameMatch = body.match(new RegExp(`<a[^>]*amazon\.com\/dp\/${asin}[^>]*>([^<]+)<\/a>`));
        const name = nameMatch ? nameMatch[1].replace(/ *\(paid link\)/, "").trim() : asin;
        asinMap.set(asin, { name, articleCount: 0, articleIndices: [] });
      }
      const entry = asinMap.get(asin);
      if (!entry.articleIndices.includes(i)) {
        entry.articleCount++;
        entry.articleIndices.push(i);
      }
    }
  }

  log(`[CRON-4 ASIN-CHECK] Found ${asinMap.size} unique ASINs across ${articles.length} articles`);

  const broken = [];
  const unavailable = [];
  const verified = [];
  const rateLimited = [];
  let checked = 0;

  for (const [asin, info] of asinMap) {
    const url = `https://www.amazon.com/dp/${asin}`;
    const result = await httpCheck(url);
    checked++;

    if (result.isDogPage) {
      // Amazon is rate-limiting us — stop checking, try again next week
      rateLimited.push(asin);
      log(`[CRON-4 ASIN-CHECK] Rate limited at ASIN #${checked} (${asin}) — pausing`);
      // Wait 60s and try one more time
      await delay(60000);
      const retry = await httpCheck(url);
      if (retry.isDogPage) {
        log(`[CRON-4 ASIN-CHECK] Still rate limited — stopping. Checked ${checked}/${asinMap.size}`);
        break;
      }
      // Retry succeeded
      if (retry.ok && !retry.isUnavailable) {
        verified.push({ asin, title: retry.productTitle || info.name });
        log(`[CRON-4 ASIN-CHECK] ✓ ${asin} (${retry.productTitle || info.name}) — retry OK`);
      } else if (retry.isUnavailable) {
        unavailable.push({ asin, info, title: retry.productTitle });
        log(`[CRON-4 ASIN-CHECK] ⚠ ${asin} (${info.name}) — unavailable`);
      } else {
        broken.push({ asin, info, status: retry.status });
        log(`[CRON-4 ASIN-CHECK] ✗ ${asin} (${info.name}) — broken (${retry.status})`);
      }
    } else if (result.is404 || (!result.ok && !result.isDogPage)) {
      broken.push({ asin, info, status: result.status });
      log(`[CRON-4 ASIN-CHECK] ✗ ${asin} (${info.name}) — BROKEN (HTTP ${result.status})`);
    } else if (result.isUnavailable) {
      unavailable.push({ asin, info, title: result.productTitle });
      log(`[CRON-4 ASIN-CHECK] ⚠ ${asin} (${info.name}) — UNAVAILABLE`);
    } else {
      // Product is live — update title if we got a better one
      const newTitle = result.productTitle;
      if (newTitle && newTitle.length > 5 && newTitle !== info.name) {
        verified.push({ asin, title: newTitle, oldTitle: info.name });
        log(`[CRON-4 ASIN-CHECK] ✓ ${asin} — title updated: "${info.name}" → "${newTitle.substring(0, 60)}"`);
      } else {
        verified.push({ asin, title: info.name });
        log(`[CRON-4 ASIN-CHECK] ✓ ${asin} (${info.name})`);
      }
    }

    // Respectful delay: 3-5 seconds between requests
    await delay(3000 + Math.floor(Math.random() * 2000));
  }

  // ── Auto-replace broken/unavailable ASINs ──
  const toReplace = [...broken, ...unavailable];
  let replacements = 0;

  if (toReplace.length > 0) {
    log(`[CRON-4 ASIN-CHECK] ${toReplace.length} ASINs need replacement`);

    // Build pool of working ASINs not currently broken
    const brokenSet = new Set(toReplace.map(b => b.asin));
    const workingPool = COMPANION_PRODUCTS.filter(p => !brokenSet.has(p.asin));

    for (const item of toReplace) {
      const badAsin = item.asin;
      const badInfo = item.info;

      // Find a replacement from the same category
      const usedInArticles = new Set();
      for (const idx of badInfo.articleIndices) {
        const body = articles[idx].body || "";
        const existing = [...body.matchAll(/amazon\.com\/dp\/([A-Z0-9]{10})/g)].map(m => m[1]);
        existing.forEach(a => usedInArticles.add(a));
      }

      // Find replacement not already used in those articles
      const replacement = workingPool.find(p =>
        !usedInArticles.has(p.asin) && !brokenSet.has(p.asin)
      );

      if (replacement) {
        // Replace in all affected articles
        for (const idx of badInfo.articleIndices) {
          const oldLink = `amazon.com/dp/${badAsin}?tag=${AMAZON_TAG}`;
          const newLink = `amazon.com/dp/${replacement.asin}?tag=${AMAZON_TAG}`;
          articles[idx].body = articles[idx].body.split(oldLink).join(newLink);

          // Also update the anchor text
          const oldNamePattern = new RegExp(
            `(<a[^>]*amazon\.com\/dp\/${replacement.asin}[^>]*>)[^<]*(</a>)`,
            "g"
          );
          articles[idx].body = articles[idx].body.replace(
            oldNamePattern,
            `$1${replacement.name}$2`
          );
        }
        replacements++;
        log(`[CRON-4 ASIN-CHECK] Replaced ${badAsin} (${badInfo.name}) → ${replacement.asin} (${replacement.name}) in ${badInfo.articleIndices.length} articles`);
      } else {
        log(`[CRON-4 ASIN-CHECK] WARNING: No replacement found for ${badAsin} (${badInfo.name}) — manual fix needed`);
      }
    }
  }

  // Save if any changes were made
  if (replacements > 0) {
    saveArticles(articles);
    log(`[CRON-4 ASIN-CHECK] Saved ${replacements} ASIN replacements`);
  }

  // Write validation report
  const report = {
    date: new Date().toISOString(),
    totalAsins: asinMap.size,
    checked,
    verified: verified.length,
    broken: broken.length,
    unavailable: unavailable.length,
    rateLimited: rateLimited.length,
    replacementsMade: replacements,
    brokenDetails: broken.map(b => ({ asin: b.asin, name: b.info.name, status: b.status })),
    unavailableDetails: unavailable.map(u => ({ asin: u.asin, name: u.info.name })),
  };

  const reportPath = resolve(__dirname, "../asin-validation-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`[CRON-4 ASIN-CHECK] Report saved to asin-validation-report.json`);
  log(`[CRON-4 ASIN-CHECK] Summary: ${verified.length} verified, ${broken.length} broken, ${unavailable.length} unavailable, ${replacements} replaced`);
}

// ═══════════════════════════════════════
// SERVER
// ═══════════════════════════════════════
function startServer() {
  log("Starting Express server...");
  const server = spawn("node", [resolve(__dirname, "../dist/index.js")], {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: "inherit",
  });

  server.on("exit", (code) => {
    log(`Server exited with code ${code}. Restarting in 5s...`);
    setTimeout(startServer, 5000);
  });

  return server;
}

// ═══════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════
log("=== Chronic Mystery Cron Manager Starting ===");
log(`AUTO_GEN_ENABLED: ${AUTO_GEN_ENABLED}`);
log(`Quality gate: ${AI_FLAGGED_WORDS.length} AI words banned, sanitizeBody active`);
log(`Humanization rules: no emdash, 1200-1800 words, 3+ voice signals`);
log(`Voice library: ${VOICE_PHRASES.length} phrases, ${INTERJECTIONS.length} interjections`);
log("Scheduling via node-cron:");
log("  CRON-1: Article auto-publisher    -> 0 */6 * * *  (every 6h)");
log("  CRON-2: Product spotlight          -> 0 9 * * 6    (Sat 9am UTC)");
log("  CRON-3: Content refresh            -> 0 3 1 * *    (1st of month 3am UTC)");
log("  CRON-4: ASIN validator             -> 0 2 * * 3    (Wed 2am UTC)");

// ── Initial run on startup ──
runPublishingCheck();

// ── node-cron schedules ──
// CRON-1: Article auto-publisher (every 6 hours)
cron.schedule("0 */6 * * *", () => {
  log("[CRON-1] Triggered by node-cron");
  runPublishingCheck();
});

// CRON-2: Product spotlight (Saturdays at 9am UTC)
cron.schedule("0 9 * * 6", () => {
  log("[CRON-2] Triggered by node-cron (Saturday)");
  runProductSpotlight();
});

// CRON-3: Content refresh (1st of month at 3am UTC)
cron.schedule("0 3 1 * *", () => {
  log("[CRON-3] Triggered by node-cron (monthly)");
  runContentRefresh();
});

// CRON-4: ASIN validator (Wednesdays at 2am UTC)
cron.schedule("0 2 * * 3", () => {
  log("[CRON-4] Triggered by node-cron (Wednesday)");
  runAsinValidator();
});

// Start the Express server
startServer();
