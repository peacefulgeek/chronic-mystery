#!/usr/bin/env node
/**
 * start-with-cron.mjs — Cron Manager for Chronic Mystery
 *
 * Two cron jobs:
 *   1. Article Auto-Publisher: Articles are pre-written with future dates.
 *      The cron logs publishing status every 6 hours. Date-gated articles
 *      become visible automatically as their publish dates arrive.
 *      Schedule: 5/day for 30 days, then 5/week (Mondays) for 24 weeks.
 *
 *   2. Product Spotlight (Weekly, Saturdays): Logs a reminder that a new
 *      product spotlight article should be created. In production, this
 *      would trigger an API call to generate and publish a new product
 *      review article. For now, 3 initial product spotlight articles are
 *      included in the articles.json.
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

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}\n`;
  process.stdout.write(line);
  try {
    writeFileSync(LOG_PATH, line, { flag: "a" });
  } catch {}
}

function getPublishingStatus() {
  const articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf-8"));
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

// CRON 1: Article publishing status check (every 6 hours)
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

// CRON 2: Product spotlight reminder (weekly, Saturdays)
function runProductSpotlightCheck() {
  const day = new Date().getDay();
  if (day !== 6) return; // Only run on Saturdays

  log("[CRON-2 SPOTLIGHT] Weekly product spotlight check — Saturday");
  log("[CRON-2 SPOTLIGHT] TODO: Generate new product spotlight article");
  log("[CRON-2 SPOTLIGHT] In production, this triggers article generation via API");

  // In a full implementation, this would:
  // 1. Select a product from the Tools page catalog
  // 2. Generate a 1500-word review article using the Kalesh voice
  // 3. Generate a hero image and OG image
  // 4. Upload images to Bunny CDN
  // 5. Add the article to articles.json
  // 6. Trigger a rebuild
}

// === STARTUP ===
log("=== Chronic Mystery Cron Manager Starting ===");
log("CRON-1: Article auto-publisher (every 6h)");
log("CRON-2: Product spotlight (weekly, Saturdays)");

// Initial checks
runPublishingCheck();
runProductSpotlightCheck();

// Schedule CRON-1: every 6 hours
setInterval(runPublishingCheck, 6 * 60 * 60 * 1000);

// Schedule CRON-2: check every 12 hours (runs logic only on Saturdays)
setInterval(runProductSpotlightCheck, 12 * 60 * 60 * 1000);

// Start the server
startServer();
