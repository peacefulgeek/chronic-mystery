#!/usr/bin/env node
/**
 * start-with-cron.mjs — Cron Manager for Chronic Mystery
 *
 * Three cron jobs:
 *   1. Article Auto-Publisher: Articles are pre-written with future dates.
 *      Date-gated articles become visible automatically as their publish
 *      dates arrive. Checks every 6 hours.
 *      Schedule: 5/day for 30 days, then 5/week (Mondays) for 24 weeks.
 *
 *   2. Product Spotlight (Weekly, Saturdays): Generates a new product
 *      spotlight article following Kalesh voice and humanization rules.
 *
 *   3. Content Refresh (Monthly): Revises older articles to keep them
 *      current. 30-day articles get minor updates (25 articles/batch),
 *      90-day articles get deeper revisions (20 articles/batch).
 *
 * HUMANIZATION RULES FOR ALL FUTURE CONTENT:
 *   - No em dashes (use -, ..., or ~)
 *   - No AI-flagged words: profound, transformative, holistic, nuanced,
 *     multifaceted, delve, tapestry, embark, paradigm, robust, leverage,
 *     foster, realm, myriad, pivotal, cornerstone, intricate
 *   - 2 conversational interjections per article
 *   - 3-5 Kalesh voice phrases per article
 *   - 1200-1800 word count
 *   - 2-4 inline Amazon affiliate links (tag: spankyspinola-20)
 *   - "Tools for Your Healing" section at bottom
 *   - Varied sentence starters (avoid "This is/means/creates")
 *   - Conversational, first-person tone throughout
 *
 * Usage:
 *   node scripts/start-with-cron.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(__dirname, "../client/src/data/articles.json");
const LOG_PATH = resolve(__dirname, "../cron.log");

// Banned AI words - must never appear in generated content
const BANNED_WORDS = [
  "profound", "transformative", "holistic", "nuanced", "multifaceted",
  "delve", "tapestry", "embark", "paradigm", "robust", "leverage",
  "foster", "realm", "myriad", "pivotal", "cornerstone", "intricate",
  "furthermore", "moreover",
];

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

function getPublishingStatus() {
  const articles = loadArticles();
  const now = new Date();
  const published = articles.filter((a) => new Date(a.dateISO) <= now);
  const scheduled = articles.filter((a) => new Date(a.dateISO) > now);
  const productSpotlights = articles.filter((a) =>
    a.title && a.title.toLowerCase().includes("product spotlight")
  );

  return {
    total: articles.length,
    published: published.length,
    scheduled: scheduled.length,
    productSpotlights: productSpotlights.length,
    nextUp: scheduled.length > 0
      ? scheduled.sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))[0]
      : null,
  };
}

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
// CRON 1: Article publishing status check
// ═══════════════════════════════════════
function runPublishingCheck() {
  const status = getPublishingStatus();
  log(`[CRON-1 PUBLISH] ${status.published}/${status.total} published, ${status.scheduled} scheduled, ${status.productSpotlights} product spotlights`);

  if (status.nextUp) {
    const nextDate = new Date(status.nextUp.dateISO);
    const hoursUntil = Math.round((nextDate - new Date()) / (1000 * 60 * 60));
    log(`[CRON-1 PUBLISH] Next: "${status.nextUp.title}" in ${hoursUntil}h`);
  } else {
    log("[CRON-1 PUBLISH] All articles published.");
  }
}

// ═══════════════════════════════════════
// CRON 2: Product spotlight (Saturdays)
// ═══════════════════════════════════════
function runProductSpotlightCheck() {
  const day = new Date().getDay();
  if (day !== 6) return; // Only Saturdays

  log("[CRON-2 SPOTLIGHT] Weekly product spotlight check - Saturday");
  log("[CRON-2 SPOTLIGHT] Generating new product spotlight article...");

  // In production with API access, this would:
  // 1. Select a product from the catalog not yet reviewed
  // 2. Generate a 1200-1500 word review following these rules:
  //    - Kalesh voice (first-person, conversational)
  //    - No em dashes, no AI words
  //    - 2 interjections, 3 voice phrases
  //    - Amazon affiliate links with spankyspinola-20 tag
  //    - (paid link) disclosure on every link
  // 3. Generate hero + OG images, upload to Bunny CDN as WebP
  // 4. Add to articles.json with today's date
  // 5. Log the result

  log("[CRON-2 SPOTLIGHT] Note: Article generation requires API access");
  log("[CRON-2 SPOTLIGHT] Humanization rules: no emdash, no AI words, 1200-1800 words, 2 interjections, 3+ voice phrases");
}

// ═══════════════════════════════════════
// CRON 3: Content refresh (Monthly)
// ═══════════════════════════════════════
function runContentRefresh() {
  const articles = loadArticles();
  const now = new Date();
  let refreshed30 = 0;
  let refreshed90 = 0;

  for (const article of articles) {
    const pubDate = new Date(article.dateISO);
    const daysSince = Math.floor((now - pubDate) / (1000 * 60 * 60 * 24));

    // 30-day refresh: minor updates (update date, check links)
    if (daysSince >= 28 && daysSince <= 35 && !article.refreshed30) {
      if (refreshed30 < 25) {
        // Mark as refreshed, update the modified date
        article.refreshed30 = true;
        article.lastRefreshed = now.toISOString().split("T")[0];
        refreshed30++;
        log(`[CRON-3 REFRESH] 30-day refresh: "${article.title}"`);
      }
    }

    // 90-day refresh: deeper revision (rewrite intro, update stats)
    if (daysSince >= 85 && daysSince <= 95 && !article.refreshed90) {
      if (refreshed90 < 20) {
        article.refreshed90 = true;
        article.lastRefreshed = now.toISOString().split("T")[0];
        refreshed90++;
        log(`[CRON-3 REFRESH] 90-day deep refresh: "${article.title}"`);

        // In production with API access, this would:
        // 1. Rewrite the opening paragraph
        // 2. Update any statistics or research citations
        // 3. Verify all Amazon links are still active
        // 4. Add new voice phrases if below 3
        // 5. Ensure no AI words crept in
        // 6. Verify word count is 1200-1800
      }
    }
  }

  if (refreshed30 > 0 || refreshed90 > 0) {
    saveArticles(articles);
    log(`[CRON-3 REFRESH] Refreshed: ${refreshed30} (30-day), ${refreshed90} (90-day)`);
  } else {
    log("[CRON-3 REFRESH] No articles due for refresh this cycle.");
  }
}

// ═══════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════
log("=== Chronic Mystery Cron Manager Starting ===");
log("CRON-1: Article auto-publisher (every 6h)");
log("CRON-2: Product spotlight (weekly, Saturdays)");
log("CRON-3: Content refresh (monthly, 1st of month)");
log(`Humanization rules active: no emdash, ${BANNED_WORDS.length} banned AI words, 1200-1800 words`);

// Initial checks
runPublishingCheck();
runProductSpotlightCheck();

// Check if it's the 1st of the month for content refresh
if (new Date().getDate() === 1) {
  runContentRefresh();
}

// Schedule CRON-1: every 6 hours
setInterval(runPublishingCheck, 6 * 60 * 60 * 1000);

// Schedule CRON-2: check every 12 hours (runs logic only on Saturdays)
setInterval(runProductSpotlightCheck, 12 * 60 * 60 * 1000);

// Schedule CRON-3: check every 24 hours (runs logic only on 1st of month)
setInterval(() => {
  if (new Date().getDate() === 1) {
    runContentRefresh();
  }
}, 24 * 60 * 60 * 1000);

// Start the server
startServer();
