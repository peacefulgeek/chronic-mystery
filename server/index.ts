import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Known SPA routes — the server returns 200 for these, 404 for everything else
const KNOWN_ROUTES = [
  "/",
  "/about",
  "/articles",
  "/start-here",
  "/energy-audit",
  "/privacy",
  "/terms",
  "/the-mystery",
  "/the-medical",
  "/the-management",
  "/the-identity",
  "/the-deeper-rest",
];

function isKnownRoute(url: string): boolean {
  const pathname = url.split("?")[0].replace(/\/$/, "") || "/";
  // Exact match for static routes
  if (KNOWN_ROUTES.includes(pathname)) return true;
  // Article routes: /:category/:slug
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2) {
    const validCategories = ["the-mystery", "the-medical", "the-management", "the-identity", "the-deeper-rest"];
    if (validCategories.includes(parts[0])) return true;
  }
  return false;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // AI opt-out headers on all responses
  app.use((_req, res, next) => {
    res.setHeader("X-Robots-Tag", "noai, noimageai");
    next();
  });

  // Static files with caching
  app.use(
    express.static(staticPath, {
      maxAge: "1d",
      etag: true,
    })
  );

  // SPA fallback: known routes get 200, unknown routes get 404
  app.get("*", (req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (isKnownRoute(req.path)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).sendFile(indexPath);
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
