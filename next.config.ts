import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep Prisma out of the server bundle so the native query engine
  // (real filesystem SQLite access) is used at runtime instead of WASM.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
