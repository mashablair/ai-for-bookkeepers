import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    (process.env.SESSION_SECRET?.length ?? 0) >= 32,
  );
}
export function database() {
  if (!configured()) throw new Error("Storage is not configured.");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function authClient() {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
export async function requireAdmin() {
  if (!configured()) throw new Error("UNCONFIGURED");
  const client = await authClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const { data, error } = await client
    .from("administrators")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error || !data) throw new Error("UNAUTHORIZED");
  return { client, user };
}
