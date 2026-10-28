import Link from "next/link";
export function CTA() {
  return (
    <section className="deep closing">
      <div className="wrap">
        <span className="eyebrow">Your next chapter</span>
        <h2>
          Start with what you know.
          <br />
          <i>See what comes next.</i>
        </h2>
        <p>
          Your free assessment is a useful first step. Personalized training is
          there when you want a little guidance.
        </p>
        <div className="actions">
          <Link className="button" href="/assessment">
            Take the Free AI Skills Assessment
          </Link>
          <Link className="button" href="/contact">
            Request Personalized Training
          </Link>
        </div>
        <p className="note">
          No account. No payment. We’ll email your free assessment.
        </p>
      </div>
    </section>
  );
}
export const faqs = [
  [
    "Is this for someone who has never used AI?",
    "Yes. The assessment adapts to your experience, including if you have not tried ChatGPT or Claude. Training can begin with choosing a useful first task and learning how to check the output.",
  ],
  [
    "What if I already use ChatGPT or Claude?",
    "Your answers help identify what you already know. If you use Projects, we look at your instructions, sources and workflows so training can focus on the next useful skill.",
  ],
  [
    "How do I receive my free assessment?",
    "Finish the questions, then leave your name and email. We’ll send your free assessment to that address. Training is optional, and nothing is booked from the form.",
  ],
  [
    "Will I need to share client records?",
    "No. Please do not enter client financial records, account credentials or identifying client details. We can explore practical workflows using fictional or appropriately anonymized examples.",
  ],
  [
    "How much does personalized training cost?",
    "Private training is $100 per hour. Team workshops have individually agreed scope and pricing. Maria confirms the scope and arrangements before you book; there is no online payment at this stage.",
  ],
  [
    "Does this assessment certify my AI skills?",
    "No. It is a practical self-assessment to guide learning, not an accredited qualification or a scientifically validated score.",
  ],
];
export function FAQ() {
  return (
    <section className="wrap split">
      <div>
        <span className="eyebrow">A few questions</span>
        <h2>
          Before you
          <br />
          <i>begin.</i>
        </h2>
      </div>
      <div>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
