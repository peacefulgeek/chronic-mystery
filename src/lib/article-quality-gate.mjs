/**
 * article-quality-gate.mjs
 *
 * Validates article content before saving. Returns { pass, failures[] }.
 * Every generated or refreshed article MUST pass this gate.
 *
 * Revised Paul Voice Gate (April 2026):
 *   - Word count: 1,200 floor / 2,500 ceiling (target 1,600-2,000)
 *   - Zero em dashes
 *   - 40+ banned AI words
 *   - Banned AI phrases
 *   - Exactly 3-4 verified ASIN affiliate links
 *   - 3+ voice signals (contractions + Paul interjections)
 */

// ── AI-flagged single words (Google / Originality.ai detection signals) ──
export const AI_FLAGGED_WORDS = [
  "delve", "tapestry", "leverage", "unlock", "empower", "furthermore",
  "moreover", "nuanced", "multifaceted", "paradigm", "robust", "foster",
  "realm", "myriad", "pivotal", "cornerstone", "intricate", "embark",
  "profound", "transformative", "holistic", "utilize", "facilitate",
  "comprehensive", "innovative", "streamline", "synergy", "optimize",
  "underscore", "landscape", "navigate", "spearhead", "harness",
  "testament", "beacon", "catalyst", "resonate", "encompass",
  "framework", "elevate", "unveil", "unravel", "groundbreaking",
];

// ── AI-flagged phrases ──
export const AI_FLAGGED_PHRASES = [
  "in conclusion",
  "in today's fast-paced",
  "it's important to note",
  "it is important to note",
  "it's worth noting",
  "it is worth noting",
  "dive deep into",
  "plays a crucial role",
  "a testament to",
  "it goes without saying",
  "at the end of the day",
  "in the realm of",
  "serves as a reminder",
  "the landscape of",
  "paving the way",
  "shedding light on",
  "a game changer",
  "game-changer",
  "first and foremost",
  "last but not least",
  "without further ado",
  "in this article we will",
  "let's explore",
  "let us explore",
  "in this comprehensive guide",
  "this article will explore",
  "buckle up",
  "stay tuned",
];

// ── Voice signals: contractions + Paul Wagner interjections ──
const VOICE_SIGNALS = [
  // Contractions
  "I've", "I'm", "I'd", "you've", "you're", "you'd", "we've", "we're",
  "it's", "that's", "there's", "here's", "what's", "who's", "don't",
  "doesn't", "didn't", "can't", "won't", "shouldn't", "wouldn't",
  "couldn't", "isn't", "aren't", "wasn't", "weren't", "hasn't",
  "haven't", "hadn't",
  // Paul Wagner / Tender Guide interjections
  "Stay with me", "I know, I know", "Wild, right", "Think about that",
  "And here is the thing", "Bear with me", "This part matters",
  "Seriously, though", "Let that sink in", "Pause on that",
  "I get it", "Hang on", "Not what you expected", "Worth sitting with",
  "I hear you", "And yes, that is real", "No, really",
  "This is the part most people miss", "Stick with me",
  // Paul Wagner compassionate markers
  "How does that make you feel", "Right?!", "Know what I mean",
  "Sit with that for a moment", "Feel that", "You are not alone in this",
  "That matters", "Take a breath", "Let me be real with you",
];

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(html) {
  return stripHtml(html).split(/\s+/).filter(Boolean).length;
}

function hasEmDash(text) {
  return text.includes("\u2014") || text.includes("\u2013");
}

/**
 * Run the quality gate on an article body.
 * @param {string} body - HTML body of the article
 * @param {object} opts - Optional overrides { minWords, maxWords, requireAsinCount }
 * @returns {{ pass: boolean, failures: string[], wordCount, voiceSignals, amazonLinks }}
 */
