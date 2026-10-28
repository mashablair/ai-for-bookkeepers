import Image from "next/image";
import Link from "next/link";
import { CTA, FAQ } from "@/components/marketing";
import { meta, siteUrl } from "@/lib/metadata";
export const metadata = meta(
  "Practical AI training for bookkeepers",
  "Discover your AI strengths and next learning priorities with a free assessment. Personalized private training with Maria Blair, $100/hour.",
  "/",
);
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "AI for Bookkeepers",
            url: siteUrl,
            description:
              "Personalized AI training for independent bookkeepers and small bookkeeping practices.",
            founder: { "@type": "Person", name: "Maria Blair" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "AI training",
              itemListElement: [
                { "@type": "Service", name: "Private AI training" },
                { "@type": "Service", name: "Team AI workshops" },
              ],
            },
          }),
        }}
      />
      <section className="hero">
        <div className="hero-photo">
          <Image
            src="/images/maria-headshot.jpg"
            alt="Maria Blair in a naturally lit office"
            fill
            priority
            sizes="(max-width: 899px) 100vw, 50vw"
          />
        </div>
        <div className="hero-copy">
          <span className="eyebrow">
            AI training for your bookkeeping practice
          </span>
          <h1>
            Your expertise.
            <br />
            New possibilities.
            <br />
            <i>Your next step.</i>
          </h1>
          <p className="lede">
            Practical AI training built around what you already know—and the
            work you want help with next.
          </p>
          <div className="actions">
            <Link href="/assessment" className="button">
              Take the Free AI Skills Assessment
            </Link>
            <Link href="/contact" className="button outline">
              Request Personalized Training
            </Link>
          </div>
          <p className="note">
            Designed for 5–7 minutes · We’ll email your free assessment
          </p>
        </div>
      </section>
      <section className="sand">
        <p className="statement">
          You know your clients. You know your practice.
          <br />
          Let’s make AI a thoughtful part of <i>the way you work.</i>
        </p>
      </section>
      <section className="wrap split">
        <div>
          <span className="eyebrow">Practical, by design</span>
          <h2>
            Less abstract.
            <br />
            <i>More everyday.</i>
          </h2>
          <p className="muted">
            Explore useful applications for the work behind your bookkeeping
            practice, with your judgment at the center.
          </p>
        </div>
        <div>
          {[
            [
              "01 · Client communications",
              "Find the right words.",
              "Draft clear missing-document reminders, onboarding emails and meeting follow-ups. Review every detail before sending.",
            ],
            [
              "02 · Processes & organization",
              "Give repeat work a structure.",
              "Turn your process notes into reusable SOP drafts, checklists and document naming conventions.",
            ],
            [
              "03 · Spreadsheets & reporting",
              "Make room for understanding.",
              "Explore formulas, summarize fictional data and prepare plain-English explanations—with independent checks of every number.",
            ],
          ].map(([tag, title, body]) => (
            <article className="row" key={title}>
              <span className="eyebrow">{tag}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="deep feature">
        <div className="feature-copy">
          <span className="eyebrow">Prepared around you</span>
          <h2>
            Your training should
            <br />
            <i>meet you where you are.</i>
          </h2>
          <p>
            Already comfortable with Projects? We can explore your instructions,
            sources and review process. Brand new to AI? We can begin with a
            useful first task.
          </p>
          <p>
            Your assessment informs a focused agenda, reviewed by Maria before
            your session. You build on familiar skills and give attention to the
            gaps that matter to your work.
          </p>
          <Link className="button" href="/private-training">
            Explore private training · $100/hour
          </Link>
        </div>
        <Image
          src="/images/maria-client-meeting.jpg"
          alt="Maria discussing work at a table"
          width={1000}
          height={1100}
          sizes="(max-width:899px) 100vw,50vw"
        />
      </section>
      <section className="wrap">
        <span className="eyebrow">A clear way forward</span>
        <h2>
          A little reflection.
          <br />
          <i>A more relevant starting point.</i>
        </h2>
        <div className="steps">
          {[
            [
              "One",
              "Discover",
              "Answer questions that adapt to your tools and experience.",
            ],
            [
              "Two",
              "Share",
              "Leave your name and email so we know where to send it.",
            ],
            [
              "Three",
              "Receive",
              "We’ll send your free assessment from the answers you gave.",
            ],
            [
              "Four",
              "Apply",
              "Work with Maria on relevant skills and a practical workflow.",
            ],
          ].map(([n, t, b]) => (
            <article className="step" key={n}>
              <span className="number">{n}</span>
              <h3>{t}</h3>
              <p className="muted">{b}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="sand">
        <div className="wrap split">
          <Image
            className="about-img"
            src="/images/maria-laptop.jpg"
            alt="Maria Blair working on her laptop"
            width={800}
            height={1000}
          />
          <div>
            <span className="eyebrow">Meet your guide</span>
            <h2>
              Technical depth.
              <br />
              <i>A personal approach.</i>
            </h2>
            <p className="lede">
              I’m Maria Blair. I bring 11+ years of software engineering
              experience, hands-on work with AI, and experience delivering paid,
              personalized AI training.
            </p>
            <p>
              I help you connect useful AI skills to the tasks in front of you.
              We’ll work at your starting point, keep client confidentiality in
              view, and build in time to check the output.
            </p>
            <div className="facts">
              <div>
                <span className="eyebrow">Experience</span>
                <strong>11+ years</strong>
                <span className="note">Software engineering</span>
              </div>
              <div>
                <span className="eyebrow">Approach</span>
                <strong>Personal</strong>
                <span className="note">Assessment-informed</span>
              </div>
            </div>
            <div className="actions">
              <Link href="/about">More about Maria →</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap split">
        <div>
          <span className="eyebrow">Learn together</span>
          <h2>
            A shared starting point
            <br />
            <i>for your team.</i>
          </h2>
        </div>
        <div>
          <p className="lede">
            Bring practical AI learning into your small bookkeeping practice.
            Workshops can focus on shared workflows, consistent prompts,
            confidentiality and review habits.
          </p>
          <p>
            Scope and pricing are agreed individually around your team’s needs.
          </p>
          <Link href="/workshops" className="button outline">
            Explore team workshops
          </Link>
        </div>
      </section>
      <FAQ />
      <CTA />
    </>
  );
}
