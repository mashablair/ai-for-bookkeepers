import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap narrow">
      <span className="eyebrow">Page not found</span>
      <h1>Let’s find your way back.</h1>
      <Link className="button" href="/">
        Return home
      </Link>
    </div>
  );
}
