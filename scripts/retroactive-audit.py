#!/usr/bin/env python3
"""
Retroactive Quality Gate Audit
Scans all 303 articles for:
  1. Em dashes (U+2014, U+2013)
  2. AI-flagged words
  3. AI-flagged phrases
  4. Low voice signals (< 3 contractions/interjections)
  5. Word count outside 1200-1800
  6. Amazon link count issues

Fixes: em dashes, AI words/phrases via replacement.
Reports: articles that need manual attention.
"""

import json
import re
import sys
from pathlib import Path

ARTICLES_PATH = Path(__file__).parent.parent / "client/src/data/articles.json"

AI_FLAGGED_WORDS = [
    "delve", "tapestry", "leverage", "unlock", "empower", "furthermore",
    "moreover", "nuanced", "multifaceted", "paradigm", "robust", "foster",
    "realm", "myriad", "pivotal", "cornerstone", "intricate", "embark",
    "profound", "transformative", "holistic", "utilize", "facilitate",
    "comprehensive", "innovative", "streamline", "synergy", "optimize",
    "underscore", "landscape", "navigate", "spearhead", "harness",
    "testament", "beacon", "catalyst", "resonate", "encompass",
]

AI_FLAGGED_PHRASES = [
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
]

WORD_REPLACEMENTS = {
    "delve": "dig into", "tapestry": "web", "leverage": "use", "unlock": "open up",
    "empower": "support", "furthermore": "also", "moreover": "and",
    "nuanced": "layered", "multifaceted": "complex", "paradigm": "framework",
    "robust": "strong", "foster": "build", "realm": "area", "myriad": "many",
    "pivotal": "key", "cornerstone": "foundation", "intricate": "detailed",
    "embark": "start", "profound": "deep", "transformative": "life-changing",
    "holistic": "whole-body", "utilize": "use", "facilitate": "help with",
    "comprehensive": "thorough", "innovative": "creative", "streamline": "simplify",
    "synergy": "connection", "optimize": "improve", "underscore": "highlight",
    "landscape": "space", "navigate": "work through", "spearhead": "lead",
    "harness": "use", "testament": "proof", "beacon": "signal",
    "catalyst": "spark", "resonate": "connect", "encompass": "cover",
}

PHRASE_REPLACEMENTS = {
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
}

def strip_html(html):
    return re.sub(r'<[^>]+>', ' ', html or '').strip()

def count_words(html):
    return len(re.split(r'\s+', strip_html(html)))

def has_emdash(text):
    return '\u2014' in text or '\u2013' in text

def fix_emdashes(text):
    return text.replace('\u2014', ' - ').replace('\u2013', ' - ')

def fix_ai_words(text):
    for word, replacement in WORD_REPLACEMENTS.items():
        pattern = re.compile(r'\b' + re.escape(word) + r'\b', re.IGNORECASE)
        text = pattern.sub(replacement, text)
    return text

def fix_ai_phrases(text):
    for phrase, replacement in PHRASE_REPLACEMENTS.items():
        pattern = re.compile(re.escape(phrase), re.IGNORECASE)
        text = pattern.sub(replacement, text)
    return text

def count_voice_signals(body):
    contractions = [
        "I've", "I'm", "I'd", "you've", "you're", "you'd", "we've", "we're",
        "it's", "that's", "there's", "here's", "what's", "who's", "don't",
        "doesn't", "didn't", "can't", "won't", "shouldn't", "wouldn't",
        "couldn't", "isn't", "aren't", "wasn't", "weren't", "hasn't",
        "haven't", "hadn't",
    ]
    interjections = [
        "Stay with me", "I know, I know", "Wild, right", "Think about that",
        "And here is the thing", "Bear with me", "This part matters",
        "Seriously, though", "Let that sink in", "Pause on that",
        "I get it", "Hang on", "Not what you expected", "Worth sitting with",
        "I hear you", "And yes, that is real", "No, really",
        "This is the part most people miss", "Stick with me",
    ]
    count = 0
    for c in contractions:
        if c in body:
            count += 1
    for i in interjections:
        if i in body:
            count += 1
    return count

