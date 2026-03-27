import { useParams, useSearch, Link } from "wouter";
import { useState, useMemo } from "react";
import { getArticlesByCategory } from "@/data/store";
import { CATEGORIES, SITE_CONFIG } from "@/data/types";
import ArticleCard from "@/components/article/ArticleCard";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

const PER_PAGE = 12;

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  const articles = getArticlesByCategory(params.slug || "");

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / PER_PAGE);
  const pageArticles = articles.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (!category) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Section Not Found</h1>
        <Link href="/" className="text-sm text-heather hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: category.name, url: `${SITE_CONFIG.url}/category/${category.slug}` },
  ];

  return (
    <>
      <SeoHead
        title={`${category.name} — ${SITE_CONFIG.title}`}
        description={category.metaDescription}
        canonical={`${SITE_CONFIG.url}/category/${category.slug}`}
      />
      <JsonLd
        type="collection"
        categoryName={category.name}
        categorySlug={category.slug}
      />
      <JsonLd type="breadcrumb" breadcrumbs={breadcrumbs} />

      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <hr className="rule-double mb-6" />

        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            {category.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {category.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {articles.length} articles published
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pageArticles.map((a) => (
            <ArticleCard key={a.id} article={a} variant="medium" />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-sans border border-border rounded-sm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-sm font-sans border rounded-sm transition-colors ${
                  p === page
                    ? "bg-heather text-white border-heather"
                    : "border-border hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-sans border border-border rounded-sm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}
