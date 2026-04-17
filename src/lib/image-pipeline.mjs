/**
 * image-pipeline.mjs
 *
 * Sharp WebP compression + Bunny CDN upload via FTP.
 * Used by cron jobs to process and upload hero/OG images.
 */

import sharp from "sharp";
import { createWriteStream, createReadStream, unlinkSync, existsSync } from "fs";
import { resolve, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Bunny CDN configuration
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || "chronic-mystery";
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || "";
const BUNNY_CDN_HOST = process.env.BUNNY_PULL_ZONE_URL
  ? process.env.BUNNY_PULL_ZONE_URL.replace(/^https?:\/\//, "")
  : "chronic-mystery.b-cdn.net";
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

/**
 * Compress an image to WebP format using sharp.
 * @param {string|Buffer} input - File path or Buffer
 * @param {object} opts - { width, height, quality }
 * @returns {Promise<Buffer>} WebP buffer
 */
export async function compressToWebP(input, opts = {}) {
  const width = opts.width || null;
  const height = opts.height || null;
  const quality = opts.quality || 82;

  let pipeline = sharp(input);

  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: "cover",
      withoutEnlargement: true,
    });
  }

  return pipeline.webp({ quality, effort: 4 }).toBuffer();
}

/**
 * Upload a buffer to Bunny CDN via their Storage API.
 * @param {Buffer} buffer - File content
 * @param {string} remotePath - Path on Bunny CDN (e.g., "images/hero-my-article.webp")
 * @returns {Promise<string>} CDN URL
 */
export async function uploadToBunny(buffer, remotePath) {
  if (!BUNNY_API_KEY) {
    throw new Error(
      "BUNNY_API_KEY not set. Set it in environment variables."
    );
  }

  const url = `${BUNNY_STORAGE_URL}/${remotePath}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_API_KEY,
      "Content-Type": "application/octet-stream",
      "Content-Length": buffer.length.toString(),
    },
    body: buffer,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Bunny upload failed (${response.status}): ${text}`
    );
  }

  return `https://${BUNNY_CDN_HOST}/${remotePath}`;
}

/**
 * Process a local image and upload to Bunny CDN as WebP.
 * @param {string} localPath - Path to the local image file
 * @param {string} remoteName - Desired filename on CDN (without extension)
 * @param {object} opts - { width, height, quality, folder }
 * @returns {Promise<string>} CDN URL of the uploaded WebP
 */
export async function processAndUpload(localPath, remoteName, opts = {}) {
  const folder = opts.folder || "images";
  const webpName = remoteName.replace(/\.[^.]+$/, "") + ".webp";
  const remotePath = `${folder}/${webpName}`;

  // Compress to WebP
  const webpBuffer = await compressToWebP(localPath, opts);

  // Upload to Bunny
  const cdnUrl = await uploadToBunny(webpBuffer, remotePath);

  return cdnUrl;
}

/**
 * Process a buffer (e.g., from an API response) and upload to Bunny CDN.
 * @param {Buffer} imageBuffer - Raw image data
 * @param {string} remoteName - Desired filename on CDN
 * @param {object} opts - { width, height, quality, folder }
 * @returns {Promise<string>} CDN URL
 */
export async function processBufferAndUpload(imageBuffer, remoteName, opts = {}) {
  const folder = opts.folder || "images";
  const webpName = remoteName.replace(/\.[^.]+$/, "") + ".webp";
  const remotePath = `${folder}/${webpName}`;

  // Compress to WebP
  const webpBuffer = await compressToWebP(imageBuffer, opts);

  // Upload to Bunny
  const cdnUrl = await uploadToBunny(webpBuffer, remotePath);

  return cdnUrl;
}

/**
 * Generate hero + OG image pair for an article.
 * @param {string} localImagePath - Source image path
 * @param {string} slug - Article slug for naming
 * @returns {Promise<{heroUrl: string, ogUrl: string}>}
 */
export async function generateImagePair(localImagePath, slug) {
  const heroUrl = await processAndUpload(localImagePath, `hero-${slug}`, {
    width: 1200,
    height: 630,
    quality: 82,
    folder: "images",
  });

  const ogUrl = await processAndUpload(localImagePath, `og-${slug}`, {
    width: 1200,
    height: 630,
    quality: 75,
    folder: "og",
  });

  return { heroUrl, ogUrl };
}

/**
 * Verify a Bunny CDN URL is accessible (HTTP 200).
 * @param {string} cdnUrl - Full CDN URL
 * @returns {Promise<boolean>}
 */
export async function verifyCdnUrl(cdnUrl) {
  try {
    const res = await fetch(cdnUrl, { method: "HEAD" });
    return res.status === 200;
  } catch {
    return false;
  }
}

export default {
  compressToWebP,
  uploadToBunny,
  processAndUpload,
  processBufferAndUpload,
  generateImagePair,
  verifyCdnUrl,
};
