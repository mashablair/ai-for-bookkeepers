import { siteUrl } from "@/lib/metadata";
export default function sitemap() {
  return [
    "",
    "/assessment",
    "/private-training",
    "/workshops",
    "/about",
    "/contact",
    "/privacy",
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
