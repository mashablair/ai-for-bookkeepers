import { Login } from "@/components/admin";
import { configured } from "@/lib/supabase";
export default function Page() {
  return (
    <div className="wrap narrow">
      <span className="eyebrow">Private consultant access</span>
      <h1>
        Welcome back,
        <br />
        <i>Maria.</i>
      </h1>
      {configured() ? (
        <Login />
      ) : (
        <p className="status">
          Administrator sign-in is not configured. Connect Supabase and add your
          account to the administrator allowlist using the setup guide. No
          public registration is available.
        </p>
      )}
    </div>
  );
}
