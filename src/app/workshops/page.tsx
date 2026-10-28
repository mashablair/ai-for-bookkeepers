import Image from "next/image";
import Link from "next/link";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "AI workshops for bookkeeping teams",
  "Practical AI workshops for small bookkeeping practices. Build shared prompting, workflow, confidentiality and verification habits. Custom scope and pricing.",
  "/workshops",
);
export default function Page() {
  return (
    <>
      <section className="hero">
        <div className="hero-photo">
          <Image
            src="/images/maria-client-meeting.jpg"
            alt="Maria in a collaborative working session"
            fill
            priority
            sizes="(max-width:899px) 100vw,50vw"
          />
        </div>
        <div className="hero-copy">
          <span className="eyebrow">For small bookkeeping practices</span>
          <h1>
            Learn together.
            <br />
            <i>Work with intention.</i>
          </h1>
          <p className="lede">
            Bring your team’s AI skills into a shared conversation, with
            practical examples and clear review habits.
          </p>
          <p>Workshop scope and pricing are agreed individually.</p>
          <Link href="/contact?format=workshop" className="button">
            Request a workshop
          </Link>
        </div>
      </section>
      <section className="wrap split">
        <div>
          <span className="eyebrow">A shared approach</span>
          <h2>
            Built around
            <br />
            <i>your practice.</i>
          </h2>
        </div>
        <div>
          {[
            [
              "Understand the starting points",
              "Team members can take the free assessment individually. Maria uses the relevant learning needs to shape the session.",
            ],
            [
              "Choose a useful focus",
              "Explore client communications, SOPs, document organization or another agreed workflow. We confirm goals and scope before booking.",
            ],
            [
              "Make review part of the process",
              "Practice with fictional or approved examples. Agree how your team will check outputs and handle information responsibly.",
            ],
          ].map(([t, b]) => (
            <article className="row" key={t}>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
