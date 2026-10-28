import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const sql = readFileSync("supabase/migrations/001_initial.sql", "utf8");
test("every data table enables RLS", () => {
  for (const table of [
    "administrators",
    "assessments",
    "leads",
    "agendas",
    "events",
    "rate_limits",
  ])
    assert(
      sql.includes(`alter table public.${table} enable row level security`),
    );
});
test("public clients have no table grants or write policies", () => {
  assert(sql.includes("from anon;"));
  assert(!/create policy[^;]*to anon/.test(sql));
  assert(
    sql.includes(
      "revoke all on function public.take_rate_limit(text,int) from public,anon,authenticated",
    ),
  );
});
test("conversions are triggered by committed inserts, not clicks", () => {
  assert(sql.includes("after insert on public.assessments"));
  assert(sql.includes("after insert on public.leads"));
  assert(sql.includes("request_id uuid unique not null"));
});
