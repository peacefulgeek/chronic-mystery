/**
 * image-library.mjs
 *
 * 40 pre-generated hero images for article assignment.
 * Each image has a theme tag and category affinity for smart matching.
 * The cron picks a random image from the matching category pool.
 */

export const IMAGE_LIBRARY = [
  { id: 1, url: "https://chronic-mystery.b-cdn.net/images/library/library-01.webp", theme: "rest-bed-morning", categories: ["the-deeper-rest", "the-management"] },
  { id: 2, url: "https://chronic-mystery.b-cdn.net/images/library/library-02.webp", theme: "warm-mug-comfort", categories: ["the-management", "the-deeper-rest"] },
  { id: 3, url: "https://chronic-mystery.b-cdn.net/images/library/library-03.webp", theme: "wellness-flatlay", categories: ["the-management", "the-medical"] },
  { id: 4, url: "https://chronic-mystery.b-cdn.net/images/library/library-04.webp", theme: "forest-path-mist", categories: ["the-mystery", "the-identity", "the-deeper-rest"] },
  { id: 5, url: "https://chronic-mystery.b-cdn.net/images/library/library-05.webp", theme: "nervous-system-art", categories: ["the-medical", "the-mystery"] },
  { id: 6, url: "https://chronic-mystery.b-cdn.net/images/library/library-06.webp", theme: "yoga-mat-rest", categories: ["the-management", "the-deeper-rest"] },
  { id: 7, url: "https://chronic-mystery.b-cdn.net/images/library/library-07.webp", theme: "books-shelf-cozy", categories: ["the-mystery", "the-medical"] },
  { id: 8, url: "https://chronic-mystery.b-cdn.net/images/library/library-08.webp", theme: "ocean-golden-hour", categories: ["the-deeper-rest", "the-identity"] },
  { id: 9, url: "https://chronic-mystery.b-cdn.net/images/library/library-09.webp", theme: "reading-chair-lamp", categories: ["the-deeper-rest", "the-identity"] },
  { id: 10, url: "https://chronic-mystery.b-cdn.net/images/library/library-10.webp", theme: "dew-drops-web", categories: ["the-mystery", "the-medical"] },
  { id: 11, url: "https://chronic-mystery.b-cdn.net/images/library/library-11.webp", theme: "candle-dark-hope", categories: ["the-identity", "the-deeper-rest"] },
  { id: 12, url: "https://chronic-mystery.b-cdn.net/images/library/library-12.webp", theme: "autumn-road-journey", categories: ["the-identity", "the-mystery"] },
  { id: 13, url: "https://chronic-mystery.b-cdn.net/images/library/library-13.webp", theme: "herbs-apothecary", categories: ["the-management", "the-medical"] },
  { id: 14, url: "https://chronic-mystery.b-cdn.net/images/library/library-14.webp", theme: "lake-dawn-dock", categories: ["the-deeper-rest", "the-identity"] },
  { id: 15, url: "https://chronic-mystery.b-cdn.net/images/library/library-15.webp", theme: "sprout-cracked-earth", categories: ["the-identity", "the-mystery"] },
  { id: 16, url: "https://chronic-mystery.b-cdn.net/images/library/library-16.webp", theme: "rainy-window-reading", categories: ["the-deeper-rest", "the-identity"] },
  { id: 17, url: "https://chronic-mystery.b-cdn.net/images/library/library-17.webp", theme: "anti-inflammatory-food", categories: ["the-management", "the-medical"] },
  { id: 18, url: "https://chronic-mystery.b-cdn.net/images/library/library-18.webp", theme: "neural-network-art", categories: ["the-medical", "the-mystery"] },
  { id: 19, url: "https://chronic-mystery.b-cdn.net/images/library/library-19.webp", theme: "stone-stairs-flowers", categories: ["the-identity", "the-management"] },
  { id: 20, url: "https://chronic-mystery.b-cdn.net/images/library/library-20.webp", theme: "hourglass-patience", categories: ["the-management", "the-deeper-rest"] },
  { id: 21, url: "https://chronic-mystery.b-cdn.net/images/library/library-21.webp", theme: "self-care-shelf", categories: ["the-management", "the-deeper-rest"] },
  { id: 22, url: "https://chronic-mystery.b-cdn.net/images/library/library-22.webp", theme: "mountain-sunrise-mist", categories: ["the-identity", "the-mystery"] },
  { id: 23, url: "https://chronic-mystery.b-cdn.net/images/library/library-23.webp", theme: "cozy-socks-rest", categories: ["the-deeper-rest", "the-management"] },
  { id: 24, url: "https://chronic-mystery.b-cdn.net/images/library/library-24.webp", theme: "greenhouse-nurture", categories: ["the-management", "the-identity"] },
  { id: 25, url: "https://chronic-mystery.b-cdn.net/images/library/library-25.webp", theme: "heart-roots-art", categories: ["the-identity", "the-deeper-rest"] },
  { id: 26, url: "https://chronic-mystery.b-cdn.net/images/library/library-26.webp", theme: "smoothie-kitchen", categories: ["the-management", "the-medical"] },
  { id: 27, url: "https://chronic-mystery.b-cdn.net/images/library/library-27.webp", theme: "hammock-garden", categories: ["the-deeper-rest", "the-management"] },
  { id: 28, url: "https://chronic-mystery.b-cdn.net/images/library/library-28.webp", theme: "journal-writing", categories: ["the-identity", "the-deeper-rest"] },
  { id: 29, url: "https://chronic-mystery.b-cdn.net/images/library/library-29.webp", theme: "dna-helix-art", categories: ["the-medical", "the-mystery"] },
  { id: 30, url: "https://chronic-mystery.b-cdn.net/images/library/library-30.webp", theme: "sleep-environment", categories: ["the-deeper-rest", "the-management"] },
  { id: 31, url: "https://chronic-mystery.b-cdn.net/images/library/library-31.webp", theme: "lab-test-tubes", categories: ["the-medical", "the-mystery"] },
  { id: 32, url: "https://chronic-mystery.b-cdn.net/images/library/library-32.webp", theme: "meditation-cushion", categories: ["the-deeper-rest", "the-identity"] },
  { id: 33, url: "https://chronic-mystery.b-cdn.net/images/library/library-33.webp", theme: "compass-map-direction", categories: ["the-mystery", "the-identity"] },
  { id: 34, url: "https://chronic-mystery.b-cdn.net/images/library/library-34.webp", theme: "zen-garden-calm", categories: ["the-deeper-rest", "the-identity"] },
  { id: 35, url: "https://chronic-mystery.b-cdn.net/images/library/library-35.webp", theme: "hands-holding-support", categories: ["the-identity", "the-deeper-rest"] },
  { id: 36, url: "https://chronic-mystery.b-cdn.net/images/library/library-36.webp", theme: "breakfast-bed-nourish", categories: ["the-management", "the-deeper-rest"] },
  { id: 37, url: "https://chronic-mystery.b-cdn.net/images/library/library-37.webp", theme: "ice-crystals-beauty", categories: ["the-mystery", "the-medical"] },
  { id: 38, url: "https://chronic-mystery.b-cdn.net/images/library/library-38.webp", theme: "library-research", categories: ["the-mystery", "the-medical"] },
  { id: 39, url: "https://chronic-mystery.b-cdn.net/images/library/library-39.webp", theme: "sunset-river-heron", categories: ["the-deeper-rest", "the-identity"] },
  { id: 40, url: "https://chronic-mystery.b-cdn.net/images/library/library-40.webp", theme: "aloe-vera-windowsill", categories: ["the-management", "the-medical"] },
];

/**
 * Pick a random image from the library, preferring ones that match the category.
 * @param {string} category - Article category (e.g., "the-medical")
 * @param {string[]} usedIds - Image IDs already used recently (to avoid repeats)
 * @returns {{ id: number, url: string, theme: string }}
 */
export function pickImage(category, usedIds = []) {
  // Prefer images that match the category
  const matching = IMAGE_LIBRARY.filter(
    img => img.categories.includes(category) && !usedIds.includes(img.id)
  );

  // Fallback to any unused image
  const pool = matching.length > 0
    ? matching
    : IMAGE_LIBRARY.filter(img => !usedIds.includes(img.id));

  // If all used, just pick any
  const finalPool = pool.length > 0 ? pool : IMAGE_LIBRARY;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export default { IMAGE_LIBRARY, pickImage };
