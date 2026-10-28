"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { referral } from "@/lib/assessment";
export function Shell() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
    const ref = new URLSearchParams(location.search).get("ref");
    try {
      if (ref && !sessionStorage.getItem("referral"))
        sessionStorage.setItem("referral", referral(ref));
    } catch {}
  }, []);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }
  return (
    <header>
      <div className="header-inner">
        <Link href="/" className="brand">
          AI for Bookkeepers<small>With Maria Blair</small>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/private-training">Private training</Link>
          <Link href="/workshops">Workshops</Link>
          <Link href="/about">About Maria</Link>
          <Link className="button" href="/assessment">
            Free assessment
          </Link>
        </nav>
        <button
          className="theme"
          onClick={toggle}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          Light / Dark
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          AI for Bookkeepers · Maria Blair
          <br />
          Practical skills. Thoughtfully taught.
        </div>
        <div className="footer-links">
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/admin" className="admin-login">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}
