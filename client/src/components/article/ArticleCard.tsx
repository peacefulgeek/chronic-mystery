import { Link } from "wouter";
import type { Article } from "@/data/types";
import { formatDate } from "@/data/store";

interface Props {
  article: Article;
  variant?: "large" | "medium" | "small" | "compact";
  showImage?: boolean;
  showDescription?: boolean;
}

export default function ArticleCard({
  article,
  variant = "medium",
  showImage = true,
  showDescription = true,
}: Props) {
  if (variant === "large") {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        {showImage && (
          <div className="overflow-hidden mb-4">
            <img
              src={article.heroImage}
              alt={article.title}
              width={1200}
              height={675}
              loading="lazy"
              className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <span className="category-badge mb-2">{article.categoryName}</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2 mb-2 group-hover:text-heather transition-colors leading-tight">
          {article.title}
        </h2>
        {showDescription && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {article.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground font-sans">
          <time dateTime={article.dateISO}>{formatDate(article.dateISO)}</time>
          <span>&middot;</span>
          <span>{article.readingTime} min read</span>
        </div>
      </Link>
    );
  }

  if (variant === "small") {
    return (
      <Link href={`/article/${article.slug}`} className="group flex gap-3">
        {showImage && (
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
            <img
              src={article.heroImage}
              alt={article.title}
              width={80}
              height={80}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-heather">
            {article.categoryName}
          </span>
          <h3 className="font-serif text-sm font-bold leading-snug mt-0.5 group-hover:text-heather transition-colors line-clamp-2">
            {article.title}
          </h3>
          <span className="text-[10px] text-muted-foreground mt-1 block">
            {article.readingTime} min read
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block py-2 border-b border-border last:border-0"
      >
        <h3 className="font-serif text-sm font-bold leading-snug group-hover:text-heather transition-colors line-clamp-2">
          {article.title}
        </h3>
        <span className="text-[10px] text-muted-foreground">
          {article.categoryName} &middot; {article.readingTime} min
        </span>
      </Link>
    );
  }

  // Medium (default)
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      {showImage && (
        <div className="overflow-hidden mb-3">
          <img
            src={article.heroImage}
            alt={article.title}
            width={600}
            height={338}
            loading="lazy"
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <span className="category-badge mb-1">{article.categoryName}</span>
      <h3 className="font-serif text-lg font-bold mt-1 mb-1 group-hover:text-heather transition-colors leading-snug line-clamp-2">
        {article.title}
      </h3>
      {showDescription && (
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {article.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-sans">
        <time dateTime={article.dateISO}>{formatDate(article.dateISO)}</time>
        <span>&middot;</span>
        <span>{article.readingTime} min</span>
      </div>
    </Link>
  );
}
