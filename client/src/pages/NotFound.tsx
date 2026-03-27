import { Link } from "wouter";
import SeoHead from "@/components/seo/SeoHead";
import { getPublishedArticles } from "@/data/store";
import { CATEGORIES } from "@/data/types";

export default function NotFound() {
  // Get 6 articles from different categories for suggestions
  const published = getPublishedArticles();
  const suggestions: typeof published = [];
  const usedCategories = new Set<string>();
  for (const a of published) {
    if (suggestions.length >= 6) break;
    if (!usedCategories.has(a.category)) {
      suggestions.push(a);
      usedCategories.add(a.category);
    }
  }
  // Fill remaining with any published articles
  for (const a of published) {
    if (suggestions.length >= 6) break;
    if (!suggestions.includes(a)) suggestions.push(a);
  }

  return (
    <>
      <SeoHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noIndex
      />
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-5xl font-bold mb-4 text-heather text-center">404</h1>
          <h2 className="font-serif text-2xl font-bold mb-6 text-center">Page Not Found</h2>

          <div className="article-body mb-10">
            <p>
              The page you're looking for doesn't exist, or it hasn't been published
              yet. In chronic illness, dead ends are familiar territory. You follow a
              lead — a new diagnosis, a promising treatment, a doctor who finally
              seems to listen — and it goes nowhere. The body keeps its own schedule.
            </p>
            <p>
              But dead ends aren't the same as endings. Sometimes the path you didn't
              plan is the one that teaches you something. The nervous system knows
              this. It reroutes. It adapts. It finds another way through.
            </p>
            <p>
              While you're here, try one of these instead:
            </p>
          </div>

          <div className="border-t border-rule pt-6 mb-8">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Suggested Reading
            </h3>
            <ul className="space-y-3">
              {suggestions.map((article) => {
                const cat = CATEGORIES.find(c => c.slug === article.category);
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/${article.category}/${article.slug}`}
                      className="group flex items-baseline gap-3"
                    >
                      <span className="text-xs font-sans font-medium text-heather uppercase tracking-wide shrink-0">
                        {cat?.name || article.category}
                      </span>
                      <span className="font-serif text-base group-hover:text-heather transition-colors">
                        {article.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-sans font-medium bg-heather text-white rounded-sm hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>
            <Link
              href="/start-here"
              className="px-5 py-2.5 text-sm font-sans font-medium border border-border rounded-sm hover:bg-muted transition-colors"
            >
              Start Here
            </Link>
            <Link
              href="/articles"
              className="px-5 py-2.5 text-sm font-sans font-medium border border-border rounded-sm hover:bg-muted transition-colors"
            >
              All Articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
