import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://universe-store-gyn.eduardo-classich123.chatgpt.site",
      lastModified: new Date("2026-09-29"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
