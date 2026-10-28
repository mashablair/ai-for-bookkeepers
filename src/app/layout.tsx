import type { Metadata } from "next";
import "./globals.css";
import { Shell, Footer } from "@/components/shell";
import { siteUrl } from "@/lib/metadata";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI for Bookkeepers | Maria Blair",
    template: "%s | AI for Bookkeepers",
  },
  description:
    "Personalized AI training for independent bookkeepers and small practices.",
};
const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{}`;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Shell />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
