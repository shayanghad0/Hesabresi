import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sql.js"],
  allowedDevOrigins: ["172.21.160.1"],
  turbopack: {
    root: "C:\\Users\\Shayan\\Desktop\\Hesabresi",
  },
};

export default nextConfig;
