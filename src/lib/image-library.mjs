/**
 * image-library.mjs
 *
 * 40 pre-generated hero images for article assignment.
 * Each image has a theme tag and category affinity for smart matching.
 * The cron picks a random image from the matching category pool.
 */

export const IMAGE_LIBRARY = [
  { id: 1, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-01-oA6488u5F2kurhVwrp6Fah.webp", theme: "rest-bed-morning", categories: ["the-deeper-rest", "the-management"] },
  { id: 2, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-02-kibBLJWRy8NiMtdZEKxJC6.webp", theme: "warm-mug-comfort", categories: ["the-management", "the-deeper-rest"] },
  { id: 3, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-03-UaQrMurBDBbKSEFQ4YkPr3.webp", theme: "wellness-flatlay", categories: ["the-management", "the-medical"] },
  { id: 4, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-04-Zv2sUH7SPpXtWwMHJSTwvE.webp", theme: "forest-path-mist", categories: ["the-mystery", "the-identity", "the-deeper-rest"] },
  { id: 5, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-05-HBtFBA95vosJC2cVBN9zuU.webp", theme: "nervous-system-art", categories: ["the-medical", "the-mystery"] },
  { id: 6, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-06-4axGU8fw8PytdKFuC5hcFg.webp", theme: "yoga-mat-rest", categories: ["the-management", "the-deeper-rest"] },
  { id: 7, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-07-4RBJxHUJiSyUbNK945fzXj.webp", theme: "books-shelf-cozy", categories: ["the-mystery", "the-medical"] },
  { id: 8, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-08-U8WDCKyuy2GAEGxQdG4xqf.webp", theme: "ocean-golden-hour", categories: ["the-deeper-rest", "the-identity"] },
  { id: 9, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-09-GrK87XXUfGt74ikhBemHWP.webp", theme: "reading-chair-lamp", categories: ["the-deeper-rest", "the-identity"] },
  { id: 10, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-10-EDqTBzGYxKKfkFhriaQQjx.webp", theme: "dew-drops-web", categories: ["the-mystery", "the-medical"] },
  { id: 11, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-11-4msEHcbrGZ77y5JxRhnQYi.webp", theme: "candle-dark-hope", categories: ["the-identity", "the-deeper-rest"] },
  { id: 12, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-12-5oLRRGGk5cuq6afFnsEUie.webp", theme: "autumn-road-journey", categories: ["the-identity", "the-mystery"] },
  { id: 13, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-13-eeiyDuXptEJyeGSCF4pheY.webp", theme: "herbs-apothecary", categories: ["the-management", "the-medical"] },
  { id: 14, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-14-CMNJWE5i8GVoHD8mnqrqYV.webp", theme: "lake-dawn-dock", categories: ["the-deeper-rest", "the-identity"] },
  { id: 15, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-15-heA3SdUfiVymKC5uLhACBx.webp", theme: "sprout-cracked-earth", categories: ["the-identity", "the-mystery"] },
  { id: 16, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-16-VGGVjsb6Qa3NjCA6CiAqVH.webp", theme: "rainy-window-reading", categories: ["the-deeper-rest", "the-identity"] },
  { id: 17, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-17-cmqzwTtXjSREKspsUHaHcL.webp", theme: "anti-inflammatory-food", categories: ["the-management", "the-medical"] },
  { id: 18, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-18-9ZMPXJJxwGGPdVi2WJFztx.webp", theme: "neural-network-art", categories: ["the-medical", "the-mystery"] },
  { id: 19, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-19-5L8hAVV5Urr7hLjopNcfaE.webp", theme: "stone-stairs-flowers", categories: ["the-identity", "the-management"] },
  { id: 20, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-20-9QLAraZ9ggwDnqpuQwhmoQ.webp", theme: "hourglass-patience", categories: ["the-management", "the-deeper-rest"] },
  { id: 21, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-21-KPf8LKcj6qdANP3J9yUyoA.webp", theme: "self-care-shelf", categories: ["the-management", "the-deeper-rest"] },
  { id: 22, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-22-UJ77RGbU5ALdAz73yrasij.webp", theme: "mountain-sunrise-mist", categories: ["the-identity", "the-mystery"] },
  { id: 23, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-23-eSvyjwgFtxjd9Bb9bYAKsq.webp", theme: "cozy-socks-rest", categories: ["the-deeper-rest", "the-management"] },
  { id: 24, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-24-DSLmGsiRWQJzDDPVfKGHk6.webp", theme: "greenhouse-nurture", categories: ["the-management", "the-identity"] },
  { id: 25, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-25-bfFJwAffo8vV86MfuarTaj.webp", theme: "heart-roots-art", categories: ["the-identity", "the-deeper-rest"] },
  { id: 26, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-26-ntgUer2zVkKeRr5C9FS28k.webp", theme: "smoothie-kitchen", categories: ["the-management", "the-medical"] },
  { id: 27, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-27-XHtETatzFL4CmcJ99AVH7Q.webp", theme: "hammock-garden", categories: ["the-deeper-rest", "the-management"] },
  { id: 28, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-28-aTRitneh2PCg5ZtK6WH8X6.webp", theme: "journal-writing", categories: ["the-identity", "the-deeper-rest"] },
  { id: 29, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-29-AKtWpQ8w6u576YukSQsBxR.webp", theme: "dna-helix-art", categories: ["the-medical", "the-mystery"] },
  { id: 30, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-30-CnEKegXHJJsTSPqH86fXz2.webp", theme: "sleep-environment", categories: ["the-deeper-rest", "the-management"] },
  { id: 31, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-31-LeHDj7BdXZsAHmbVVi2tko.webp", theme: "lab-test-tubes", categories: ["the-medical", "the-mystery"] },
  { id: 32, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-32-aBostoYU4ipn46zKvxq6Xw.webp", theme: "meditation-cushion", categories: ["the-deeper-rest", "the-identity"] },
  { id: 33, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-33-Z2fzftQSvVUiAYEa6PnnCH.webp", theme: "compass-map-direction", categories: ["the-mystery", "the-identity"] },
  { id: 34, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-34-4Pq4ecDMFQWARSj3xAFxfL.webp", theme: "zen-garden-calm", categories: ["the-deeper-rest", "the-identity"] },
  { id: 35, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-35-G7wX9w5XmAEiEZn2ibGdZ4.webp", theme: "hands-holding-support", categories: ["the-identity", "the-deeper-rest"] },
  { id: 36, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-36-UtxH3GrapdRf4qnYScD4aM.webp", theme: "breakfast-bed-nourish", categories: ["the-management", "the-deeper-rest"] },
  { id: 37, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-37-Q3TP6RCRQ8bHhrJpoHK687.webp", theme: "ice-crystals-beauty", categories: ["the-mystery", "the-medical"] },
  { id: 38, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-38-YXLojpMEJR3gZrcFhEUNkm.webp", theme: "library-research", categories: ["the-mystery", "the-medical"] },
  { id: 39, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-39-MbxkDWrdYF7aR6kkBQkKBR.webp", theme: "sunset-river-heron", categories: ["the-deeper-rest", "the-identity"] },
  { id: 40, url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/aKbrYCLE5jFUdzhYXokoe5/library-40-gNspUtZKcnHMEDkjwAbcbc.webp", theme: "aloe-vera-windowsill", categories: ["the-management", "the-medical"] },
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
