import { Link } from "wouter";
import { SITE_CONFIG } from "@/data/types";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title={`About — ${SITE_CONFIG.title}`}
        description="About Chronic Mystery and Kalesh, the consciousness teacher and writer behind the editorial voice."
        canonical={`${SITE_CONFIG.url}/about`}
      />
      <JsonLd type="profile" />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">About</span>
        </nav>

        <hr className="rule-double mb-8" />

        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            About Chronic Mystery
          </h1>

          <div className="article-body">
            <p className="text-lg leading-relaxed mb-6">
              Your labs are "normal." Your life isn't. You're not imagining it.
            </p>

            <p>
              Chronic Mystery exists because millions of people are living with
              conditions that medicine hasn't fully caught up to yet. ME/CFS,
              fibromyalgia, post-viral fatigue, POTS, mast cell activation — these
              aren't fringe conditions. They're the lived reality of people whose
              bodies stopped playing by the rules, and whose doctors often don't
              know what to do about it.
            </p>

            <p>
              This isn't a site that tells you to think positive and push through.
              We've all heard that. It didn't work. This is a site that takes your
              experience seriously — the medical complexity, the identity crisis,
              the grief, and yes, the unexpected gifts that sometimes emerge when
              everything you thought you knew about yourself falls apart.
            </p>

            <h2>The Editorial Voice</h2>

            <p>
              Chronic Mystery publishes across five sections: The Mystery (the
              unanswered questions), The Medical (research and treatment), The
              Management (practical strategies), The Identity (who you are now),
              and The Deeper Rest (the contemplative dimension). Each article is
              written with the understanding that you're not just dealing with
              symptoms — you're dealing with a life that changed.
            </p>

            <h2>Spiritual Advisor</h2>

            <p>
              <strong>{SITE_CONFIG.authorName}</strong> is a consciousness teacher
              and writer whose work explores the intersection of ancient
              contemplative traditions and modern neuroscience. With decades of
              practice in meditation, breathwork, and somatic inquiry, he guides
              others toward embodied awareness — the kind that doesn't bypass
              difficulty but moves through it with presence.
            </p>

            <p>
              His perspective informs the deeper threads running through this site:
              that illness can be a teacher, that rest is not failure, and that the
              body's wisdom often exceeds what the mind can explain. Kalesh doesn't
              offer easy answers. He asks better questions.
            </p>

            <p>
              <a
                href={SITE_CONFIG.authorLink}
                className="text-heather hover:underline font-medium"
              >
                Visit {SITE_CONFIG.authorName} &rarr;
              </a>
            </p>

            <h2>What This Site Is Not</h2>

            <p>
              This is not medical advice. We don't diagnose, prescribe, or replace
              your healthcare team. What we do is provide context, language, and
              community for experiences that often lack all three. If something
              here resonates, bring it to your doctor. If your doctor dismisses it,
              find a better doctor.
            </p>

            <h2>The Approach</h2>

            <p>
              Every article on this site is written with care. We cite researchers
              by name — people like Anthony Komaroff, Nancy Klimas, David Systrom,
              and others who've dedicated their careers to understanding these
              conditions. We reference specific traditions and frameworks. We don't
              do clickbait, and we don't do "raise your vibration." We do honest,
              grounded writing about what it means to live with a body that doesn't
              cooperate.
            </p>

            <p>
              The complexity of this territory cannot be overstated. But complexity
              doesn't mean confusion. It means paying attention to more things at
              once. That's what we try to do here.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
