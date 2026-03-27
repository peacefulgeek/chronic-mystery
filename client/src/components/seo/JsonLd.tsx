import { SITE_CONFIG } from "@/data/types";
import type { Article } from "@/data/types";

interface Props {
  type:
    | "organization"
    | "website"
    | "article"
    | "collection"
    | "profile"
    | "breadcrumb";
  article?: Article;
  categoryName?: string;
  categorySlug?: string;
  breadcrumbs?: { name: string; url: string }[];
}

export default function JsonLd({
  type,
  article,
  categoryName,
  categorySlug,
  breadcrumbs,
}: Props) {
  let data: object;

  switch (type) {
    case "organization":
      data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_CONFIG.title,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.tagline,
        logo: `${SITE_CONFIG.bunnyBase}/images/logo.webp`,
      };
      break;

    case "website":
      data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_CONFIG.title,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.tagline,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_CONFIG.url}/articles?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };
      break;

    case "article": {
      if (!article) return null;
      const articleData: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        image: article.heroImage,
        datePublished: article.dateISO,
        dateModified: article.dateISO,
        author: {
          "@type": "Person",
          name: SITE_CONFIG.authorName,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.editorialName,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_CONFIG.bunnyBase}/images/logo.webp`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_CONFIG.url}/article/${article.slug}`,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".article-body h2", ".article-body p:first-of-type"],
        },
        wordCount: article.wordCount,
        articleSection: article.categoryName,
      };

      // Add FAQ schema if article has FAQs
      if (article.faqCount > 0 && article.faqItems.length > 0) {
        articleData["hasPart"] = {
          "@type": "FAQPage",
          mainEntity: article.faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        };
      }

      data = articleData;
      break;
    }

    case "collection":
      data = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: categoryName || "Articles",
        url: categorySlug
          ? `${SITE_CONFIG.url}/category/${categorySlug}`
          : `${SITE_CONFIG.url}/articles`,
        description: `${categoryName || "All"} articles on ${SITE_CONFIG.title}`,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_CONFIG.title,
          url: SITE_CONFIG.url,
        },
      };
      break;

    case "profile":
      data = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: SITE_CONFIG.authorName,
          jobTitle: SITE_CONFIG.authorTitle,
          description: SITE_CONFIG.authorBio,
          url: SITE_CONFIG.authorLink,
        },
      };
      break;

    case "breadcrumb":
      data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: (breadcrumbs || []).map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      };
      break;

    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
