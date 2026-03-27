import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { CATEGORIES, SITE_CONFIG } from "@/data/types";
import { searchArticles, getPublishedCount } from "@/data/store";
import type { Article } from "@/data/types";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setSectionsOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (
        sectionsRef.current &&
        !sectionsRef.current.contains(e.target as Node)
      ) {
        setSectionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchResults(searchArticles(searchQuery).slice(0, 6));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-cream sticky top-0 z-50 border-b border-border">
      {/* Masthead rule */}
      <div className="masthead-rule" />

      <div className="container">
        {/* Top bar with date and article count */}
        <div className="hidden md:flex justify-between items-center py-1 text-xs text-muted-foreground font-sans">
          <span>{today}</span>
          <span>{getPublishedCount()} articles published</span>
        </div>

        {/* Main nav */}
        <nav className="flex items-center justify-between py-3 md:py-2">
          {/* Mobile hamburger - slides from LEFT */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -ml-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Site name */}
          <Link href="/" className="flex flex-col items-center md:items-start">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">
              {SITE_CONFIG.title}
            </span>
            <span className="hidden md:block text-xs text-muted-foreground font-sans tracking-wide">
              {SITE_CONFIG.subtitle}
            </span>
          </Link>

          {/* Right side: Search + Sections + About */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-lg rounded-sm p-3 z-50">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-sm text-sm font-sans bg-background focus:outline-none focus:ring-1 focus:ring-heather"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-2 divide-y divide-border">
                      {searchResults.map((a) => (
                        <Link
                          key={a.id}
                          href={`/article/${a.slug}`}
                          className="block py-2 hover:bg-muted px-2 -mx-2 transition-colors"
                        >
                          <span className="text-sm font-serif font-bold text-foreground">
                            {a.title}
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {a.categoryName}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchQuery.length >= 2 && searchResults.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      No articles found.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sections dropdown */}
            <div ref={sectionsRef} className="relative hidden md:block">
              <button
                onClick={() => setSectionsOpen(!sectionsOpen)}
                className="flex items-center gap-1 text-sm font-sans font-medium hover:text-heather transition-colors px-2 py-1"
              >
                Sections <ChevronDown size={14} />
              </button>
              {sectionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border shadow-lg rounded-sm py-1 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm font-sans hover:bg-muted transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <hr className="rule-single my-1" />
                  <Link
                    href="/articles"
                    className="block px-4 py-2 text-sm font-sans hover:bg-muted transition-colors"
                  >
                    All Articles
                  </Link>
                </div>
              )}
            </div>

            {/* About */}
            <Link
              href="/about"
              className="hidden md:block text-sm font-sans font-medium hover:text-heather transition-colors px-2 py-1"
            >
              About
            </Link>

            {/* Start Here */}
            <Link
              href="/start-here"
              className="hidden md:block text-sm font-sans font-medium hover:text-heather transition-colors px-2 py-1"
            >
              Start Here
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu - slides from LEFT */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 flex">
          <div className="w-72 bg-card border-r border-border h-full overflow-y-auto shadow-xl animate-in slide-in-from-left duration-200">
            <div className="p-4 space-y-1">
              <Link
                href="/start-here"
                className="block py-3 px-3 text-sm font-sans font-medium hover:bg-muted rounded-sm"
              >
                Start Here
              </Link>
              <Link
                href="/articles"
                className="block py-3 px-3 text-sm font-sans font-medium hover:bg-muted rounded-sm"
              >
                All Articles
              </Link>
              <hr className="rule-single my-2" />
              <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider px-3 pt-2">
                Sections
              </p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block py-2 px-3 text-sm font-sans hover:bg-muted rounded-sm"
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="rule-single my-2" />
              <Link
                href="/about"
                className="block py-3 px-3 text-sm font-sans font-medium hover:bg-muted rounded-sm"
              >
                About
              </Link>
              <Link
                href="/energy-audit"
                className="block py-3 px-3 text-sm font-sans font-medium hover:bg-muted rounded-sm"
              >
                Energy Audit
              </Link>
            </div>
          </div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
