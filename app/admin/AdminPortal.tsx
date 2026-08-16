"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";

export default function AdminPortal() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const body = await response.json();
        if (response.ok && body.authenticated) setAuthenticatedEmail(body.email);
      } finally {
        setChecking(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to sign in.");
      setPassword("");
      setAuthenticatedEmail(body.email);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticatedEmail(null);
    setPassword("");
  };

  if (authenticatedEmail) {
    return <AdminDashboard user={{ email: authenticatedEmail }} onLogout={logout} />;
  }

  return (
    <main className="admin-shell admin-gateway">
      <section className="admin-login-card">
        <img src="/art/language-jaguar.png" alt="Friendly Jaguar classroom mascot" />
        <span className="admin-kicker">SECURE CLASSROOM ADMIN</span>
        <h1>{checking ? "Checking your session…" : "Welcome, Mr. Poe"}</h1>
        {checking ? (
          <p>Please wait while the secure editor checks your sign-in.</p>
        ) : (
          <form className="admin-login-form" onSubmit={login}>
            <p>Use the classroom administrator email and password. A ChatGPT account is not required.</p>
            <label><span>Email address</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label><span>Password</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            {error && <div className="admin-login-error" role="alert">{error}</div>}
            <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in securely →"}</button>
          </form>
        )}
        <Link className="admin-secondary" href="/">Return to the classroom</Link>
      </section>
    </main>
  );
}
