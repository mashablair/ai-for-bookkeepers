"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="wrap narrow">
      <h1>Something didn’t load.</h1>
      <p>
        Please try again. Your browser’s saved assessment answers are kept in
        this tab.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
