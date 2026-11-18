import { redirect } from "next/navigation";
import { configured, database } from "@/lib/database";
import { requireAdmin } from "@/lib/access";
import { LeadEditor, Logout } from "@/components/admin";
import { Answers, results } from "@/lib/assessment";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; page?: string }>;
}) {
  if (!configured()) redirect("/admin/login");

  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
  const { ref, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const start = (pageNum - 1) * 20;
  const db = database();
  const source = ref?.slice(0, 40) || null;
  type AssessmentRow = {
    id: string;
    created_at: string;
    referral: string;
    answers: string;
  };
  type LeadRow = {
    id: string;
    created_at: string;
    name: string;
    email: string;
    practice: string;
    format: string;
    priorities: string;
    referral: string;
    status: string;
    answers: string | null;
    content: string | null;
    reviewed: number | null;
  };
  const leadRows = await db
    .prepare(
      "SELECT l.*,a.answers,g.content,g.reviewed FROM leads l LEFT JOIN assessments a ON a.id=l.assessment_id LEFT JOIN agendas g ON g.lead_id=l.id WHERE (? IS NULL OR l.referral=?) ORDER BY l.created_at DESC LIMIT 20 OFFSET ?",
    )
    .bind(source, source, start)
    .all<LeadRow>();
  const leads = leadRows.results.map((l) => ({
    ...l,
    assessments: l.answers
      ? { answers: JSON.parse(l.answers) as Answers }
      : null,
    agendas: { content: l.content, reviewed: l.reviewed === 1 },
  }));
  const assessmentRows = await db
    .prepare(
      "SELECT * FROM assessments WHERE (? IS NULL OR referral=?) ORDER BY created_at DESC LIMIT 20 OFFSET ?",
    )
    .bind(source, source, start)
    .all<AssessmentRow>();
  const assessments = assessmentRows.results.map((a) => ({
    ...a,
    answers: JSON.parse(a.answers) as Answers,
  }));
  const total = await db
    .prepare(
      "SELECT count(*) AS count FROM leads WHERE (? IS NULL OR referral=?)",
    )
    .bind(source, source)
    .first<{ count: number }>();
  const count = total?.count || 0;
  return (
    <div className="wrap">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div>
          <span className="eyebrow">Consultant workspace</span>
          <h1>Your next conversations.</h1>
        </div>
        <Logout />
      </div>
      <form className="admin-filter">
        <label className="field">
          Filter referral source
          <input
            name="ref"
            defaultValue={ref || ""}
            placeholder="All sources"
            maxLength={40}
          />
        </label>
        <div className="admin-filter-controls">
          <button className="button">Apply filter</button>
          <a href="/admin">Clear</a>
        </div>
      </form>
      <h2>Requests</h2>
      {!leads?.length && <p>No requests for this view.</p>}
      <div className="admin-grid">
        {leads?.map((lead) => (
          <article key={lead.id}>
            <span className="eyebrow">
              {lead.referral} · {lead.status}
            </span>
            <h3>{lead.name}</h3>
            <p>
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
              <br />
              {lead.practice} · {lead.format}
              <br />
              {new Date(lead.created_at).toLocaleDateString("en-US", {
                timeZone: "America/New_York",
              })}
            </p>
            <p>{lead.priorities}</p>
            {lead.assessments && (
              <details>
                <summary>Assessment summary</summary>
                <p>
                  {lead.assessments.answers.tools} ·{" "}
                  {lead.assessments.answers.priority} ·{" "}
                  {lead.assessments.answers.outcome}
                </p>
                {results(lead.assessments.answers as Answers).skills.map(
                  (s) => (
                    <div className="skill-row" key={s.id}>
                      {s.name}
                      <span>{s.level}</span>
                    </div>
                  ),
                )}
              </details>
            )}
            <LeadEditor
              id={lead.id}
              initialStatus={lead.status}
              initialAgenda={lead.agendas.content || ""}
              initialReviewed={lead.agendas.reviewed || false}
            />
          </article>
        ))}
      </div>
      <h2 style={{ marginTop: 80 }}>Completed assessments</h2>
      <p className="note">
        Assessments appear here with the answers used to prepare what you send.
        A name and email appear on the request when the visitor asked to receive
        it.
      </p>
      {assessments?.map((a) => (
        <details key={a.id}>
          <summary>
            {a.answers.tools} · {a.answers.priority}
          </summary>
          <p>
            {a.referral} ·{" "}
            {new Date(a.created_at).toLocaleDateString("en-US", {
              timeZone: "America/New_York",
            })}
            <br />
            Desired outcome: {a.answers.outcome}
          </p>
          {results(a.answers).skills.map((s) => (
            <div className="skill-row" key={s.id}>
              {s.name}
              <span>{s.level}</span>
            </div>
          ))}
        </details>
      ))}
      <div className="actions">
        {pageNum > 1 && (
          <a href={`?page=${pageNum - 1}&ref=${encodeURIComponent(ref || "")}`}>
            Previous page
          </a>
        )}
        {((count || 0) > start + 20 || assessments?.length === 20) && (
          <a href={`?page=${pageNum + 1}&ref=${encodeURIComponent(ref || "")}`}>
            Next page
          </a>
        )}
      </div>
    </div>
  );
}
