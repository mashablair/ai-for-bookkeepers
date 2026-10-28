import { Results } from "@/components/results";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Your assessment results",
  "Your personalized AI learning guide.",
  "/results",
  true,
);
export default function Page() {
  return <Results />;
}
