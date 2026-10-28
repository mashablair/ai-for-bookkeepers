import { meta } from "@/lib/metadata";
export const metadata = meta(
  "Privacy policy",
  "How AI for Bookkeepers handles assessment responses, consultation requests, referrals and essential browser storage.",
  "/privacy",
);
export default function Page() {
  return (
    <article className="wrap narrow">
      <span className="eyebrow">Your information</span>
      <h1>Privacy, in plain English.</h1>
      <p className="note">
        Draft for owner review before public launch · October 28, 2026
      </p>
      <h2>What this service collects</h2>
      <p>
        The assessment collects your selected AI tools, self-reported skills,
        chosen work priorities and desired outcomes. It does not ask for your
        name or email. A consultation request collects your name, email,
        practice type, preferred training format and the priorities you choose
        to share.
      </p>
      <h2>How information is used</h2>
      <p>
        Assessment responses produce your learning guide. When database storage
        is configured, responses are saved so Maria can review them. If you
        subsequently request training from the same browser, an essential,
        signed cookie links your assessment to your request for up to 24 hours.
      </p>
      <p>
        Contact information is used to respond and prepare training. Please do
        not provide client records, financial details, credentials or other
        confidential information.
      </p>
      <h2>Storage and service providers</h2>
      <p>
        The configured service uses Supabase for database storage and
        administrator authentication, and Cloudflare for hosting when deployed.
        Maria can request an OpenAI-generated draft agenda. Only structured
        assessment choices are sent for that draft; your name, email and
        free-text inquiry are excluded. Drafts require Maria’s review.
      </p>
      <h2>Browser storage and measurement</h2>
      <p>
        Your theme preference is remembered locally. Assessment drafts, results
        and the first referral source are stored for the browser tab’s session.
        A referral label, such as “anna,” is saved with relevant records. No
        advertising pixels or cross-site tracking are included.
      </p>
      <p>
        Basic events record assessment starts, completed assessments and
        successfully saved consultation or workshop requests. They include
        referral labels, not contact details. Temporary hashed request
        identifiers help limit spam and are removed after their rate-limit
        window.
      </p>
      <h2>Your choices</h2>
      <p>
        You can view results without providing contact information. Training
        requests are optional. Clear your browser’s site data to remove local
        preferences and assessment data. To request access, correction or
        deletion of server-held information, use the{" "}
        <a href="/contact">contact form</a> and describe your request without
        including sensitive documents.
      </p>
      <h2>Before public launch</h2>
      <p>
        The service owner must confirm the privacy contact, retention periods,
        processor arrangements and any applicable regional disclosures. This
        review environment is not accepting production client data until
        configuration and launch review are complete.
      </p>
    </article>
  );
}
