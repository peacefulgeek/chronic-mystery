#!/usr/bin/env python3
"""
Mark the 213 DeepSeek-generated articles as queued.
- Adds status: "queued" field
- Sets dateISO to 2099-01-01 (far future, invisible to frontend)
- Preserves the original 303 articles unchanged
"""

import json
from pathlib import Path

ARTICLES_PATH = Path(__file__).parent.parent / "client/src/data/articles.json"

def main():
    articles = json.load(open(ARTICLES_PATH))
    
    # The original 303 articles have IDs 1-303
    # The new DeepSeek articles have IDs 304+
    queued = 0
    for a in articles:
        if a["id"] > 303:
            a["status"] = "queued"
            a["dateISO"] = "2099-01-01T00:00:00.000Z"
            queued += 1
    
    json.dump(articles, open(ARTICLES_PATH, "w"), indent=2, ensure_ascii=False)
    print(f"Marked {queued} articles as queued (status: queued, dateISO: 2099)")
    print(f"Total articles: {len(articles)}")
    print(f"Published (id <= 303): {len([a for a in articles if a['id'] <= 303])}")
    print(f"Queued (id > 303): {queued}")

if __name__ == "__main__":
    main()
