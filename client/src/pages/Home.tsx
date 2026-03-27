import { SITE_CONFIG } from "@/data/types";
import {
  getFeaturedArticles,
  getHomepageCategorySections,
  getPublishedCount,
} from "@/data/store";
import ArticleCard from "@/components/article/ArticleCard";
import NewsletterForm from "@/components/layout/NewsletterForm";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";
import { Link } from "wouter";

export default function Home() {
  const featured = getFeaturedArticles();
  const categorySections = getHomepageCategorySections();
  const publishedCount = getPublishedCount();

  const hero = featured[0];
  const topRight = featured.slice(1, 5);
  const topRightB = featured.slice(5, 9);

  return (
    <>
      <SeoHead
        title={`${SITE_CONFIG.title} — ${SITE_CONFIG.subtitle}`}
        description={SITE_CONFIG.tagline}
        canonical={SITE_CONFIG.url}
        ogImage={`${SITE_CONFIG.bunnyBase}/images/og/site-og.webp`}
      />
      <JsonLd type="organization" />
      <JsonLd type="website" />

      <main className="container py-6">
        {/* Masthead */}
        <div className="text-center mb-6">
          <p className="font-serif text-sm italic text-muted-foreground">
            {SITE_CONFIG.tagline}
          </p>
        </div>
        <hr className="rule-double mb-6" />

        {/* 3-Column Featured Grid */}
        {hero && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Featured large */}
            <div className="lg:col-span-1">
              <ArticleCard article={hero} variant="large" />
            </div>

            {/* Right: 2 columns of small cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                {topRight.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    variant="small"
                  />
                ))}
              </div>
              <div className="space-y-4">
                {topRightB.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    variant="small"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <hr className="rule-single mb-8" />

        {/* Category Sections */}
        {categorySections.map((section, idx) => (
          <div key={section.category.slug}>
            {/* Newsletter banner between sections 3 and 4 */}
            {idx === 3 && (
              <div className="bg-heather/10 border border-heather/20 rounded-sm p-8 mb-8 text-center">
                <h3 className="font-serif text-xl font-bold mb-2">
                  Stay Connected
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Join our community. No spam, no noise — just thoughtful
                  writing about living with chronic illness.
                </p>
                <div className="flex justify-center">
                  <NewsletterForm source="homepage-banner" />
                </div>
              </div>
            )}

            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold">
                  <Link
                    href={`/category/${section.category.slug}`}
                    className="hover:text-heather transition-colors"
                  >
                    {section.category.name}
                  </Link>
                </h2>
                <Link
                  href={`/category/${section.category.slug}`}
                  className="text-xs font-sans font-medium text-heather hover:underline"
                >
                  See all &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.articles.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="medium" />
                ))}
              </div>
              {idx < categorySections.length - 1 && (
                <hr className="rule-single mt-8" />
              )}
            </section>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-3">
            {publishedCount} articles and counting.
          </p>
          <Link
            href="/articles"
            className="inline-block px-6 py-2.5 text-sm font-sans font-medium bg-heather text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            Browse All Articles
          </Link>
        </div>
      </main>
    </>
  );
}
