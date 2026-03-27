import { Link } from "wouter";
import { SITE_CONFIG, CATEGORIES } from "@/data/types";
import { getStartHereArticles, getArticlesByCategory } from "@/data/store";
import ArticleCard from "@/components/article/ArticleCard";
import SeoHead from "@/components/seo/SeoHead";

export default function StartHerePage() {
  const pillarArticles = getStartHereArticles();

  return (
    <>
      <SeoHead
        title={`Start Here — ${SITE_CONFIG.title}`}
        description="New to Chronic Mystery? Start here. A guided reading path through ME/CFS, chronic fatigue, and the questions nobody else is asking."
        canonical={`${SITE_CONFIG.url}/start-here`}
      />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Start Here</span>
        </nav>

        <hr className="rule-double mb-8" />

        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Start Here
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            If you're new to this site — or new to the experience of chronic
            illness that doesn't fit neatly into a diagnosis — this is where to
            begin. These articles represent the core threads of what we explore
            here.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Read them in order, or jump to whatever speaks to where you are right
            now. There's no wrong way to do this.
          </p>
        </div>

        {/* Pillar articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pillarArticles.map((a) => (
            <ArticleCard key={a.id} article={a} variant="medium" />
          ))}
        </div>

        <hr className="rule-single mb-8" />

        {/* Section guides */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-6">
            Explore by Section
          </h2>
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const catArticles = getArticlesByCategory(cat.slug);
              return (
                <div key={cat.slug} className="border-b border-border pb-6 last:border-0">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="font-serif text-xl font-bold hover:text-heather transition-colors"
                  >
                    {cat.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {cat.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {catArticles.length} articles &middot;{" "}
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-heather hover:underline"
                    >
                      Browse section &rarr;
                    </Link>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Energy Audit CTA */}
        <div className="mt-12 bg-heather/10 border border-heather/20 rounded-sm p-8 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-xl font-bold mb-2">
            Not Sure Where You Are?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Take the Energy Audit — a quick, honest assessment of where your
            energy actually goes. No diagnosis, no judgment. Just clarity.
          </p>
          <Link
            href="/energy-audit"
            className="inline-block px-6 py-2.5 text-sm font-sans font-medium bg-heather text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            Take the Energy Audit
          </Link>
        </div>
      </main>
    </>
  );
}
