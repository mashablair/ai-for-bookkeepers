import test from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
test("migration, real PostgreSQL RLS, persistence, attribution and transactional conversions", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
    );
    await db.exec(readFileSync("supabase/migrations/001_initial.sql", "utf8"));
    const admin = "11111111-1111-4111-8111-111111111111",
      other = "22222222-2222-4222-8222-222222222222";
    await db.query("insert into auth.users values ($1),($2)", [admin, other]);
    await db.query("insert into public.administrators values ($1)", [admin]);
    const a = await db.query<{ id: string }>(
      `insert into public.assessments(request_id,answers,summary,referral) values(gen_random_uuid(),'{}','{}','anna') returning id`,
    );
    const lead = await db.query<{ id: string }>(
      `insert into public.leads(request_id,name,email,practice,format,priorities,consent_at,referral,assessment_id) values(gen_random_uuid(),'Fixture','fixture@example.invalid','Independent bookkeeper','Team workshop','Fictional testing',now(),'anna',$1) returning id`,
      [a.rows[0].id],
    );
    assert.equal(
      (await db.query("select * from public.events")).rows.length,
      2,
    );
    assert.equal(
      (
        await db.query<{ event: string }>(
          "select event from public.events where event='workshop_request'",
        )
      ).rows.length,
      1,
    );
    await db.exec("set role anon");
    await assert.rejects(
      () => db.query("select * from public.leads"),
      /permission denied/,
    );
    await assert.rejects(
      () => db.query("select * from public.assessments"),
      /permission denied/,
    );
    await db.exec("reset role;set role authenticated");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      other,
    ]);
    assert.equal((await db.query("select * from public.leads")).rows.length, 0);
    assert.equal(
      (await db.query("select * from public.assessments")).rows.length,
      0,
    );
    await assert.rejects(
      () => db.query("insert into public.administrators values(auth.uid())"),
      /permission denied/,
    );
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      admin,
    ]);
    assert.equal((await db.query("select * from public.leads")).rows.length, 1);
    await db.query("update public.leads set status='Contacted' where id=$1", [
      lead.rows[0].id,
    ]);
    await db.query(
      "insert into public.agendas(lead_id,content) values($1,'DRAFT test agenda')",
      [lead.rows[0].id],
    );
    assert.equal(
      (await db.query("select * from public.agendas")).rows.length,
      1,
    );
    await db.exec("reset role");
    assert.equal(
      (await db.query("select * from public.events")).rows.length,
      2,
    );
    const limit = await db.query<{ allowed: boolean }>(
      "select public.take_rate_limit('test',1) as allowed",
    );
    assert(limit.rows[0].allowed);
    assert.equal(
      (
        await db.query<{ allowed: boolean }>(
          "select public.take_rate_limit('test',1) as allowed",
        )
      ).rows[0].allowed,
      false,
    );
  } finally {
    await db.close();
  }
});
