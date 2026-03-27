import { Link } from "wouter";
import SeoHead from "@/components/seo/SeoHead";

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noIndex
      />
      <main className="container py-16 text-center">
        <h1 className="font-serif text-5xl font-bold mb-4 text-heather">404</h1>
        <h2 className="font-serif text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist, or it hasn't been published
          yet. Sometimes the body knows things the URL doesn't.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-sans font-medium bg-heather text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/articles"
            className="px-5 py-2.5 text-sm font-sans font-medium border border-border rounded-sm hover:bg-muted transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </main>
    </>
  );
}
