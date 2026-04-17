import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Known SPA routes: server returns 200 for these, 404 for everything else
const KNOWN_ROUTES = [
  "/",
  "/about",
  "/articles",
  "/start-here",
  "/energy-audit",
  "/privacy",
  "/terms",
  "/tools",
  "/quizzes",
  "/assessments",
  "/the-mystery",
  "/the-medical",
  "/the-management",
  "/the-identity",
  "/the-deeper-rest",
];

function isKnownRoute(url: string): boolean {
  const pathname = url.split("?")[0].replace(/\/$/, "") || "/";
  if (KNOWN_ROUTES.includes(pathname)) return true;
  // Article routes: /:category/:slug
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2) {
    const validCategories = [
      "the-mystery",
      "the-medical",
      "the-management",
      "the-identity",
      "the-deeper-rest",
    ];
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

  // Health check endpoint (Render uses this)
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

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

  const port = parseInt(process.env.PORT || "10000", 10);

  server.listen(port, "0.0.0.0", () => {
    console.log(
      `Server running on http://0.0.0.0:${port}/ (NODE_ENV=${process.env.NODE_ENV || "development"})`
    );
  });
}

startServer().catch(console.error);
