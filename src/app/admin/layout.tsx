import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Consultant dashboard",
  "Private consultant workspace.",
  "/admin",
  true,
);
export const dynamic = "force-dynamic";
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
