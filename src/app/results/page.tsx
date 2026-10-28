import { Results } from "@/components/results";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Send me my free assessment",
  "Leave your name and email after the assessment, and we will send your free assessment.",
  "/results",
  true,
);
export default function Page() {
  return <Results />;
}
