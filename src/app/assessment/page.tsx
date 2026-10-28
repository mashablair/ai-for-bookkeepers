import { Assessment } from "@/components/assessment";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Free AI Skills Assessment",
  "Answer a short set of questions about how you use AI. Leave your name and email, and we will send your free assessment.",
  "/assessment",
);
export default function Page() {
  return <Assessment />;
}
