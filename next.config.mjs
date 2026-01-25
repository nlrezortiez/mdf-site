/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      // Directus assets proxy
      { pathname: "/api/assets/**" },
      // Mega menu icons from /public/menu/
      { pathname: "/menu/**" }
    ]
  }
};

export default nextConfig;
