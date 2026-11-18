export default function Page() {
  return (
    <div className="wrap narrow">
      <span className="eyebrow">Private consultant access</span>
      <h1>
        Welcome back,
        <br />
        <i>Maria.</i>
      </h1>
      <p>
        Sign in through Cloudflare Access using your authorized email address.
      </p>
      <a className="button" href="/admin">
        Open admin workspace
      </a>
    </div>
  );
}
