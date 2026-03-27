import { useState, useMemo } from "react";
import { Link } from "wouter";
import { getPublishedArticles, searchArticles } from "@/data/store";
import { CATEGORIES, SITE_CONFIG } from "@/data/types";
import ArticleCard from "@/components/article/ArticleCard";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";
import { Search } from "lucide-react";

const PER_PAGE = 18;

export default function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const allArticles = useMemo(() => getPublishedArticles(), []);

  const filtered = useMemo(() => {
    let list = query.length >= 2 ? searchArticles(query) : allArticles;
    if (categoryFilter !== "all") {
      list = list.filter((a) => a.category === categoryFilter);
    }
    return list;
  }, [query, categoryFilter, allArticles]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageArticles = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <SeoHead
        title={`All Articles — ${SITE_CONFIG.title}`}
        description="Browse all articles about ME/CFS, chronic fatigue, fibromyalgia, and post-viral illness."
        canonical={`${SITE_CONFIG.url}/articles`}
      />
      <JsonLd type="collection" />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">All Articles</span>
        </nav>

        <hr className="rule-double mb-6" />

        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">
          All Articles
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm font-sans border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-heather"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm font-sans border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-heather"
          >
            <option value="all">All Sections</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pageArticles.map((a) => (
            <ArticleCard key={a.id} article={a} variant="medium" />
          ))}
        </div>

        {pageArticles.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No articles found. Try a different search or filter.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-6">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-sans border border-border rounded-sm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                  className={`px-3 py-1.5 text-sm font-sans border rounded-sm transition-colors ${
                    p === page ? "bg-heather text-white border-heather" : "border-border hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-sans border border-border rounded-sm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}
