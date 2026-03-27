import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = "https://chronicmystery.com";

// Read articles data
const articles = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "client", "src", "data", "articles.json"),
    "utf-8"
  )
);

// Filter published articles
const now = new Date();
const published = articles.filter((a) => new Date(a.dateISO) <= now);

const categories = [
  "the-mystery",
  "the-medical",
  "the-management",
  "the-identity",
  "the-deeper-rest",
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

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

// Static pages
for (const page of staticPages) {
  xml += `  <url>
    <loc>${DOMAIN}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

// Category pages
for (const cat of categories) {
  xml += `  <url>
    <loc>${DOMAIN}/category/${cat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Article pages
for (const article of published) {
  xml += `  <url>
    <loc>${DOMAIN}/article/${article.slug}</loc>
    <lastmod>${article.dateISO.split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${article.heroImage}</image:loc>
      <image:title>${article.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</image:title>
    </image:image>
  </url>
`;
}

xml += `</urlset>
`;

// Write sitemap
const outDir = path.join(__dirname, "..", "dist", "public");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
console.log(
  `Sitemap generated: ${published.length} articles, ${categories.length} categories, ${staticPages.length} static pages`
);

// Generate RSS feed
let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Chronic Mystery</title>
    <link>${DOMAIN}</link>
    <description>When You're Exhausted and Nobody Can Tell You Why</description>
    <language>en-us</language>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />
`;

// Latest 20 articles
const latest = published
  .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
  .slice(0, 20);

for (const article of latest) {
  rss += `    <item>
      <title>${article.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>
      <link>${DOMAIN}/article/${article.slug}</link>
      <description>${article.description.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</description>
      <pubDate>${new Date(article.dateISO).toUTCString()}</pubDate>
      <guid isPermaLink="true">${DOMAIN}/article/${article.slug}</guid>
      <category>${article.categoryName}</category>
    </item>
`;
}

rss += `  </channel>
</rss>
`;

fs.writeFileSync(path.join(outDir, "feed.xml"), rss);
console.log(`RSS feed generated: ${latest.length} items`);

// Generate llms.txt (AI discovery file)
let llmsTxt = `# Chronic Mystery
> When You're Exhausted and Nobody Can Tell You Why

## About
Chronic Mystery publishes editorial content about ME/CFS, chronic fatigue, fibromyalgia, post-viral fatigue, and related conditions. Content is written by Chronic Mystery Editorial with spiritual advisory from Kalesh, a consciousness teacher and writer.

## Sections
- The Mystery: Unanswered questions and diagnostic odyssey
- The Medical: Research, treatments, and evolving understanding
- The Management: Pacing, energy envelopes, and practical strategies
- The Identity: Grief, reinvention, and forced stillness
- The Deeper Rest: Contemplative and spiritual dimensions

## Links
- Homepage: ${DOMAIN}
- About: ${DOMAIN}/about
- Start Here: ${DOMAIN}/start-here
- RSS Feed: ${DOMAIN}/feed.xml
- Sitemap: ${DOMAIN}/sitemap.xml

## Author
- Name: Kalesh
- Title: Consciousness Teacher & Writer
- Website: https://kalesh.love

## Content Policy
This site opts out of AI training data collection. See robots.txt for details.
`;

fs.writeFileSync(path.join(outDir, "llms.txt"), llmsTxt);
console.log("llms.txt generated");

// Generate .well-known/ai-plugin.json
const wellKnownDir = path.join(outDir, ".well-known");
fs.mkdirSync(wellKnownDir, { recursive: true });

const aiPlugin = {
  schema_version: "v1",
  name_for_human: "Chronic Mystery",
  name_for_model: "chronic_mystery",
  description_for_human: "Editorial content about ME/CFS, chronic fatigue, and post-viral illness",
  description_for_model: "Chronic Mystery publishes editorial articles about ME/CFS, chronic fatigue syndrome, fibromyalgia, post-viral fatigue, POTS, and related chronic conditions. Content covers medical research, practical management, identity and grief, and contemplative dimensions of chronic illness.",
  auth: { type: "none" },
  api: { type: "openapi", url: `${DOMAIN}/openapi.json` },
  logo_url: `${DOMAIN}/favicon.ico`,
  contact_email: "editorial@chronicmystery.com",
  legal_info_url: `${DOMAIN}/terms`,
};

fs.writeFileSync(
  path.join(wellKnownDir, "ai-plugin.json"),
  JSON.stringify(aiPlugin, null, 2)
);
console.log("ai-plugin.json generated");
