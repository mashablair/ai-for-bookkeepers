"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Answers, results } from "@/lib/assessment";
export function Results() {
  const [data, setData] = useState<{ answers: Answers; saved: boolean } | null>(
    null,
  );
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("assessment-result");
      if (raw) setData(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  if (!ready)
    return (
      <div className="wrap" role="status">
        Preparing your results…
      </div>
    );
  if (!data)
    return (
      <div className="wrap narrow">
        <h1>Your next step starts here.</h1>
        <p>
          Your results stay in the browser tab where you completed the
          assessment. Take the assessment to see a personalized learning guide.
        </p>
        <Link className="button" href="/assessment">
          Take the free assessment
        </Link>
      </div>
    );
  const r = results(data.answers);
  return (
    <>
      <section className="sand">
        <div className="wrap page-intro">
          <span className="eyebrow">Your personal learning guide</span>
          <h1>
            A clearer picture.
            <br />
            <i>A thoughtful next step.</i>
          </h1>
          <p className="lede">
            Your starting point: {data.answers.tools}. Your focus:{" "}
            {data.answers.priority.toLowerCase()}.
          </p>
          <p>
            This is a snapshot of your self-reported experience, not a
            certification or validated score.
          </p>
          {!data.saved && (
            <p className="status">
              Your results are available here, but have not been saved to
              Maria’s dashboard because storage is unavailable.
            </p>
          )}
        </div>
      </section>
      <section className="wrap split">
        <div>
          <span className="eyebrow">Build on what you know</span>
          <h2>Your strengths.</h2>
          <p>
            {r.strengths.length
              ? "These are the capabilities you reported using confidently."
              : "You have identified a useful starting point. You do not need existing AI experience to begin."}
          </p>
          {r.strengths.map((s) => (
            <div className="row" key={s.id}>
              <h3>{s.name}</h3>
              <p>Build on this skill as you explore a new workflow.</p>
            </div>
          ))}
        </div>
        <div>
          <span className="eyebrow">Where to focus</span>
          <h2>Your next priorities.</h2>
          {r.priorities.length ? (
            r.priorities.map((s, i) => (
              <div className="row" key={s.id}>
                <span className="eyebrow">
                  0{i + 1} · {s.level}
                </span>
                <h3>{s.name}</h3>
                <p>
                  {s.id === "privacy"
                    ? "Begin with approved tools, data settings, permissions and minimizing information before sharing."
                    : s.id === "verification"
                      ? "Practice checking numbers and sources independently, and define a human approval step."
                      : `Practice ${s.name.toLowerCase()} with a small fictional example connected to your chosen task.`}
                </p>
              </div>
            ))
          ) : (
            <p>
              You report a strong foundation. Try refining one workflow, testing
              edge cases and making your review steps repeatable.
            </p>
          )}
        </div>
      </section>
      <section className="sand">
        <div className="wrap narrow">
          <span className="eyebrow">Try a practical example</span>
          <h2>{data.answers.priority}</h2>
          <p className="lede">{r.example}</p>
          <p>Your desired outcome: {data.answers.outcome.toLowerCase()}.</p>
        </div>
      </section>
      <section className="wrap narrow">
        <span className="eyebrow">The complete picture</span>
        <h2>Your capability map.</h2>
        {r.skills.map((s) => (
          <div className="skill-row" key={s.id}>
            <strong>{s.name}</strong>
            <span>{s.level}</span>
          </div>
        ))}
        <p className="note">
          “Not applicable” covers unavailable capabilities and questions skipped
          because they depend on a setup you do not use. Labels reflect your
          answers, not an observed skills test.
        </p>
        <div className="actions">
          <button className="button outline" onClick={() => window.print()}>
            Print or save results
          </button>
          <button
            className="button outline"
            onClick={() => {
              sessionStorage.removeItem("assessment-result");
              sessionStorage.removeItem("assessment-draft");
              location.href = "/assessment";
            }}
          >
            Retake assessment
          </button>
        </div>
      </section>
      <section className="deep closing">
        <div className="wrap">
          <span className="eyebrow">Optional personal guidance</span>
          <h2>
            Turn your next step
            <br />
            <i>into a focused session.</i>
          </h2>
          <p>
            Private training is $100/hour. Maria reviews your starting point and
            helps you agree a useful focus.
          </p>
          <Link className="button" href="/contact">
            Request Personalized Training
          </Link>
        </div>
      </section>
    </>
  );
}
