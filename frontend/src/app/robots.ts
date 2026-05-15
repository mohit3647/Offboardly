import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/sign-in/", "/sign-up/"],
    },
    sitemap: "https://offboardlyai.com/sitemap.xml",
  };
}