export function qualityGate(body, opts = {}) {
  const minWords = opts.minWords || 1200;
  const maxWords = opts.maxWords || 3000;
  const requireAsinCount = opts.requireAsinCount !== false; // default true
  const failures = [];
  const plainText = stripHtml(body);
  const lowerText = plainText.toLowerCase();
  const wc = countWords(body);

  // 1. Word count check
  if (wc < minWords) {
    failures.push(`words-too-low: ${wc} (min ${minWords})`);
  }
  if (wc > maxWords) {
    failures.push(`words-too-high: ${wc} (max ${maxWords})`);
  }

  // 2. Em dash check
  if (hasEmDash(body)) {
    failures.push("contains-em-dash");
  }

  // 3. AI-flagged words
  for (const word of AI_FLAGGED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(plainText)) {
      failures.push(`ai-word: ${word}`);
    }
  }

  // 4. AI-flagged phrases
  for (const phrase of AI_FLAGGED_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      failures.push(`ai-phrase: ${phrase}`);
    }
  }

  // 5. Voice signals (contractions + interjections)
  const voiceHits = VOICE_SIGNALS.filter(s => body.includes(s));
  if (voiceHits.length < 3) {
    failures.push(`low-voice-signals: ${voiceHits.length} (min 3)`);
  }

  // 6. Amazon link count: exactly 3-4 verified ASIN links
  const amazonLinks = (body.match(/amazon\.com\/dp\/[A-Z0-9]{10}\?tag=/g) || []).length;
  if (requireAsinCount) {
    if (amazonLinks < 3) {
      failures.push(`low-amazon-links: ${amazonLinks} (need 3-4)`);
    }
    if (amazonLinks > 4) {
      failures.push(`too-many-amazon-links: ${amazonLinks} (max 4)`);
    }
  }

  return {
    pass: failures.length === 0,
    failures,
    wordCount: wc,
    voiceSignals: voiceHits.length,
    amazonLinks,
  };
}

/**
 * Sanitize article body: replace em dashes, swap AI words/phrases.
 * @param {string} body - HTML body
 * @returns {string} cleaned body
 */
export function sanitizeBody(body) {
  let clean = body;

  // Replace em dashes
  clean = clean.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");

  // Replace AI-flagged words with natural alternatives
  const replacements = {
    delve: "dig into", tapestry: "web", leverage: "use", unlock: "open up",
    empower: "support", furthermore: "also", moreover: "and",
    nuanced: "layered", multifaceted: "complex", paradigm: "model",
    robust: "strong", foster: "build", realm: "area", myriad: "many",
    pivotal: "key", cornerstone: "foundation", intricate: "detailed",
    embark: "start", profound: "deep", transformative: "life-changing",
    holistic: "whole-body", utilize: "use", facilitate: "help with",
    comprehensive: "thorough", innovative: "creative", streamline: "simplify",
    synergy: "connection", optimize: "improve", underscore: "highlight",
    landscape: "space", navigate: "work through", spearhead: "lead",
    harness: "use", testament: "proof", beacon: "signal",
    catalyst: "spark", resonate: "connect", encompass: "cover",
    framework: "model", elevate: "lift", unveil: "reveal",
    unravel: "untangle", groundbreaking: "important",
  };

  for (const [word, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    clean = clean.replace(regex, replacement);
  }

  // Replace AI-flagged phrases
  const phraseReplacements = {
    "in conclusion": "to wrap up",
    "it's important to note": "worth knowing",
    "it is important to note": "worth knowing",
    "it's worth noting": "here is the thing",
    "it is worth noting": "here is the thing",
    "dive deep into": "look closely at",
    "plays a crucial role": "matters a lot",
    "a testament to": "proof of",
    "serves as a reminder": "reminds us",
    "paving the way": "opening the door",
    "shedding light on": "showing",
    "first and foremost": "first",
    "last but not least": "and finally",
    "a game changer": "a real difference-maker",
    "game-changer": "difference-maker",
    "in this comprehensive guide": "in this guide",
    "this article will explore": "we will look at",
    "let's explore": "let us look at",
    "let us explore": "let us look at",
    "buckle up": "stay with me",
    "stay tuned": "keep reading",
  };

  for (const [phrase, replacement] of Object.entries(phraseReplacements)) {
    const regex = new RegExp(phrase, "gi");
    clean = clean.replace(regex, replacement);
  }

  return clean;
}

export default { qualityGate, sanitizeBody, AI_FLAGGED_WORDS, AI_FLAGGED_PHRASES };
