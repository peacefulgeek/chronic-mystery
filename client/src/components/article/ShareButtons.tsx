import { useState } from "react";
import { Link2, Twitter, Facebook, Check } from "lucide-react";
import { SITE_CONFIG } from "@/data/types";

interface Props {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_CONFIG.url}/article/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans border border-border rounded-sm hover:bg-muted transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? "Copied" : "Copy Link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans border border-border rounded-sm hover:bg-muted transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={14} />
        Tweet
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans border border-border rounded-sm hover:bg-muted transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={14} />
        Share
      </a>
    </div>
  );
}
