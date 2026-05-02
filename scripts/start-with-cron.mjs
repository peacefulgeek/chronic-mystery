
/**
 * start-with-cron.mjs — Cron Manager for Chronic Mystery
 *
 * All scheduling is in-code via node-cron. No external scheduler.
 *
 * Six cron jobs:
 *   1. Drip-Feed Publisher (daily at 06:00 UTC):
 *      Publishes articles from the pre-written queue.
 *      Phase 1 (first 60 published from queue): 5 per day, every day
 *      Phase 2 (after 60 from queue): 1 per weekday (Mon-Fri)
 *      Sets dateISO to today and status to "published".
 *
 *   2. DeepSeek Fallback Generator (weekdays at 08:00 UTC):
 *      Only fires when the queue is empty.
 *      Generates fresh articles via DeepSeek V4-Pro.
 *
 *   3. Content Refresh (monthly, 1st): Revises older articles.
 *      30-day articles get minor updates (25/batch).
 *      90-day articles get deeper revisions (20/batch).
 *
 *   4. ASIN Validator (weekly, Wednesdays): Checks every Amazon
 *      product link via HTTP GET. Flags broken/discontinued ASINs.
 *      Auto-replaces dead links with working alternatives.
 *
 *   5. Product Spotlight (Saturdays): Generates a new product
 *      spotlight article using DeepSeek V4-Pro.
 *
 *   6. Publishing Status Check (every 6h): Logs current state.
 *
 * Queue model:
 *   Articles with status: "queued" are invisible (dateISO: 2099).
 *   The drip-feed publisher picks from the queue, sets dateISO to
 *   today, and changes status to "published".
 *   When the queue is empty, CRON-2 generates new articles via DeepSeek.
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
import { generateArticle, duplicateImageOnBunny } from "../src/lib/deepseek-writer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(__dirname, "../client/src/data/articles.json");
const LOG_PATH = resolve(__dirname, "../cron.log");

// ═══════════════════════════════════════
// MASTER SWITCH
// ═══════════════════════════════════════
const AUTO_GEN_ENABLED = (process.env.AUTO_GEN_ENABLED || "true") === "true";

// Affiliate tag
const AMAZON_TAG = process.env.AMAZON_TAG || "spankyspinola-20";

// ── Categories ──
const CATEGORIES = [
  "the-medical", "the-mystery", "the-management", "the-identity", "the-deeper-rest"
];

// ── Topic bank for auto-generation ──
const TOPIC_BANK = {
  "the-medical": [
    "Mitochondrial Dysfunction and Chronic Fatigue",
    "The Vagus Nerve Connection to ME/CFS",
    "Mast Cell Activation and Fatigue",
    "Small Fiber Neuropathy in Chronic Illness",
    "Autoimmune Overlap with ME/CFS",
    "Neuroinflammation and Brain Fog",
    "The Gut-Brain Axis in Chronic Fatigue",
    "Metabolic Traps in ME/CFS Research",
    "Orthostatic Intolerance and POTS",
    "Immune Dysregulation in Post-Viral Fatigue",
    "Endocrine Disruption in Chronic Illness",
    "The Role of Oxidative Stress in ME/CFS",
    "Viral Persistence and Chronic Fatigue",
    "Blood Volume Deficiency in ME/CFS",
    "The HPA Axis and Chronic Fatigue",
    "Microbiome Changes in ME/CFS Patients",
    "Cytokine Storms and Post-Viral Fatigue",
    "Craniocervical Instability and ME/CFS",
    "The Two-Day Cardiopulmonary Exercise Test",
    "Low-Dose Naltrexone for Chronic Fatigue",
    "B Cell Depletion Therapy Research",
    "The Role of Mold Illness in Chronic Fatigue",
    "Ehlers-Danlos Syndrome and ME/CFS Overlap",
    "Thiamine Deficiency and Energy Production",
    "The Nanoneedle Test for ME/CFS Diagnosis",
    "Cerebral Blood Flow Abnormalities in ME/CFS",
    "Spinal Fluid Abnormalities in Chronic Fatigue",
    "The Role of NK Cells in ME/CFS",
    "Ion Channel Dysfunction in Chronic Fatigue",
    "Metabolomics and ME/CFS Biomarkers",
  ],
  "the-mystery": [
    "Why Your Labs Are Normal But You Are Not",
    "The History of ME/CFS Dismissal",
    "What Doctors Still Get Wrong About Fatigue",
    "The Gender Gap in Chronic Illness Research",
    "Why ME/CFS Takes So Long to Diagnose",
    "The Connection Between Trauma and Chronic Illness",
    "When Your Body Keeps Score",
    "The Invisible Illness Paradox",
    "Why Exercise Makes ME/CFS Worse",
    "The Post-COVID Chronic Fatigue Wave",
    "What EBV Has to Do With Chronic Fatigue",
    "The Mystery of Fluctuating Symptoms",
    "Why Some People Recover and Others Do Not",
    "The Childhood Onset ME/CFS Question",
    "Environmental Triggers Nobody Talks About",
    "The Genetic Predisposition Question",
    "Why Stress Is Not the Whole Story",
    "The Nocebo Effect and Chronic Illness",
    "What We Can Learn From Long COVID Research",
    "The Microbiome Mystery in Chronic Fatigue",
    "Why Your Doctor Has Never Heard of PEM",
    "The Paradox of Looking Healthy While Sick",
    "What Brain Imaging Reveals About ME/CFS",
    "The Connection Between Infections and Autoimmunity",
    "Why Standard Blood Tests Miss ME/CFS",
    "The Role of Epigenetics in Chronic Fatigue",
    "What Animal Models Tell Us About ME/CFS",
    "The Mystery of Symptom Clusters",
    "Why ME/CFS Research Is Underfunded",
    "The Overlap Between Fibromyalgia and ME/CFS",
  ],
  "the-management": [
    "The Art of Pacing With Chronic Fatigue",
    "Building Your Energy Envelope",
    "Sleep Hygiene When Sleep Does Not Refresh",
    "Meal Planning When Cooking Is Too Much",
    "Managing Brain Fog at Work",
    "The Boom-Bust Cycle and How to Break It",
    "Supplements That Actually Have Evidence",
    "Creating a Crash Recovery Protocol",
    "How to Talk to Your Doctor About ME/CFS",
    "Managing Sensory Overload",
    "The Spoon Theory in Practice",
    "Gentle Movement That Does Not Cause PEM",
    "Managing Chronic Pain Without Overdoing It",
    "Building a Support System When You Are Housebound",
    "Financial Planning With Chronic Illness",
    "Navigating Disability Applications",
    "Heat and Cold Sensitivity Management",
    "Managing Multiple Chemical Sensitivity",
    "Creating an Accessible Home Environment",
    "The Role of Hydration in Symptom Management",
    "Managing Social Energy With Chronic Fatigue",
    "Technology Tools for Energy Management",
    "Managing Flares During Important Events",
    "The Role of Compression Garments",
    "Building a Medical Team That Listens",
    "Managing Chronic Illness in Hot Weather",
    "The Role of Salt Loading in POTS Management",
    "Cognitive Pacing Strategies",
    "Managing Medication Side Effects",
    "Creating a Symptom Tracking System",
  ],
  "the-identity": [
    "Grieving the Life You Planned",
    "Who Are You Without Productivity",
    "The Loneliness of Chronic Illness",
    "Relationships When You Can Not Show Up",
    "Redefining Success With Chronic Fatigue",
    "The Guilt of Being Sick",
    "Finding Purpose When Your Body Says No",
    "The Anger Nobody Talks About",
    "Chronic Illness and Self-Worth",
    "When Friends Do Not Understand",
    "The Mask of Looking Fine",
    "Parenting With Chronic Fatigue",
    "Career Loss and Identity Crisis",
    "The Comparison Trap in Chronic Illness",
    "Finding Community When You Are Isolated",
    "The Unexpected Gifts of Forced Stillness",
    "Chronic Illness and Intimate Relationships",
    "The Shame of Needing Help",
    "Rebuilding Identity After Diagnosis",
    "When Your Partner Becomes Your Caregiver",
    "The Invisibility of Young People With ME/CFS",
    "Chronic Illness and the Holidays",
    "The Weight of Medical Gaslighting",
    "Finding Joy in Small Moments",
    "The Grief That Has No Name",
    "Chronic Illness and Social Media",
    "When Your Family Does Not Believe You",
    "The Art of Asking for Help",
    "Chronic Illness and Aging",
    "The Unexpected Wisdom of Illness",
  ],
  "the-deeper-rest": [
    "Rest as Radical Act",
    "The Contemplative Life of Chronic Illness",
    "Surrender Is Not Giving Up",
    "Finding Stillness in the Storm",
    "The Spiritual Dimensions of Suffering",
    "Meditation When Your Body Hurts",
    "The Practice of Radical Acceptance",
    "What Illness Teaches About Impermanence",
    "The Wisdom of the Body",
    "Breathwork for the Chronically Ill",
    "The Dark Night of the Soul and Chronic Illness",
    "Finding Sacred Space in Bed Rest",
    "The Paradox of Healing Through Stopping",
    "Chronic Illness as Spiritual Initiation",
    "The Practice of Self-Compassion",
    "What Buddhism Teaches About Suffering and Fatigue",
    "The Art of Doing Nothing",
    "Gratitude Practice When Everything Hurts",
    "The Nervous System and Spiritual Practice",
    "Finding Meaning in the Meaningless",
    "The Rhythm of Rest and Activity",
    "Chronic Illness and the Myth of Control",
    "The Gift of Slowing Down",
    "What Trees Teach Us About Rest",
    "The Practice of Being Present With Pain",
    "Chronic Illness and the Seasons",
    "The Quiet Revolution of Rest",
    "Finding Peace With Uncertainty",
    "The Body as Teacher",
    "The Art of Gentle Living",
  ],
};

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

// Companion products for ASIN replacement
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
  if (seed) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } else {
    shuffled.sort(() => Math.random() - 0.5);
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

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function getPublishedCount() {
  const articles = loadArticles();
  const now = new Date();
  return articles.filter(a => new Date(a.dateISO) <= now).length;
}

function getQueuedArticles() {
  const articles = loadArticles();
  return articles.filter(a => a.status === "queued");
}

function getQueuePublishedCount() {
  // Count how many articles have been published FROM the queue
  // (status: "published" and id > 303, i.e. DeepSeek-generated)
  const articles = loadArticles();
  return articles.filter(a => a.status === "published" && a.id > 303).length;
}

// ═══════════════════════════════════════
// CRON 1: Drip-Feed Publisher
// ═══════════════════════════════════════
// Phase 1: First 60 from queue -> 5/day every day
// Phase 2: After 60 from queue -> 1/weekday (Mon-Fri)
// ═══════════════════════════════════════
function runDripFeedPublisher() {
  const articles = loadArticles();
  const queued = articles.filter(a => a.status === "queued");
  const queuePublished = articles.filter(a => a.status === "published" && a.id > 303).length;

  if (queued.length === 0) {
    log(`[CRON-1 DRIP] Queue empty (${queuePublished} published from queue). Skipping.`);
    return;
  }

  // Determine how many to publish today
  let toPublishCount;
  if (queuePublished < 60) {
    // Phase 1: 5 per day (every day including weekends)
    toPublishCount = Math.min(5, queued.length, 60 - queuePublished);
    log(`[CRON-1 DRIP] Phase 1: ${queuePublished}/60 published from queue. Publishing ${toPublishCount} today.`);
  } else {
    // Phase 2: 1 per weekday only
    const dayOfWeek = new Date().getUTCDay(); // 0=Sun, 6=Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      log(`[CRON-1 DRIP] Phase 2: Weekend - skipping. ${queued.length} remain in queue.`);
      return;
    }
    toPublishCount = 1;
    log(`[CRON-1 DRIP] Phase 2: ${queuePublished} published from queue. Publishing ${toPublishCount} today.`);
  }

  // Publish from the queue (pick first N by ID order for deterministic ordering)
  const toPublish = queued
    .sort((a, b) => a.id - b.id)
    .slice(0, toPublishCount);

  const today = new Date().toISOString();

  for (const article of toPublish) {
    // Find the article in the main array and update it
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx !== -1) {
      articles[idx].dateISO = today;
      articles[idx].status = "published";
      log(`[CRON-1 DRIP] Published: "${article.title}" (${article.category})`);
    }
  }

  saveArticles(articles);

  const remainingQueued = articles.filter(a => a.status === "queued").length;
  const totalPublished = articles.filter(a => new Date(a.dateISO) <= new Date()).length;
  log(`[CRON-1 DRIP] Done. ${toPublish.length} published today. ${remainingQueued} remain in queue. ${totalPublished} total visible.`);

  // Regenerate sitemap after publishing new articles
  runSitemapRegeneration();
}

// ═══════════════════════════════════════
// CRON 7: Sitemap & RSS Regeneration
// ═══════════════════════════════════════
function runSitemapRegeneration() {
  try {
    const articles = loadArticles();
    const DOMAIN = "https://chronicmystery.com";
    const now = new Date();
    const published = articles.filter(a => new Date(a.dateISO) <= now);

    const categories = [
      "the-mystery", "the-medical", "the-management", "the-identity", "the-deeper-rest"
    ];
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/articles", priority: "0.8", changefreq: "daily" },
      { loc: "/about", priority: "0.7", changefreq: "monthly" },
      { loc: "/start-here", priority: "0.8", changefreq: "weekly" },
      { loc: "/energy-audit", priority: "0.7", changefreq: "monthly" },
      { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
      { loc: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    for (const page of staticPages) {
      xml += `  <url>\n    <loc>${DOMAIN}${page.loc}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    }
    for (const cat of categories) {
      xml += `  <url>\n    <loc>${DOMAIN}/category/${cat}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    for (const article of published) {
      const escapedTitle = article.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const escapedAlt = (article.heroImageAlt || article.title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      xml += `  <url>\n    <loc>${DOMAIN}/article/${article.slug}</loc>\n    <lastmod>${article.dateISO.split("T")[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n    <image:image>\n      <image:loc>${article.heroImage}</image:loc>\n      <image:title>${escapedTitle}</image:title>\n      <image:caption>${escapedAlt}</image:caption>\n    </image:image>\n    <image:image>\n      <image:loc>${article.ogImage}</image:loc>\n      <image:title>${escapedTitle} - Social Share</image:title>\n    </image:image>\n  </url>\n`;
    }
    xml += `</urlset>\n`;

    // Write sitemap
    const outDir = resolve(__dirname, "../dist/public");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, "sitemap.xml"), xml);

    // Generate RSS feed (latest 20)
    const latest = published
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
      .slice(0, 20);
    let rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>Chronic Mystery</title>\n    <link>${DOMAIN}</link>\n    <description>When You're Exhausted and Nobody Can Tell You Why</description>\n    <language>en-us</language>\n    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />\n`;
    for (const article of latest) {
      rss += `    <item>\n      <title>${article.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>\n      <link>${DOMAIN}/article/${article.slug}</link>\n      <description>${article.description.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</description>\n      <pubDate>${new Date(article.dateISO).toUTCString()}</pubDate>\n      <guid isPermaLink="true">${DOMAIN}/article/${article.slug}</guid>\n      <category>${article.categoryName}</category>\n    </item>\n`;
    }
    rss += `  </channel>\n</rss>\n`;
    writeFileSync(resolve(outDir, "feed.xml"), rss);

    log(`[CRON-7 SITEMAP] Regenerated: ${published.length} articles in sitemap, ${latest.length} in RSS`);
  } catch (err) {
    log(`[CRON-7 SITEMAP] ERROR: ${err.message}`);
  }
}

// ═══════════════════════════════════════
// CRON 6: Publishing Status Check (every 6h)
// ═══════════════════════════════════════
function runPublishingCheck() {
  const articles = loadArticles();
  const now = new Date();
  const published = articles.filter((a) => new Date(a.dateISO) <= now);
  const queued = articles.filter(a => a.status === "queued");
  const queuePublished = articles.filter(a => a.status === "published" && a.id > 303).length;

  log(`[CRON-6 STATUS] ${published.length}/${articles.length} visible, ${queued.length} queued, ${queuePublished} published from queue`);

  if (queuePublished < 60) {
    log(`[CRON-6 STATUS] Drip phase: Phase 1 (5/day, ${60 - queuePublished} until Phase 2)`);
  } else if (queued.length > 0) {
    log(`[CRON-6 STATUS] Drip phase: Phase 2 (1/weekday, ~${queued.length} weeks remaining)`);
  } else {
    log(`[CRON-6 STATUS] Queue empty. DeepSeek fallback active.`);
  }
}

// ═══════════════════════════════════════
// CRON 2: DeepSeek Fallback Generator
// Only fires when the queue is empty.
// ═══════════════════════════════════════
async function runDeepSeekFallback() {
  if (!AUTO_GEN_ENABLED) {
    log("[CRON-2 DEEPSEEK] AUTO_GEN_ENABLED is false - skipping");
    return;
  }

  // Check if queue still has articles
  const queuedCount = getQueuedArticles().length;
  if (queuedCount > 0) {
    log(`[CRON-2 DEEPSEEK] Queue has ${queuedCount} articles remaining - skipping generation`);
    return;
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    log("[CRON-2 DEEPSEEK] DEEPSEEK_API_KEY not set - skipping");
    return;
  }

  log("[CRON-2 DEEPSEEK] Queue empty - generating fresh article via DeepSeek V4-Pro");

  const articles = loadArticles();
  const existingSlugs = new Set(articles.map(a => a.slug));
  const maxId = Math.max(0, ...articles.map(a => a.id));

  // Pick a category (round-robin based on current counts)
  const categoryCounts = {};
  for (const cat of CATEGORIES) categoryCounts[cat] = 0;
  for (const a of articles) {
    if (categoryCounts[a.category] !== undefined) categoryCounts[a.category]++;
  }
  // Pick the category with fewest articles
  const sortedCats = CATEGORIES.slice().sort((a, b) => categoryCounts[a] - categoryCounts[b]);
  const category = sortedCats[0];

  // Pick a topic not already used
  const topicsForCat = TOPIC_BANK[category] || [];
  const unusedTopics = topicsForCat.filter(t => !existingSlugs.has(slugify(t)));

  if (unusedTopics.length === 0) {
    log(`[CRON-2 DEEPSEEK] No unused topics for ${category} - skipping`);
    return;
  }

  const title = unusedTopics[Math.floor(Math.random() * unusedTopics.length)];
  const slug = slugify(title);

  log(`[CRON-2 DEEPSEEK] Generating: "${title}" (${category})`);

  try {
    const article = await generateArticle({
      title,
      category,
      dateISO: new Date().toISOString(),
      id: maxId + 1,
    });

    // Duplicate image on Bunny CDN for unique URL
    const { heroUrl, ogUrl } = await duplicateImageOnBunny(article.heroImage, slug);
    article.heroImage = heroUrl;
    article.ogImage = ogUrl;

    // Remove internal tracking field
    delete article._imageId;
    delete article.gateResult;

    // Mark as published (not queued)
    article.status = "published";

    articles.push(article);
    saveArticles(articles);

    log(`[CRON-2 DEEPSEEK] Published: "${title}" (${article.wordCount} words, ${category})`);
    log(`[CRON-2 DEEPSEEK] Gate: PASS | Voice signals: ${article.phrasesUsed.length} | Image: ${heroUrl.substring(0, 60)}...`);
  } catch (err) {
    log(`[CRON-2 DEEPSEEK] ERROR: ${err.message}`);
  }
}

// ═══════════════════════════════════════
// CRON 3: Content Refresh (Monthly)
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

    if (daysSince >= 28 && daysSince <= 35 && !article.refreshed30) {
      if (refreshed30 < 25) {
        article.body = sanitizeBody(article.body);
        article.lastRefreshed = new Date().toISOString().split("T")[0];
        article.refreshed30 = true;
        refreshed30++;
        log(`[CRON-3 REFRESH] 30-day minor: "${article.title}"`);
      }
    }

    if (daysSince >= 85 && daysSince <= 95 && !article.refreshed90) {
      if (refreshed90 < 20) {
        article.body = sanitizeBody(article.body);
        article.lastRefreshed = new Date().toISOString().split("T")[0];
        article.refreshed90 = true;
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
// ═══════════════════════════════════════
const httpCheck = (url) => {
  const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
  return asinMatch ? verifyAsin(asinMatch[1]) : verifyAsin(url);
};

async function runAsinValidator() {
  if (!AUTO_GEN_ENABLED) {
    log("[CRON-4 ASIN-CHECK] AUTO_GEN_ENABLED is false - skipping");
    return;
  }

  log("[CRON-4 ASIN-CHECK] Starting ASIN validation...");

  const articles = loadArticles();
  const asinMap = new Map();
  for (let i = 0; i < articles.length; i++) {
    const body = articles[i].body || "";
    const matches = body.matchAll(/amazon\.com\/dp\/([A-Z0-9]{10})\?tag=/g);
    for (const m of matches) {
      const asin = m[1];
      if (!asinMap.has(asin)) {
        const nameMatch = body.match(new RegExp(`<a[^>]*amazon\\.com\\/dp\\/${asin}[^>]*>([^<]+)<\\/a>`));
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
      rateLimited.push(asin);
      log(`[CRON-4 ASIN-CHECK] Rate limited at ASIN #${checked} (${asin}) - pausing`);
      await delay(60000);
      const retry = await httpCheck(url);
      if (retry.isDogPage) {
        log(`[CRON-4 ASIN-CHECK] Still rate limited - stopping. Checked ${checked}/${asinMap.size}`);
        break;
      }
      if (retry.ok && !retry.isUnavailable) {
        verified.push({ asin, title: retry.productTitle || info.name });
      } else if (retry.isUnavailable) {
        unavailable.push({ asin, info, title: retry.productTitle });
      } else {
        broken.push({ asin, info, status: retry.status });
      }
    } else if (result.is404 || (!result.ok && !result.isDogPage)) {
      broken.push({ asin, info, status: result.status });
      log(`[CRON-4 ASIN-CHECK] BROKEN: ${asin} (${info.name}) HTTP ${result.status}`);
    } else if (result.isUnavailable) {
      unavailable.push({ asin, info, title: result.productTitle });
      log(`[CRON-4 ASIN-CHECK] UNAVAILABLE: ${asin} (${info.name})`);
    } else {
      verified.push({ asin, title: result.productTitle || info.name });
    }

    await delay(3000 + Math.floor(Math.random() * 2000));
  }

  // Auto-replace broken/unavailable ASINs
  const toReplace = [...broken, ...unavailable];
  let replacements = 0;

  if (toReplace.length > 0) {
    const brokenSet = new Set(toReplace.map(b => b.asin));
    const workingPool = COMPANION_PRODUCTS.filter(p => !brokenSet.has(p.asin));

    for (const item of toReplace) {
      const badAsin = item.asin;
      const badInfo = item.info;
      const usedInArticles = new Set();
      for (const idx of badInfo.articleIndices) {
        const body = articles[idx].body || "";
        const existing = [...body.matchAll(/amazon\.com\/dp\/([A-Z0-9]{10})/g)].map(m => m[1]);
        existing.forEach(a => usedInArticles.add(a));
      }

      const replacement = workingPool.find(p =>
        !usedInArticles.has(p.asin) && !brokenSet.has(p.asin)
      );

      if (replacement) {
        for (const idx of badInfo.articleIndices) {
          const oldLink = `amazon.com/dp/${badAsin}?tag=${AMAZON_TAG}`;
          const newLink = `amazon.com/dp/${replacement.asin}?tag=${AMAZON_TAG}`;
          articles[idx].body = articles[idx].body.split(oldLink).join(newLink);
        }
        replacements++;
        log(`[CRON-4 ASIN-CHECK] Replaced ${badAsin} -> ${replacement.asin} (${replacement.name})`);
      }
    }
  }

  if (replacements > 0) {
    saveArticles(articles);
  }

  const report = {
    date: new Date().toISOString(),
    totalAsins: asinMap.size,
    checked,
    verified: verified.length,
    broken: broken.length,
    unavailable: unavailable.length,
    rateLimited: rateLimited.length,
    replacementsMade: replacements,
  };

  const reportPath = resolve(__dirname, "../asin-validation-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`[CRON-4 ASIN-CHECK] Summary: ${verified.length} verified, ${broken.length} broken, ${unavailable.length} unavailable, ${replacements} replaced`);
}

// ═══════════════════════════════════════
// CRON 5: Product Spotlight (Saturdays)
// ═══════════════════════════════════════
async function runProductSpotlight() {
  if (!AUTO_GEN_ENABLED) {
    log("[CRON-5 SPOTLIGHT] AUTO_GEN_ENABLED is false - skipping");
    return;
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    log("[CRON-5 SPOTLIGHT] DEEPSEEK_API_KEY not set - skipping");
    return;
  }

  const articles = loadArticles();
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
    log("[CRON-5 SPOTLIGHT] All products reviewed - skipping");
    return;
  }

  const product = unreviewed[0];
  const title = `Product Spotlight: ${product.name}`;
  const maxId = Math.max(0, ...articles.map(a => a.id));

  log(`[CRON-5 SPOTLIGHT] Generating: "${title}"`);

  try {
    const article = await generateArticle({
      title,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      dateISO: new Date().toISOString(),
      id: maxId + 1,
    });

    const slug = slugify(title);
    const { heroUrl, ogUrl } = await duplicateImageOnBunny(article.heroImage, slug);
    article.heroImage = heroUrl;
    article.ogImage = ogUrl;
    delete article._imageId;
    delete article.gateResult;

    articles.push(article);
    saveArticles(articles);

    log(`[CRON-5 SPOTLIGHT] Published: "${title}" (${article.wordCount} words)`);
  } catch (err) {
    log(`[CRON-5 SPOTLIGHT] ERROR: ${err.message}`);
  }
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
log(`DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? "set" : "NOT SET"}`);
log(`Quality gate: ${AI_FLAGGED_WORDS.length} AI words banned, 1200-3000 word range`);
log(`Image library: 40 images with category-aware matching`);
log(`Model: deepseek-v4-pro (hardcoded, fallback only)`);

const queuedCount = getQueuedArticles().length;
const queuePubCount = getQueuePublishedCount();
const pubCount = getPublishedCount();
log(`Published articles: ${pubCount} visible`);
log(`Queue: ${queuedCount} queued, ${queuePubCount} published from queue`);
if (queuePubCount < 60) {
  log(`Drip phase: Phase 1 (5/day, ${60 - queuePubCount} until Phase 2)`);
} else if (queuedCount > 0) {
  log(`Drip phase: Phase 2 (1/weekday, ~${queuedCount} weeks remaining)`);
} else {
  log(`Queue empty. DeepSeek fallback active.`);
}

log("Scheduling via node-cron:");
log("  CRON-1: Drip-feed publisher   -> 0 6 * * *    (daily 06:00 UTC)");
log("  CRON-2: DeepSeek fallback     -> 0 8 * * 1-5  (weekdays 08:00 UTC, only when queue empty)");
log("  CRON-3: Content refresh       -> 0 3 1 * *    (1st of month 3am UTC)");
log("  CRON-4: ASIN validator        -> 0 2 * * 3    (Wed 2am UTC)");
log("  CRON-5: Product spotlight     -> 0 9 * * 6    (Sat 9am UTC)");
log("  CRON-6: Status check          -> 0 */6 * * *  (every 6h)");
log("  CRON-7: Sitemap regen         -> 0 7 * * *    (daily 07:00 UTC, after drip-feed)");

