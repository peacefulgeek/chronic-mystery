import { Link } from "wouter";
import { SITE_CONFIG } from "@/data/types";
import SeoHead from "@/components/seo/SeoHead";

export default function PrivacyPage() {
  return (
    <>
      <SeoHead
        title={`Privacy Policy — ${SITE_CONFIG.title}`}
        description="Privacy policy for Chronic Mystery. How we handle your data."
        canonical={`${SITE_CONFIG.url}/privacy`}
        noIndex
      />
      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>
        <hr className="rule-double mb-8" />
        <div className="max-w-3xl mx-auto article-body">
          <h1 className="font-serif text-3xl font-bold mb-6">Privacy Policy</h1>
          <p><em>Last updated: March 2026</em></p>

          <h2>Information We Collect</h2>
          <p>
            Chronic Mystery collects minimal data. When you subscribe to our
            newsletter, we store your email address. We use essential cookies to
            ensure the site functions properly. We do not use tracking cookies,
            advertising pixels, or third-party analytics that identify individuals.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            Email addresses collected through the newsletter form are used solely
            to send periodic updates about new articles. We do not sell, rent, or
            share your email address with third parties.
          </p>

          <h2>Cookies</h2>
          <p>
            This site uses essential cookies only — specifically, a cookie to
            remember your cookie consent preference. No tracking or advertising
            cookies are used.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use BunnyCDN for content delivery and asset hosting. BunnyCDN may
            process standard server logs (IP addresses, request timestamps) as part
            of their service. We do not control BunnyCDN's data practices; please
            refer to their privacy policy.
          </p>

          <h2>Your Rights</h2>
          <p>
            You may request deletion of your email from our subscriber list at any
            time. You may also request information about what data we hold about
            you. As we collect minimal data, this is typically limited to your
            email address and subscription date.
          </p>

          <h2>Medical Disclaimer</h2>
          <p>
            {SITE_CONFIG.disclaimer}
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </div>
      </main>
    </>
  );
}
