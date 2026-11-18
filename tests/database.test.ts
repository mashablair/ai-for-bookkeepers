import test from "node:test";
import assert from "node:assert/strict";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFileSync } from "node:fs";
test("D1 saves linked requests, deduplicates conversions, enforces constraints, and persists admin edits", async () => {
  const mf = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      script: 'export default {fetch(){return new Response("ok")}}',
      compatibilityDate: "2026-10-28",
      d1Databases: ["DB"],
    }),
  );
  try {
    const db = await mf.getD1Database("DB");
    const sql = readFileSync("migrations/0001_initial.sql", "utf8");
    // Each migration statement is on its own line, including complete triggers.
    for (const line of sql.trim().split("\n")) await db.prepare(line).run();
    await db
      .prepare(
        "INSERT INTO assessments(id,request_id,answers,summary,referral) VALUES('a','r','{}','{}','test')",
      )
      .run();
    const insert =
      "INSERT INTO leads(id,request_id,name,email,practice,format,priorities,consent_at,referral,assessment_id) VALUES('l','q','Test','test@example.invalid','Demo','Free assessment','Testing','2026-11-18','test','a') ON CONFLICT(request_id) DO NOTHING";
    await db.prepare(insert).run();
    await db.prepare(insert).run();
    assert.equal(
      await db.prepare("SELECT count(*) FROM leads").first("count(*)"),
      1,
    );
    assert.equal(
      await db.prepare("SELECT count(*) FROM events").first("count(*)"),
      2,
    );
    await assert.rejects(db.prepare("UPDATE leads SET status='Invalid'").run());
    await db.prepare("UPDATE leads SET status='Contacted' WHERE id='l'").run();
    await db
      .prepare(
        "INSERT INTO agendas(lead_id,content,reviewed,updated_at) VALUES('l','Reviewed test note',1,'2026-11-18')",
      )
      .run();
    const row = await db
      .prepare(
        "SELECT status,content,reviewed FROM leads JOIN agendas ON leads.id=agendas.lead_id",
      )
      .first();
    assert.deepEqual(row, {
      status: "Contacted",
      content: "Reviewed test note",
      reviewed: 1,
    });
    await assert.rejects(
      db.prepare("INSERT INTO agendas VALUES('missing','no',0,'today')").run(),
    );
    const limit =
      "INSERT INTO rate_limits(key,count,created_at) VALUES('k',1,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count";
    assert.equal(await db.prepare(limit).first("count"), 1);
    assert.equal(await db.prepare(limit).first("count"), 2);
  } finally {
    await mf.dispose();
  }
});
