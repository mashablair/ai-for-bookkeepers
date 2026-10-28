"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Answers,
  visibleQuestions,
  cleanAnswers,
  referral,
} from "@/lib/assessment";
export function Assessment() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const requestId = useRef("");
  const heading = useRef<HTMLLegendElement>(null);
  const router = useRouter();
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("assessment-draft");
      if (saved) setAnswers(JSON.parse(saved));
      requestId.current =
        sessionStorage.getItem("assessment-request") || crypto.randomUUID();
      sessionStorage.setItem("assessment-request", requestId.current);
    } catch {
      requestId.current = crypto.randomUUID();
    }
    setReady(true);
  }, []);
  const qs = visibleQuestions(answers);
  const q = qs[Math.min(step, qs.length - 1)];
  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, ready]);
  function choose(value: string) {
    const next = cleanAnswers({ ...answers, [q.id]: value });
    setAnswers(next);
    try {
      sessionStorage.setItem("assessment-draft", JSON.stringify(next));
    } catch {}
    if (step === 0) {
      let source = "organic";
      try {
        source =
          sessionStorage.getItem("referral") ||
          referral(new URLSearchParams(location.search).get("ref"));
      } catch {}
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: requestId.current,
          event: "assessment_start",
          referral: source,
        }),
      }).catch(() => {});
    }
  }
  async function next() {
    if (!answers[q.id]) {
      setError("Choose an answer to continue.");
      return;
    }
    setError("");
    if (step < qs.length - 1) {
      setStep(step + 1);
      return;
    }
    setBusy(true);
    try {
      let source = "organic";
      try {
        source = sessionStorage.getItem("referral") || "organic";
      } catch {}
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: cleanAnswers(answers),
          requestId: requestId.current,
          referral: source,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      sessionStorage.setItem(
        "assessment-result",
        JSON.stringify({ answers: cleanAnswers(answers), saved: data.saved }),
      );
      sessionStorage.removeItem("assessment-draft");
      sessionStorage.removeItem("assessment-request");
      router.push("/results");
    } catch {
      try {
        sessionStorage.setItem(
          "assessment-result",
          JSON.stringify({ answers: cleanAnswers(answers), saved: false }),
        );
        router.push("/results");
      } catch {
        setError(
          "Browser storage is unavailable. Please enable site storage to view and retain your results.",
        );
        setBusy(false);
      }
    }
  }
  return (
    <div className="wrap assessment-layout">
      <aside className="assessment-sidebar">
        <span className="eyebrow">Your AI starting point</span>
        <h2>
          A little clarity.
          <br />
          <i>A useful next step.</i>
        </h2>
        <p className="muted">
          No right place to start. No score to chase. Just an honest picture of
          what you know.
        </p>
        <p className="note">
          Designed for 5–7 minutes. Questions adapt as you answer.
        </p>
        <a href="/privacy">How your answers are used</a>
      </aside>
      <div>
        <span className="eyebrow">
          Question {step + 1} of {qs.length} · Your path adapts
        </span>
        <div
          className="progress"
          role="progressbar"
          aria-label="Assessment progress"
          aria-valuenow={step + 1}
          aria-valuemin={0}
          aria-valuemax={qs.length}
        >
          <span style={{ width: `${((step + 1) / qs.length) * 100}%` }} />
        </div>
        <fieldset disabled={busy}>
          <legend ref={heading} tabIndex={-1}>
            {q.title}
          </legend>
          <p className="muted">{q.help}</p>
          {q.options.map((option) => (
            <label className="option" key={option}>
              <input
                type="radio"
                name={q.id}
                checked={answers[q.id] === option}
                onChange={() => choose(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="actions">
          {step > 0 && (
            <button
              className="button outline"
              disabled={busy}
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
            >
              Back
            </button>
          )}
          <button className="button" disabled={busy || !ready} onClick={next}>
            {busy
              ? "Saving your assessment…"
              : step === qs.length - 1
                ? "Get my free assessment"
                : "Continue →"}
          </button>
        </div>
        <p className="note">
          Please never enter client records, credentials or confidential
          financial information. At the end, leave your name and email and we
          will send your free assessment.
        </p>
      </div>
    </div>
  );
}
