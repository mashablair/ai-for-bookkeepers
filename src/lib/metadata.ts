import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function meta(
  title: string,
  description: string,
  path: string,
  privatePage = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "AI for Bookkeepers",
      type: "website",
      images: [
        { url: "/images/maria-client-meeting.jpg", alt: "Maria Blair at work" },
      ],
    },
    robots:
      privatePage || process.env.PUBLIC_INDEXING !== "true"
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}
