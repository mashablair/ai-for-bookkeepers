import { ContactForm } from "@/components/contact";
import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Request personalized AI training",
  "Tell Maria about your practice and learning priorities. Private AI training is $100/hour; workshops are scoped individually.",
  "/contact",
);
export default function Page() {
  return (
    <section className="wrap split">
      <div>
        <span className="eyebrow">Let’s find your focus</span>
        <h1>
          A conversation.
          <br />
          <i>A clear next step.</i>
        </h1>
        <p className="lede">
          Tell me a little about your practice and what you’d like to learn.
          We’ll discuss the scope and arrangements before booking.
        </p>
        <p>
          Taking the assessment first is helpful, but it is always optional.
        </p>
        <a href="/assessment">Take the free AI skills assessment →</a>
      </div>
      <ContactForm />
    </section>
  );
}
