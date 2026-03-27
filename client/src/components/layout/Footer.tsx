import { Link } from "wouter";
import { CATEGORIES, SITE_CONFIG } from "@/data/types";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              {SITE_CONFIG.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/60 max-w-md">
              {SITE_CONFIG.tagline}
            </p>
            <div className="mt-6">
              <NewsletterForm source="footer" variant="dark" />
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
              Sections
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
              Pages
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/start-here"
                  className="text-sm hover:text-white transition-colors"
                >
                  Start Here
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/energy-audit"
                  className="text-sm hover:text-white transition-colors"
                >
                  Energy Audit
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-sm hover:text-white transition-colors"
                >
                  All Articles
                </Link>
              </li>
            </ul>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 mt-6">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 leading-relaxed max-w-3xl">
            {SITE_CONFIG.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-white/30">
            &copy; {year} {SITE_CONFIG.editorialName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
