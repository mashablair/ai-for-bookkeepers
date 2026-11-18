"use client";
import { useState } from "react";
export function LeadEditor({
  id,
  initialStatus,
  initialAgenda,
  initialReviewed,
}: {
  id: string;
  initialStatus: string;
  initialAgenda: string;
  initialReviewed: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [agenda, setAgenda] = useState(initialAgenda);
  const [reviewed, setReviewed] = useState(initialReviewed);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function action(kind: "status" | "save") {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch(
        kind === "status" ? "/api/admin/lead" : "/api/admin/agenda",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            status,
            content: agenda,
            reviewed,
          }),
        },
      );
      const d = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(d.error);
      setMessage("Changes saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <label className="field">
        Lead status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {["New", "Contacted", "Scheduled", "Completed", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <button
        className="button outline"
        disabled={busy}
        onClick={() => action("status")}
      >
        Save status
      </button>
      <h3>Notes for the assessment you’ll send</h3>
      <p className="note">
        Write what you plan to send. Nothing here is generated or emailed
        automatically.
      </p>
      <label className="field">
        Your notes
        <textarea
          value={agenda}
          rows={12}
          onChange={(e) => {
            setAgenda(e.target.value);
            setReviewed(false);
          }}
          maxLength={15000}
        />
      </label>
      <label className="option">
        <input
          type="checkbox"
          checked={reviewed}
          onChange={(e) => setReviewed(e.target.checked)}
        />
        I have reviewed these notes.
      </label>
      <div className="actions">
        <button
          className="button outline"
          disabled={busy || !agenda.trim()}
          onClick={() => action("save")}
        >
          Save notes
        </button>
      </div>
      {message && (
        <p role="status" className="status">
          {message}
        </p>
      )}
    </div>
  );
}
export function Logout() {
  return (
    <button
      className="button outline"
      onClick={async () => {
        location.href = "/cdn-cgi/access/logout";
      }}
    >
      Sign out
    </button>
  );
}
