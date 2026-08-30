import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { PLANS, ROUTED_PLANS } from "@/lib/plans";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${SITE.url}${p}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/medigap-rate-history"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/medigap-plans"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/methodology"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const planPages: MetadataRoute.Sitemap = PLANS.map((p) => ({
    url: url(`/medigap-plans/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const statePages: MetadataRoute.Sitemap = STATES.map((s) => ({
    url: url(`/medigap-rate-history/${s.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const statePlanPages: MetadataRoute.Sitemap = STATES.flatMap((s) =>
    ROUTED_PLANS.map((p) => ({
      url: url(`/medigap-rate-history/${s.slug}/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [...staticPages, ...planPages, ...statePages, ...statePlanPages];
}
