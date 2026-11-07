import path from "path";
import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

import { SECURITY_HEADERS } from "./lib/security-headers";

const appDir = import.meta.dirname;

// Prefer canada-legal-ai/.env. If the key is only in the repo-root .env, pick it up too.
loadEnvConfig(path.resolve(appDir, ".."));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: appDir,
    // The identity helper imports its dev viewer as .js. Turbopack does not
    // map that specifier onto identity.dev.ts, so point it there.
    resolveAlias: {
      "./identity.dev.js": "./cursor/identity.dev.ts",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: Object.entries(SECURITY_HEADERS).map(([key, value]) => ({ key, value })),
      },
    ];
  },
};

export default nextConfig;
