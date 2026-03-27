import type { Article } from "./types";
import allArticles from "./articles.json";

const articles = allArticles as Article[];

/** Only show articles whose dateISO has passed */
export function filterPublished(list: Article[] = articles): Article[] {
  const now = new Date();
  return list.filter((a) => new Date(a.dateISO) <= now);
}

/** Get all published articles sorted by date descending */
export function getPublishedArticles(): Article[] {
  return filterPublished().sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );
}

/** Get published articles for a specific category */
export function getArticlesByCategory(categorySlug: string): Article[] {
  return getPublishedArticles().filter((a) => a.category === categorySlug);
}

/** Get a single article by slug */
export function getArticleBySlug(slug: string): Article | undefined {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return undefined;
  // Only return if published
  if (new Date(article.dateISO) > new Date()) return undefined;
  return article;
}

/** Get related articles (same category, excluding current) */
export function getRelatedArticles(
  article: Article,
  count: number = 4
): Article[] {
  return getPublishedArticles()
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, count);
}

/** Get cross-category articles (different category, excluding current) */
export function getCrossCategoryArticles(
  article: Article,
  count: number = 6
): Article[] {
  return getPublishedArticles()
    .filter((a) => a.category !== article.category)
    .slice(0, count);
}

/** Get popular articles (mix of categories) */
export function getPopularArticles(
  excludeIds: number[] = [],
  count: number = 5
): Article[] {
  const published = getPublishedArticles().filter(
    (a) => !excludeIds.includes(a.id)
  );
  // Pick one from each category
  const result: Article[] = [];
  const seen = new Set<string>();
  for (const a of published) {
    if (!seen.has(a.category)) {
      result.push(a);
      seen.add(a.category);
    }
    if (result.length >= count) break;
  }
  return result;
}

/** Search articles by title and description */
export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getPublishedArticles().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.categoryName.toLowerCase().includes(q)
  );
}

/** Get the published article count */
export function getPublishedCount(): number {
  return filterPublished().length;
}

/** Get featured articles for homepage (first 9 published) */
export function getFeaturedArticles(): Article[] {
  return getPublishedArticles().slice(0, 9);
}

/** Get articles for each category section on homepage */
export function getHomepageCategorySections(): {
  category: { slug: string; name: string };
  articles: Article[];
}[] {
  const cats = [
    { slug: "the-mystery", name: "The Mystery" },
    { slug: "the-medical", name: "The Medical" },
    { slug: "the-management", name: "The Management" },
    { slug: "the-identity", name: "The Identity" },
    { slug: "the-deeper-rest", name: "The Deeper Rest" },
  ];
  return cats.map((cat) => ({
    category: cat,
    articles: getArticlesByCategory(cat.slug).slice(0, 3),
  }));
}

/** Format date for display */
export function formatDate(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Get start-here pillar articles (curated) */
export function getStartHereArticles(): Article[] {
  const published = getPublishedArticles();
  // Pick one from each category
  const result: Article[] = [];
  const cats = [
    "the-mystery",
    "the-medical",
    "the-management",
    "the-identity",
    "the-deeper-rest",
  ];
  for (const cat of cats) {
    const a = published.find((a) => a.category === cat);
    if (a) result.push(a);
  }
  // Add one more from the-mystery if available
  const extra = published.find(
    (a) => a.category === "the-mystery" && !result.includes(a)
  );
  if (extra) result.push(extra);
  return result.slice(0, 6);
}
