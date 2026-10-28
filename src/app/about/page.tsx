import Image from "next/image";
import { CTA } from "@/components/marketing";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "About Maria Blair",
  "Meet Maria Blair: 11+ years in software engineering, hands-on AI work and experience delivering personalized paid AI training.",
  "/about",
);
export default function Page() {
  return (
    <>
      <section className="wrap split">
        <Image
          className="about-img"
          src="/images/maria-laptop.jpg"
          alt="Maria Blair working at a laptop"
          width={800}
          height={1000}
          priority
        />
        <div>
          <span className="eyebrow">Maria Blair · Your guide</span>
          <h1>
            Thoughtful technology.
            <br />
            <i>Personal teaching.</i>
          </h1>
          <p className="lede">
            I bring 11+ years of software engineering experience, hands-on work
            with AI, and experience delivering paid, personalized AI training.
          </p>
          <p>
            AI for Bookkeepers brings that technical and teaching experience to
            independent bookkeepers and small practices. The aim is practical:
            connect useful AI skills to the work you actually do.
          </p>
          <p>
            Your existing knowledge matters. An assessment helps me prepare
            around your starting point, so we can focus on the skills you want
            to develop next.
          </p>
          <p>
            Client confidentiality, accuracy checks and human judgment are part
            of that work—not an afterthought.
          </p>
          <a href="https://mariablairai.com/">
            Visit Maria Blair AI Consulting →
          </a>
        </div>
      </section>
      <CTA />
    </>
  );
}
