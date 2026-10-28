import { redirect } from "next/navigation";
import { configured, requireAdmin } from "@/lib/supabase";
import { LeadEditor, Logout } from "@/components/admin";
import { Answers, results } from "@/lib/assessment";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; page?: string }>;
}) {
  if (!configured()) redirect("/admin/login");
  let auth;
  try {
    auth = await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
  const { ref, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const start = (pageNum - 1) * 20;
  let query = auth.client
    .from("leads")
    .select("*,assessments(answers,summary),agendas(content,reviewed)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(start, start + 19);
  if (ref) query = query.eq("referral", ref.slice(0, 40));
  const { data: leads, error, count } = await query;
  let aq = auth.client
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, start + 19);
  if (ref) aq = aq.eq("referral", ref.slice(0, 40));
  const { data: assessments, error: assessmentError } = await aq;
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
      {(error || assessmentError) && (
        <p role="alert" className="error">
          Could not load records. Check database setup and permissions.
        </p>
      )}
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
              initialAgenda={
                (Array.isArray(lead.agendas)
                  ? lead.agendas[0]?.content
                  : lead.agendas?.content) || ""
              }
              initialReviewed={
                (Array.isArray(lead.agendas)
                  ? lead.agendas[0]?.reviewed
                  : lead.agendas?.reviewed) || false
              }
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