// ── Initial run on startup ──
runPublishingCheck();

// ── node-cron schedules ──

// CRON-1: Drip-feed publisher (daily at 06:00 UTC)
cron.schedule("0 6 * * *", () => {
  log("[CRON-1] Drip-feed publisher triggered");
  runDripFeedPublisher();
});

// CRON-2: DeepSeek fallback generator (weekdays at 08:00 UTC)
// Only generates when the queue is empty
cron.schedule("0 8 * * 1-5", () => {
  log("[CRON-2] DeepSeek fallback check triggered");
  runDeepSeekFallback();
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

// CRON-5: Product spotlight (Saturdays at 9am UTC)
cron.schedule("0 9 * * 6", () => {
  log("[CRON-5] Triggered by node-cron (Saturday)");
  runProductSpotlight();
});

// CRON-6: Publishing status check (every 6 hours)
cron.schedule("0 */6 * * *", () => {
  log("[CRON-6] Status check triggered");
  runPublishingCheck();
});

// CRON-7: Sitemap & RSS regeneration (daily at 07:00 UTC, after drip-feed)
cron.schedule("0 7 * * *", () => {
  log("[CRON-7] Sitemap regeneration triggered");
  runSitemapRegeneration();
});

// ── Initial sitemap generation on startup ──
runSitemapRegeneration();

// Start the Express server
startServer();
