const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteBasePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

export function siteAsset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${siteBasePath}${path}`;
}
