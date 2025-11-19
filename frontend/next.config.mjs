/** @type {import('next').NextConfig} */
const isGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Static HTML export for GitHub Pages
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: isGhPages ? `${basePath}/` : undefined,
};

export default nextConfig;


