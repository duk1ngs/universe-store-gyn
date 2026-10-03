import type { NextConfig } from "next";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  basePath,
  images: { unoptimized: true },
  ...(staticExport ? { output: "export" as const, trailingSlash: true } : {}),
};

export default nextConfig;
