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
}

export default function SeoHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
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
  }, [title, description, canonical, ogImage, ogType, noIndex]);

  return null;
}
