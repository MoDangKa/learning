import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "cdn.jsdelivr.net",
      "cloudflare-ipfs.com",
      "nb6uld796oapyje7.public.blob.vercel-storage.com",
    ],
  },
};

export default nextConfig;
