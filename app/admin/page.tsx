import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "../chatgpt-auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Classroom Admin",
  description: "Secure classroom content editor for Mr. Poe’s website.",
  robots: { index: false, follow: false },
};

const canonicalAdminUrl =
  "https://mr-poe-third-grade-jaguars.wizard1914.chatgpt.site/admin";

export default async function AdminPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  const isSitesHost = host.endsWith(".chatgpt.site") || host.endsWith(".chatgpt-team.site");

  if (!isSitesHost && !host.includes("localhost")) {
    return (
      <main className="admin-shell admin-gateway">
        <section className="admin-login-card">
          <img src="/art/language-jaguar.png" alt="Friendly Jaguar classroom mascot" />
          <span className="admin-kicker">CLASSROOM ADMIN</span>
          <h1>Open the secure editing portal</h1>
          <p>
            Editing is hosted on the classroom’s secure Sites address. Saved updates automatically appear here on Vercel too.
          </p>
          <a className="admin-primary" href={canonicalAdminUrl}>Continue to admin login →</a>
          <Link className="admin-secondary" href="/">Return to the classroom</Link>
        </section>
      </main>
    );
  }

  const user = await getChatGPTUser();
  if (!user) {
    return (
      <main className="admin-shell admin-gateway">
        <section className="admin-login-card">
          <img src="/art/language-jaguar.png" alt="Friendly Jaguar classroom mascot" />
          <span className="admin-kicker">SECURE CLASSROOM ADMIN</span>
          <h1>Welcome, Mr. Poe</h1>
          <p>
            Sign in with the ChatGPT account for <strong>sammieapoe@gmail.com</strong> to edit and publish classroom updates.
          </p>
          <a className="admin-primary" href={chatGPTSignInPath("/admin")}>Sign in with ChatGPT →</a>
          <Link className="admin-secondary" href="/">Return to the classroom</Link>
        </section>
      </main>
    );
  }

  return (
    <AdminDashboard
      user={{ displayName: user.displayName, email: user.email }}
      signOutPath={chatGPTSignOutPath("/admin")}
    />
  );
}
