import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://universe-store-gyn.wintry-goose-2397.chatgpt.site",
      lastModified: new Date("2026-09-29"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
