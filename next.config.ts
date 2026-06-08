import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Notion user avatars
      { protocol: "https", hostname: "*.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      { protocol: "https", hostname: "secure.notion-static.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },  // Google avatars via Notion
      { protocol: "https", hostname: "s3-us-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
