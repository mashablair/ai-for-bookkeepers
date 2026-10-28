import { siteUrl } from "@/lib/metadata";
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      ...(process.env.PUBLIC_INDEXING === "true"
        ? { allow: "/", disallow: ["/admin", "/api/", "/results"] }
        : { disallow: "/" }),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