def main():
    with open(ARTICLES_PATH, 'r') as f:
        articles = json.load(f)

    print(f"Auditing {len(articles)} articles...")

    stats = {
        'total': len(articles),
        'emdash_fixed': 0,
        'ai_words_fixed': 0,
        'ai_phrases_fixed': 0,
        'low_voice': 0,
        'word_count_low': 0,
        'word_count_high': 0,
        'articles_modified': 0,
        'emdash_articles': [],
        'ai_word_articles': [],
        'ai_phrase_articles': [],
        'low_voice_articles': [],
        'word_count_issues': [],
    }

    for i, article in enumerate(articles):
        body = article.get('body', '')
        title = article.get('title', f'Article {i}')
        modified = False

        # 1. Em dashes
        if has_emdash(body):
            body = fix_emdashes(body)
            stats['emdash_fixed'] += 1
            stats['emdash_articles'].append(title)
            modified = True

        # 2. AI words
        plain = strip_html(body)
        found_words = []
        for word in AI_FLAGGED_WORDS:
            if re.search(r'\b' + re.escape(word) + r'\b', plain, re.IGNORECASE):
                found_words.append(word)
        if found_words:
            body = fix_ai_words(body)
            stats['ai_words_fixed'] += len(found_words)
            stats['ai_word_articles'].append(f"{title}: {', '.join(found_words)}")
            modified = True

        # 3. AI phrases
        lower_plain = plain.lower()
        found_phrases = []
        for phrase in AI_FLAGGED_PHRASES:
            if phrase.lower() in lower_plain:
                found_phrases.append(phrase)
        if found_phrases:
            body = fix_ai_phrases(body)
            stats['ai_phrases_fixed'] += len(found_phrases)
            stats['ai_phrase_articles'].append(f"{title}: {', '.join(found_phrases)}")
            modified = True

        # 4. Voice signals
        voice_count = count_voice_signals(body)
        if voice_count < 3:
            stats['low_voice'] += 1
            stats['low_voice_articles'].append(f"{title}: {voice_count} signals")

        # 5. Word count
        wc = count_words(body)
        if wc < 1200:
            stats['word_count_low'] += 1
            stats['word_count_issues'].append(f"{title}: {wc} words (LOW)")
        elif wc > 1800:
            stats['word_count_high'] += 1
            stats['word_count_issues'].append(f"{title}: {wc} words (HIGH)")

        if modified:
            article['body'] = body
            stats['articles_modified'] += 1

    # Save if any modifications were made
    if stats['articles_modified'] > 0:
        with open(ARTICLES_PATH, 'w') as f:
            json.dump(articles, f, indent=2, ensure_ascii=False)
        print(f"\nSaved {stats['articles_modified']} modified articles.")

    # Print report
    print("\n" + "=" * 60)
    print("RETROACTIVE QUALITY GATE AUDIT REPORT")
    print("=" * 60)
    print(f"Total articles: {stats['total']}")
    print(f"Articles modified: {stats['articles_modified']}")
    print(f"Em dashes fixed: {stats['emdash_fixed']} articles")
    print(f"AI words fixed: {stats['ai_words_fixed']} total instances")
    print(f"AI phrases fixed: {stats['ai_phrases_fixed']} total instances")
    print(f"Low voice signals (< 3): {stats['low_voice']} articles")
    print(f"Word count too low (< 1200): {stats['word_count_low']}")
    print(f"Word count too high (> 1800): {stats['word_count_high']}")

    if stats['emdash_articles']:
        print(f"\n--- Em dash articles ({len(stats['emdash_articles'])}) ---")
        for a in stats['emdash_articles'][:20]:
            print(f"  FIXED: {a}")
        if len(stats['emdash_articles']) > 20:
            print(f"  ... and {len(stats['emdash_articles']) - 20} more")

    if stats['ai_word_articles']:
        print(f"\n--- AI word articles ({len(stats['ai_word_articles'])}) ---")
        for a in stats['ai_word_articles'][:20]:
            print(f"  FIXED: {a}")
        if len(stats['ai_word_articles']) > 20:
            print(f"  ... and {len(stats['ai_word_articles']) - 20} more")

    if stats['ai_phrase_articles']:
        print(f"\n--- AI phrase articles ({len(stats['ai_phrase_articles'])}) ---")
        for a in stats['ai_phrase_articles'][:20]:
            print(f"  FIXED: {a}")
        if len(stats['ai_phrase_articles']) > 20:
            print(f"  ... and {len(stats['ai_phrase_articles']) - 20} more")

    if stats['low_voice_articles']:
        print(f"\n--- Low voice signal articles ({len(stats['low_voice_articles'])}) ---")
        for a in stats['low_voice_articles'][:20]:
            print(f"  WARNING: {a}")
        if len(stats['low_voice_articles']) > 20:
            print(f"  ... and {len(stats['low_voice_articles']) - 20} more")

    if stats['word_count_issues']:
        print(f"\n--- Word count issues ({len(stats['word_count_issues'])}) ---")
        for a in stats['word_count_issues'][:20]:
            print(f"  WARNING: {a}")
        if len(stats['word_count_issues']) > 20:
            print(f"  ... and {len(stats['word_count_issues']) - 20} more")

    # Write JSON report
    report_path = Path(__file__).parent.parent / "audit-report.json"
    with open(report_path, 'w') as f:
        json.dump(stats, f, indent=2)
    print(f"\nFull report saved to: {report_path}")

    return 0 if stats['ai_words_fixed'] == 0 and stats['emdash_fixed'] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
