/**
 * expand-short-articles.mjs
 *
 * Finds all queued articles under 1800 words and uses DeepSeek V4-Pro
 * to generate additional paragraphs in Paul's voice to bring them over 1800.
 *
 * Usage: OPENAI_API_KEY=... OPENAI_BASE_URL=... node scripts/expand-short-articles.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(__dirname, "../client/src/data/articles.json");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com",
});
const MODEL = process.env.OPENAI_MODEL || "deepseek-v4-pro";

function countWords(html) {
  return html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
}

function stripHtmlTags(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

const SYSTEM_PROMPT = `You are Paul — a male writer with ME/CFS who writes in first person. Your voice is:
- Conversational, warm, slightly irreverent
- Uses phrases like "Look,", "Here's the thing:", "I know, I know", "Wild, right?", "Stay with me"
- Short punchy sentences mixed with longer reflective ones
- Never uses: navigate, journey, game-changer, dive into, unlock, at the end of the day, empower, leverage, in today's world
- Never uses em dashes (—)
- Writes from lived experience with chronic fatigue

You will be given an existing article section and asked to write ADDITIONAL paragraphs to expand it.
Write in HTML format using <p>, <h3>, and <ul>/<li> tags only.
Do NOT repeat content already in the article.
Do NOT include any preamble or explanation - just output the HTML paragraphs.`;

async function expandArticle(article) {
  const currentWords = countWords(article.body);
  const needed = 1800 - currentWords + 200; // aim for 200 words over minimum

  const prompt = `Here is an article titled "${article.title}" in the category "${article.categoryName}". 
It currently has ${currentWords} words. I need you to write approximately ${needed} additional words as NEW paragraphs to add to the end of this article (before the conclusion).

The article's existing content (abbreviated - last 500 chars):
${stripHtmlTags(article.body).slice(-500)}

Write ${needed} words of NEW content that:
1. Adds a new subsection with an <h3> heading related to the topic
2. Includes practical advice or personal experience
3. Uses Paul's conversational voice with at least 2 voice markers (e.g., "Look,", "Here's the thing:", "Stay with me")
4. Wraps in proper HTML (<h3>, <p>, <ul>/<li> tags)

Output ONLY the HTML. No explanation.`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    max_tokens: 16384,
    temperature: 0.8,
  });

  let content = response.choices[0]?.message?.content || "";
  // Strip code fences if present
  content = content.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();
  return content;
}

async function main() {
  const articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf-8"));
  const queued = articles.filter((a) => a.status === "queued");
  const short = queued.filter((a) => countWords(a.body) < 1800);

  console.log(`Total queued: ${queued.length}`);
  console.log(`Under 1800 words: ${short.length}`);
  console.log(`Starting expansion...`);

  let success = 0;
  let fail = 0;

  // Process one at a time to avoid rate limits
  for (let i = 0; i < short.length; i++) {
    const article = short[i];
    console.log(`\n[${i + 1}/${short.length}] ${article.title.slice(0, 50)}...`);

    // Skip if already expanded in a previous run
    if (countWords(article.body) >= 1800) {
      console.log(`  Already at ${countWords(article.body)} words, skipping`);
      success++;
      continue;
    }

    let attempts = 0;
    while (attempts < 3) {
      try {
        const expansion = await expandArticle(article);
        if (!expansion || countWords(expansion) < 50) {
          throw new Error("Expansion too short");
        }

        const body = article.body;
        const lastH3Idx = body.lastIndexOf("<h3");
        if (lastH3Idx > body.length * 0.7) {
          article.body = body.slice(0, lastH3Idx) + expansion + "\n" + body.slice(lastH3Idx);
        } else {
          article.body = body + "\n" + expansion;
        }

        const newCount = countWords(article.body);
        article.wordCount = newCount;
        console.log(`  ✓ ${newCount} words`);
        success++;
        break;
      } catch (err) {
        attempts++;
        if (err.message.includes("429") || err.message.includes("Too many")) {
          const wait = 30 * attempts;
          console.log(`  Rate limited, waiting ${wait}s (attempt ${attempts}/3)`);
          await new Promise((r) => setTimeout(r, wait * 1000));
        } else {
          console.log(`  ✗ ${err.message} (attempt ${attempts}/3)`);
          if (attempts >= 3) fail++;
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }

    // Save every 5 articles
    if ((i + 1) % 5 === 0) {
      writeFileSync(ARTICLES_PATH, JSON.stringify(articles));
      console.log(`  [Saved progress: ${success} expanded, ${fail} failed]`);
    }

    // Rate limit between articles
    await new Promise((r) => setTimeout(r, 8000));
  }

  // Final save
  writeFileSync(ARTICLES_PATH, JSON.stringify(articles));

  console.log(`\n=== Expansion Complete ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${fail}`);

  // Final check
  const finalShort = articles
    .filter((a) => a.status === "queued")
    .filter((a) => countWords(a.body) < 1800);
  console.log(`Still under 1800: ${finalShort.length}`);
}

main().catch(console.error);
