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
    // Editorial guides. High priority: they answer the question the audience
    // actually searches, and unlike the data pages they are complete today.
    { url: url("/why-did-my-medigap-premium-increase"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/how-medigap-rates-work"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/what-is-a-closed-block"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/medigap-loss-ratios-explained"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/switching-medigap-plans"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/turning-65"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
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

  // Only licensed states get a turning-65 page: those pages carry an agent
  // call-to-action, and one for a state we cannot write in would imply we can
  // sell there. Mirrors generateStaticParams in app/turning-65/[state].
  const turning65Pages: MetadataRoute.Sitemap = STATES.filter((s) => s.licensed).map((s) => ({
    url: url(`/turning-65/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...planPages, ...statePages, ...statePlanPages, ...turning65Pages];
}
