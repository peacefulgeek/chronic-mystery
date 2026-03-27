import { Link } from "wouter";
import { SITE_CONFIG } from "@/data/types";
import SeoHead from "@/components/seo/SeoHead";

export default function TermsPage() {
  return (
    <>
      <SeoHead
        title={`Terms of Service — ${SITE_CONFIG.title}`}
        description="Terms of service for Chronic Mystery."
        canonical={`${SITE_CONFIG.url}/terms`}
        noIndex
      />
      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Terms of Service</span>
        </nav>
        <hr className="rule-double mb-8" />
        <div className="max-w-3xl mx-auto article-body">
          <h1 className="font-serif text-3xl font-bold mb-6">Terms of Service</h1>
          <p><em>Last updated: March 2026</em></p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using Chronic Mystery ({SITE_CONFIG.url}), you accept
            and agree to be bound by these terms. If you do not agree, please do
            not use this site.
          </p>

          <h2>Content and Use</h2>
          <p>
            All content on this site is provided for informational and educational
            purposes only. It is not medical advice, diagnosis, or treatment. Always
            seek the advice of a qualified healthcare provider with any questions
            regarding a medical condition.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All articles, images, and other content on this site are the property
            of {SITE_CONFIG.editorialName} and are protected by copyright law. You
            may share links to articles but may not reproduce, distribute, or
            create derivative works without written permission.
          </p>

          <h2>User Conduct</h2>
          <p>
            You agree not to use this site for any unlawful purpose, to attempt to
            gain unauthorized access to any portion of the site, or to interfere
            with the proper functioning of the site.
          </p>

          <h2>Disclaimer of Warranties</h2>
          <p>
            This site is provided "as is" without warranties of any kind, either
            express or implied. We do not warrant that the site will be
            uninterrupted, error-free, or free of viruses or other harmful
            components.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall {SITE_CONFIG.editorialName} be liable for any
            indirect, incidental, special, consequential, or punitive damages
            arising from your use of this site.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use
            of the site after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </main>
    </>
  );
}
