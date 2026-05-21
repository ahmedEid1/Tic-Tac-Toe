import type { NextConfig } from "next";

// `NEXT_PUBLIC_BASE_PATH` is set in CI to `/Tic-Tac-Toe` so the static export
// works on GitHub Pages (which serves the site under the repo path). Locally
// and on root-domain hosts it defaults to empty so dev server works as-is.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // next/image's default loader needs a server; we don't use it, but the
  // option must be set for static export builds.
  images: { unoptimized: true },
  // Ensures the exported HTML works behind any static host (consistent
  // index.html under each route, no .html suffixes).
  trailingSlash: true,
};

export default nextConfig;
