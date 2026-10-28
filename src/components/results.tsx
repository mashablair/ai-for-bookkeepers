"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export function Results() {
  const [ready, setReady] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [started, setStarted] = useState(0);
  const [requestId, setRequestId] = useState("");
  useEffect(() => {
    setStarted(Date.now());
    setRequestId(crypto.randomUUID());
    try {
      setHasAssessment(Boolean(sessionStorage.getItem("assessment-result")));
    } catch {}
    setReady(true);
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const address = String(form.get("email") || "");
    let source = "organic";
    try {
      source = sessionStorage.getItem("referral") || "organic";
    } catch {}
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "assessment",
          name: form.get("name"),
          email: address,
          consent: form.get("consent") === "on",
          website: form.get("website") || "",
          started,
          requestId,
          referral: source,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEmail(address);
      setSuccess(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!ready)
    return (
      <div className="wrap" role="status">
        Preparing your assessment…
      </div>
    );
  if (!hasAssessment)
    return (
      <div className="wrap narrow">
        <h1>Your free assessment starts here.</h1>
        <p>
          Answer a short set of questions first. Then leave your name and email,
          and we will send your free assessment.
        </p>
        <Link className="button" href="/assessment">
          Take the free assessment
        </Link>
      </div>
    );
  if (success)
    return (
      <section className="sand">
        <div className="wrap narrow">
          <span className="eyebrow">Your free assessment</span>
          <h1>
            Maria will
            <br />
            <i>review it personally.</i>
          </h1>
          <p className="lede" role="status">
            Thank you. Maria will personally review your results and email your
            assessment to {email}.
          </p>
          <p>
            Your information is safe and will never be used for spam. No
            training has been booked, and no payment is due.
          </p>
          <Link href="/">Return home</Link>
        </div>
      </section>
    );
  return (
    <section className="sand">
      <div className="wrap narrow">
        <span className="eyebrow">Your free assessment</span>
        <h1>
          Maria will
          <br />
          <i>review it personally.</i>
        </h1>
        <p className="lede">
          Leave your name and email. Maria will personally review your results
          and email your assessment to you. Your information is safe and will
          never be used for spam.
        </p>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="field">
              Name
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
            <label className="field">
              Email
              <input
                name="email"
                autoComplete="email"
                type="email"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label className="hidden-trap" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="option">
            <input type="checkbox" name="consent" required />
            <span>
              Please send my free assessment to this email. I have read the{" "}
              <Link href="/privacy">privacy policy</Link>.
            </span>
          </label>
          {message && (
            <p className="error" role="alert">
              {message}
            </p>
          )}
          <div className="actions">
            <button className="button" disabled={busy || !requestId}>
              {busy ? "Sending your request…" : "Send me my free assessment"}
            </button>
          </div>
          <p className="note">
            Please do not include client records or confidential details in your
            name or email.
          </p>
        </form>
      </div>
    </section>
  );
}
