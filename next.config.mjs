/**
 * GitHub Pages serves static files with no server, so production builds emit
 * a fully static export (`output: 'export'`) - there are no API routes or
 * server actions anywhere in this app, so nothing is lost.
 *
 * The `basePath`/`assetPrefix` below apply only when `GITHUB_PAGES=true`,
 * which the deploy workflow sets. A project Pages site is served from
 * https://<owner>.github.io/<repo>/, so every asset and route needs that
 * `/medtechbw` prefix - but only there. Local dev and `npm run build` without
 * that env var stay unprefixed.
 */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/medtechbw' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  /** Static export needs an index.html per folder rather than per file. */
  trailingSlash: true,
  /** next/image's optimizer needs a server; unused here, set for safety. */
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
