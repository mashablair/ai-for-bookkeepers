"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export function ContactForm() {
  const [format, setFormat] = useState("Private training");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [started, setStarted] = useState(0);
  const [requestId, setRequestId] = useState("");
  useEffect(() => {
    setStarted(Date.now());
    setRequestId(crypto.randomUUID());
    if (new URLSearchParams(location.search).get("format") === "workshop")
      setFormat("Team workshop");
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    let source = "organic";
    try {
      source = sessionStorage.getItem("referral") || "organic";
    } catch {}
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          consent: form.get("consent") === "on",
          started,
          requestId,
          referral: source,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Unable to send. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="status" role="status">
        <h2>Thank you. Your request is received.</h2>
        <p>
          Maria will use your details to respond and discuss a suitable scope.
          No session or payment has been booked.
        </p>
        <Link href="/">Return home</Link>
      </div>
    );
  return (
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
      <div className="form-grid">
        <label className="field">
          Your practice
          <select name="practice" required>
            <option>Independent bookkeeper</option>
            <option>Small bookkeeping practice</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field">
          Training format
          <select
            name="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option>Private training</option>
            <option>Team workshop</option>
            <option>Not sure yet</option>
          </select>
        </label>
      </div>
      <label className="field">
        What would you like help with?
        <textarea
          name="priorities"
          required
          minLength={5}
          maxLength={1500}
          aria-describedby="privacy-note"
        />
      </label>
      <p className="note" id="privacy-note">
        Please describe the task, not the client. Do not include financial
        records, credentials or confidential client details.
      </p>
      <label className="hidden-trap" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="option">
        <input type="checkbox" name="consent" required />
        <span>
          Maria may use these details and my linked assessment, if available, to
          respond and prepare training. I have read the{" "}
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
          {busy
            ? "Sending your request…"
            : format === "Team workshop"
              ? "Request a workshop"
              : "Request personalized training"}
        </button>
      </div>
      <p className="note">
        Private training: $100/hour. Workshops: custom scope and pricing. No
        payment is taken here.
      </p>
    </form>
  );
}
