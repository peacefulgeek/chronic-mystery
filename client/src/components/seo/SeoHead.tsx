import { useEffect } from "react";
import { SITE_CONFIG } from "@/data/types";

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  articleAuthor?: string;
  noIndex?: boolean;
  /** ISO date string for article:published_time (Pinterest Rich Pins) */
  publishedTime?: string;
  /** Article section/category name (Pinterest Rich Pins) */
  articleSection?: string;
  /** Article tags for Pinterest Rich Pins */
  articleTags?: string[];
}

export default function SeoHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
  publishedTime,
  articleSection,
  articleTags,
}: Props) {
  useEffect(() => {
    // Update document title
    document.title = title.includes(SITE_CONFIG.title)
      ? title
      : `${title} | ${SITE_CONFIG.title}`;

    // Update meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Remove a meta tag if it exists (for cleanup when navigating away from articles)
    const removeMeta = (name: string, property = false) => {
      const attr = property ? "property" : "name";
      const el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) el.remove();
    };

    setMeta("description", description);
    setMeta("author", SITE_CONFIG.editorialName);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_CONFIG.title, true);
    if (canonical) setMeta("og:url", canonical, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    setMeta("article:author", SITE_CONFIG.editorialName, true);

    // Pinterest Rich Pins — article:published_time, article:section, article:tag
    if (publishedTime) {
      setMeta("article:published_time", publishedTime, true);
      setMeta("article:modified_time", publishedTime, true);
    } else {
      removeMeta("article:published_time", true);
      removeMeta("article:modified_time", true);
    }

    if (articleSection) {
      setMeta("article:section", articleSection, true);
    } else {
      removeMeta("article:section", true);
    }

    // Handle article tags
    // First remove all existing article:tag metas
    document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
    if (articleTags && articleTags.length > 0) {
      for (const tag of articleTags) {
        const el = document.createElement("meta");
        el.setAttribute("property", "article:tag");
        el.setAttribute("content", tag);
        document.head.appendChild(el);
      }
    }

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical, ogImage, ogType, noIndex, publishedTime, articleSection, articleTags]);

  return null;
}
