import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The guide is gated behind a form. Its file lives at an unguessable
        // path and is never linked publicly, but a crawler that ever finds the
        // URL would index it and hand every reader a way past the form. Static
        // hosting cannot enforce the gate, so this is the enforcement there is.
        disallow: ["/guides/", "/guide-sent"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
