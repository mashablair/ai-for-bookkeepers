import { Assessment } from "@/components/assessment";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Free AI Skills Assessment",
  "Find your AI strengths, potential gaps and practical next steps. Free adaptive assessment for bookkeepers, with no email required.",
  "/assessment",
);
export default function Page() {
  return <Assessment />;
}
