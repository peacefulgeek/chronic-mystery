#!/usr/bin/env node
/**
 * start-with-cron.mjs — Article Auto-Publisher for Chronic Mystery
 *
 * This script manages the scheduled publishing of articles.
 * Articles are pre-written and stored in articles.json with future dates.
 * The cron simply ensures the server restarts periodically so date-gated
 * articles become visible as their publish dates arrive.
 *
 * Schedule:
 *   Phase 1 (first 30 days): 5 articles/day → 150 articles
 *   Phase 2 (24 weeks): 5 articles/week (Mondays) → 120 articles
 *   30 articles pre-published at launch
 *
 * Usage:
 *   node scripts/start-with-cron.mjs
 *
 * The articles.json already has dates spread across the schedule.
 * This script just logs the publishing status and can trigger rebuilds.
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

  // Group scheduled by week
  const byWeek = {};
  for (const a of scheduled) {
    const d = new Date(a.dateISO);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split("T")[0];
    byWeek[key] = (byWeek[key] || 0) + 1;
  }

  return {
    total: articles.length,
    published: published.length,
    scheduled: scheduled.length,
    nextUp: scheduled.length > 0
      ? scheduled.sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))[0]
      : null,
    weeklyBreakdown: byWeek,
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

function runCronCheck() {
  const status = getPublishingStatus();
  log(`Publishing status: ${status.published}/${status.total} published, ${status.scheduled} scheduled`);

  if (status.nextUp) {
    const nextDate = new Date(status.nextUp.dateISO);
    const hoursUntil = Math.round((nextDate - new Date()) / (1000 * 60 * 60));
    log(`Next article: "${status.nextUp.title}" in ${hoursUntil}h (${status.nextUp.dateISO})`);
  } else {
    log("All articles published.");
  }
}

// Run initial status check
log("=== Chronic Mystery Auto-Publisher Starting ===");
runCronCheck();

// Schedule status checks every 6 hours
setInterval(runCronCheck, 6 * 60 * 60 * 1000);

// Start the server
startServer();
