import Link from "next/link";
import { CTA, FAQ } from "@/components/marketing";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Private AI training for bookkeepers",
  "Personalized one-to-one AI training with Maria Blair. Build on your skills, focus on bookkeeping workflows and learn responsible AI habits. $100/hour.",
  "/private-training",
);
export default function Page() {
  return (
    <>
      <section className="sand">
        <div className="wrap page-intro">
          <span className="eyebrow">One-to-one · $100 per hour</span>
          <h1>
            Your work.
            <br />
            Your starting point.
            <br />
            <i>Your training.</i>
          </h1>
          <p className="lede">
            A focused session with Maria, prepared around your current AI skills
            and the practical tasks you want to improve.
          </p>
          <div className="actions">
            <Link href="/assessment" className="button">
              Take the free AI skills assessment
            </Link>
            <Link href="/contact" className="button outline">
              Request personalized training
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap split">
        <div>
          <span className="eyebrow">Relevant from the start</span>
          <h2>
            Make room for
            <br />
            <i>what you need next.</i>
          </h2>
          <p>
            Your assessment helps Maria prepare a draft agenda. She reviews it
            before your session, and you confirm the priorities together.
          </p>
        </div>
        <div>
          {[
            [
              "If you are new to AI",
              "Start with a suitable task, a clear prompt and a way to check the result. Use fictional examples while learning safe information handling.",
            ],
            [
              "If you already use AI",
              "Look at your existing instructions, Projects, sources and repeatable workflows. Focus on where a more deliberate setup would help.",
            ],
            [
              "Practice with a purpose",
              "Work through a relevant example such as a client email, SOP draft or spreadsheet explanation. Build in review and leave with a next step to practice.",
            ],
          ].map(([t, b]) => (
            <article className="row" key={t}>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>
      <FAQ />
      <CTA />
    </>
  );
}
