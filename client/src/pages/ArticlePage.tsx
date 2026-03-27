import { useParams } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import {
  getArticleBySlug,
  getRelatedArticles,
  getCrossCategoryArticles,
  getPopularArticles,
  formatDate,
} from "@/data/store";
import { SITE_CONFIG } from "@/data/types";
import ArticleCard from "@/components/article/ArticleCard";
import ShareButtons from "@/components/article/ShareButtons";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = getArticleBySlug(params.slug || "");
  const [activeSection, setActiveSection] = useState("");

  // Extract H2 headings for ToC
  const headings = useMemo(() => {
    if (!article) return [];
    const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const matches: { id: string; text: string }[] = [];
    let match;
    while ((match = regex.exec(article.body)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      matches.push({ id, text });
    }
    return matches;
  }, [article]);

  // Add IDs to H2s in body
  const processedBody = useMemo(() => {
    if (!article) return "";
    let body = article.body;
    headings.forEach((h) => {
      body = body.replace(
        new RegExp(`<h2([^>]*)>${h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h2>`, "i"),
        `<h2 id="${h.id}"$1>${h.text}</h2>`
      );
    });
    return body;
  }, [article, headings]);

  // Intersection observer for active ToC section
  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  if (!article) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This article may not be published yet.
        </p>
        <Link
          href="/articles"
          className="text-sm font-sans text-heather hover:underline"
        >
          &larr; Browse all articles
        </Link>
      </div>
    );
  }

  const related = getRelatedArticles(article, 4);
  const crossCategory = getCrossCategoryArticles(article, 6);
  const popular = getPopularArticles(
    [article.id, ...related.map((r) => r.id), ...crossCategory.map((c) => c.id)],
    5
  );

  const breadcrumbs = [
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: article.categoryName,
      url: `${SITE_CONFIG.url}/category/${article.category}`,
    },
    {
      name: article.title,
      url: `${SITE_CONFIG.url}/article/${article.slug}`,
    },
  ];

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.description}
        canonical={`${SITE_CONFIG.url}/article/${article.slug}`}
        ogImage={article.ogImage}
        ogType="article"
      />
      <JsonLd type="article" article={article} />
      <JsonLd type="breadcrumb" breadcrumbs={breadcrumbs} />

      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="text-xs font-sans text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-heather">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            href={`/category/${article.category}`}
            className="hover:text-heather"
          >
            {article.categoryName}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-8">
          {/* Left: Sticky ToC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                In This Article
              </p>
              <nav className="space-y-1.5">
                {headings.map((h, i) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`block text-xs font-sans leading-snug py-1 border-l-2 pl-3 transition-colors ${
                      activeSection === h.id
                        ? "border-heather text-heather font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground mr-1">
                      {i + 1}.
                    </span>
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Center: Article Content */}
          <article className="min-w-0">
            {/* Hero image - NOT lazy loaded */}
            <img
              src={article.heroImage}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full aspect-video object-cover mb-6"
            />

            {/* Category + Date + Reading time */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Link
                href={`/category/${article.category}`}
                className="category-badge"
              >
                {article.categoryName}
              </Link>
              <time
                dateTime={article.dateISO}
                className="text-xs text-muted-foreground font-sans"
              >
                {formatDate(article.dateISO)}
              </time>
              <span className="text-xs text-muted-foreground">&middot;</span>
              <span className="text-xs text-muted-foreground font-sans">
                {article.readingTime} min read
              </span>
            </div>

            {/* Title - only H1 on page */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4">
              {article.title}
            </h1>

            {/* Share buttons */}
            <div className="mb-6">
              <ShareButtons title={article.title} slug={article.slug} />
            </div>

            <hr className="rule-single mb-6" />

            {/* Mobile ToC */}
            <details className="lg:hidden mb-6 border border-border rounded-sm p-3">
              <summary className="text-sm font-sans font-medium cursor-pointer">
                Table of Contents
              </summary>
              <nav className="mt-2 space-y-1">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="block text-sm font-sans text-muted-foreground hover:text-heather py-0.5"
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </details>

            {/* Article body with drop cap */}
            <div
              className="article-body drop-cap"
              dangerouslySetInnerHTML={{ __html: processedBody }}
            />

            {/* FAQ Section */}
            {article.faqCount > 0 && article.faqItems.length > 0 && (
              <section className="mt-10 pt-6 border-t border-border">
                <h2 className="font-serif text-2xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {article.faqItems.map((faq, i) => (
                    <div key={i}>
                      <h3 className="font-serif text-lg font-bold mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-muted/50 border border-border rounded-sm">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                {SITE_CONFIG.disclaimer}
              </p>
            </div>

            {/* Share buttons bottom */}
            <div className="mt-6">
              <ShareButtons title={article.title} slug={article.slug} />
            </div>

            {/* Related Coverage */}
            {crossCategory.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="font-serif text-xl font-bold mb-6">
                  Related Coverage
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {crossCategory.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="medium" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Right: Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              {/* Kalesh Bio Card */}
              <div className="border border-border p-4 rounded-sm">
                <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Spiritual Advisor
                </p>
                <h3 className="font-serif text-lg font-bold mb-1">
                  {SITE_CONFIG.authorName}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {SITE_CONFIG.authorTitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {SITE_CONFIG.authorBio}
                </p>
                <a
                  href={SITE_CONFIG.authorLink}
                  className="inline-block text-sm font-sans font-medium text-heather hover:underline"
                >
                  {SITE_CONFIG.authorLinkText}
                </a>
              </div>

              {/* Same Category */}
              {related.length > 0 && (
                <div>
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    More in {article.categoryName}
                  </p>
                  <div className="space-y-3">
                    {related.map((a) => (
                      <ArticleCard
                        key={a.id}
                        article={a}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Articles */}
              {popular.length > 0 && (
                <div>
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Popular Articles
                  </p>
                  <div className="space-y-3">
                    {popular.map((a) => (
                      <ArticleCard
                        key={a.id}
                        article={a}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
