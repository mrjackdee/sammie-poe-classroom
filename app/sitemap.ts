import type { MetadataRoute } from "next";
import { absoluteUrl, routeSeo } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...Object.keys(routeSeo).map((route) => ({
      url: absoluteUrl(`/${route}`),
      lastModified: today,
      changeFrequency: route === "calendar" ? ("weekly" as const) : ("monthly" as const),
      priority: ["learn", "english", "math", "eld", "families"].includes(route)
        ? 0.8
        : 0.6,
    })),
  ];
}
