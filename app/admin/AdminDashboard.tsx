"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useState } from "react";
import {
  ClassroomContent,
  Localized,
  defaultClassroomContent,
  normalizeClassroomContent,
} from "../../shared/classroom-content";

type Status = "loading" | "ready" | "saving" | "saved" | "error" | "forbidden";

const clone = (content: ClassroomContent) => structuredClone(content);

function BilingualFields({
  label,
  value,
  onChange,
  multiline = true,
}: {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
}) {
  const baseId = useId();
  return (
    <fieldset className="admin-localized">
      <legend>{label}</legend>
      <label>
        <span>English</span>
        {multiline ? (
          <textarea id={`${baseId}-en`} value={value.en} onChange={(event) => onChange({ ...value, en: event.target.value })} />
        ) : (
          <input id={`${baseId}-en`} value={value.en} onChange={(event) => onChange({ ...value, en: event.target.value })} />
        )}
      </label>
      <label>
        <span>Español</span>
        {multiline ? (
          <textarea id={`${baseId}-es`} value={value.es} onChange={(event) => onChange({ ...value, es: event.target.value })} />
        ) : (
          <input id={`${baseId}-es`} value={value.es} onChange={(event) => onChange({ ...value, es: event.target.value })} />
        )}
      </label>
    </fieldset>
  );
}

export default function AdminDashboard({
  user,
  signOutPath,
}: {
  user: { displayName: string; email: string };
  signOutPath: string;
}) {
  const [draft, setDraft] = useState<ClassroomContent>(() => clone(defaultClassroomContent));
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Loading current production content…");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("Upload a JPG, PNG, or WebP image up to 5 MB.");

  const load = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const body = await response.json();
      if (response.status === 403) {
        setStatus("forbidden");
        setMessage(body.error || "This account is not authorized.");
        return;
      }
      if (!response.ok) throw new Error(body.error || "Unable to load classroom content.");
      setDraft(normalizeClassroomContent(body));
      setStatus("ready");
      setMessage("You’re editing the content currently shown in production.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load classroom content.");
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("Publishing your updates…");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await response.json();
      if (response.status === 403) {
        setStatus("forbidden");
        setMessage(body.error || "This account is not authorized.");
        return;
      }
      if (!response.ok) throw new Error(body.error || "The update could not be published.");
      setDraft(normalizeClassroomContent(body));
      setStatus("saved");
      setMessage("Published. The classroom site is now using these updates.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The update could not be published.");
    }
  };

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    if (file.size > 5_000_000) {
      setPhotoMessage("That image is larger than 5 MB. Please choose a smaller file.");
      return;
    }
    setPhotoUploading(true);
    setPhotoMessage("Uploading the profile photo…");
    try {
      const response = await fetch("/api/admin/profile-photo", {
        method: "POST",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The photo could not be uploaded.");
      setDraft((current) => ({ ...current, links: { ...current.links, teacherPhotoUrl: body.url } }));
      setPhotoMessage("Photo uploaded. Select Publish updates to show it on the About page.");
    } catch (error) {
      setPhotoMessage(error instanceof Error ? error.message : "The photo could not be uploaded.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const removePhoto = async () => {
    setPhotoUploading(true);
    try {
      await fetch("/api/admin/profile-photo", { method: "DELETE" });
      setDraft((current) => ({ ...current, links: { ...current.links, teacherPhotoUrl: "" } }));
      setPhotoMessage("Photo removed. Select Publish updates to update the About page.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const changeWeek = (index: number, change: Partial<ClassroomContent["weekItems"][number]>) =>
    setDraft((current) => ({
      ...current,
      weekItems: current.weekItems.map((item, itemIndex) => itemIndex === index ? { ...item, ...change } : item),
    }));

  const changeAnnouncement = (
    index: number,
    change: Partial<ClassroomContent["announcements"][number]>,
  ) => setDraft((current) => ({
    ...current,
    announcements: current.announcements.map((item, itemIndex) => itemIndex === index ? { ...item, ...change } : item),
  }));

  if (status === "forbidden") {
    return (
      <main className="admin-shell admin-gateway">
        <section className="admin-login-card">
          <span className="admin-kicker">ACCOUNT NOT AUTHORIZED</span>
          <h1>Please use Sammie’s approved account</h1>
          <p>{message}</p>
          <p className="admin-account">Currently signed in as {user.email}</p>
          <a className="admin-primary" href={signOutPath}>Sign out and switch account →</a>
          <Link className="admin-secondary" href="/">Return to the classroom</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link href="/" className="admin-brand"><span>J</span><strong>Mr. Poe’s Classroom Admin</strong></Link>
        <div><small>{user.email}</small><a href={signOutPath}>Sign out</a></div>
      </header>
      <form className="admin-workspace" onSubmit={save}>
        <section className="admin-welcome">
          <div>
            <span className="admin-kicker">LIVE CONTENT STUDIO</span>
            <h1>Update the classroom</h1>
            <p>Change any field below, then select <strong>Publish updates</strong>. English and Spanish stay paired together.</p>
          </div>
          <img src="/art/language-jaguar.png" alt="Jaguar mascot holding a book" />
        </section>

        <div className={`admin-status ${status}`} role="status" aria-live="polite">
          <span>{status === "saved" ? "✓" : status === "error" ? "!" : "●"}</span>
          <div><strong>{status === "saved" ? "Production updated" : status === "saving" ? "Publishing" : "Editor status"}</strong><p>{message}</p></div>
        </div>

        <section className="admin-section">
          <div className="admin-section-title"><span>01</span><div><h2>Quick links & profile photo</h2><p>Upload Mr. Poe’s approved photo or manage classroom links.</p></div></div>
          <div className="admin-field-grid">
            <label><span>Canvas course URL</span><input type="url" placeholder="https://…" value={draft.links.canvasUrl} onChange={(event) => setDraft({ ...draft, links: { ...draft.links, canvasUrl: event.target.value } })} /></label>
            <label><span>ClassDojo URL</span><input type="url" placeholder="https://…" value={draft.links.classDojoUrl} onChange={(event) => setDraft({ ...draft, links: { ...draft.links, classDojoUrl: event.target.value } })} /></label>
            <div className="admin-photo-upload admin-full">
              {draft.links.teacherPhotoUrl ? <img src={draft.links.teacherPhotoUrl} alt="Current Mr. Poe profile preview" /> : <span className="admin-photo-empty">No profile photo yet</span>}
              <div>
                <strong>Mr. Poe’s profile photo</strong>
                <p>{photoMessage}</p>
                <label className="admin-upload-button">
                  {photoUploading ? "Uploading…" : "Choose photo"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" disabled={photoUploading} onChange={(event) => void uploadPhoto(event.target.files?.[0])} />
                </label>
                {draft.links.teacherPhotoUrl && <button type="button" className="admin-remove" disabled={photoUploading} onClick={() => void removePhoto()}>Remove photo</button>}
              </div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title"><span>02</span><div><h2>This week</h2><p>Keep the classroom snapshot short and easy to scan.</p></div></div>
          <div className="admin-card-stack">
            {draft.weekItems.map((item, index) => (
              <article className="admin-edit-card" key={index}>
                <label className="admin-icon-field"><span>Icon</span><input value={item.icon} maxLength={4} onChange={(event) => changeWeek(index, { icon: event.target.value })} /></label>
                <BilingualFields label="Heading" multiline={false} value={item.title} onChange={(title) => changeWeek(index, { title })} />
                <BilingualFields label="Update" value={item.text} onChange={(text) => changeWeek(index, { text })} />
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title admin-title-actions"><span>03</span><div><h2>Manage Announcements</h2><p>Add, edit, prioritize, or remove the updates shown on Home and Calendar.</p></div><button type="button" onClick={() => setDraft((current) => ({ ...current, announcements: [...current.announcements, { priority: false, date: { en: "Today", es: "Hoy" }, category: { en: "Classroom", es: "Salón" }, title: { en: "New announcement", es: "Nuevo anuncio" }, body: { en: "", es: "" } }] }))}>+ Add announcement</button></div>
          <div className="admin-card-stack">
            {draft.announcements.map((item, index) => (
              <article className="admin-edit-card" key={index}>
                <div className="admin-row-actions"><label className="admin-check"><input type="checkbox" checked={item.priority} onChange={(event) => changeAnnouncement(index, { priority: event.target.checked })} /> Mark as important</label><button type="button" className="admin-remove" onClick={() => setDraft((current) => ({ ...current, announcements: current.announcements.filter((_, itemIndex) => itemIndex !== index) }))}>Remove</button></div>
                <BilingualFields label="Date label" multiline={false} value={item.date} onChange={(date) => changeAnnouncement(index, { date })} />
                <BilingualFields label="Category" multiline={false} value={item.category} onChange={(category) => changeAnnouncement(index, { category })} />
                <BilingualFields label="Headline" multiline={false} value={item.title} onChange={(title) => changeAnnouncement(index, { title })} />
                <BilingualFields label="Announcement" value={item.body} onChange={(body) => changeAnnouncement(index, { body })} />
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title"><span>04</span><div><h2>About Mr. Poe</h2><p>Only publish biographical details and a photo that Mr. Poe has approved.</p></div></div>
          <div className="admin-card-stack compact">
            <BilingualFields label="Profile heading" multiline={false} value={draft.teacher.profileHeading} onChange={(profileHeading) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, profileHeading } }))} />
            <BilingualFields label="Role or title" multiline={false} value={draft.teacher.role} onChange={(role) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, role } }))} />
            {([
              ["Teacher introduction", "introduction"],
              ["Teaching philosophy", "philosophy"],
              ["Why I love teaching", "whyTeaching"],
              ["Education & experience", "experience"],
              ["Classroom promise", "classPromise"],
            ] as const).map(([label, key]) => (
              <BilingualFields key={key} label={label} value={draft.teacher[key]} onChange={(value) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, [key]: value } }))} />
            ))}
          </div>
          <div className="admin-section-title admin-title-actions admin-inner-title"><span>+</span><div><h3>Personal information</h3><p>Add optional details Sammie wants families to know.</p></div><button type="button" onClick={() => setDraft((current) => ({ ...current, teacher: { ...current.teacher, personalDetails: [...current.teacher.personalDetails, { label: { en: "New detail", es: "Nuevo detalle" }, value: { en: "", es: "" } }] } }))}>+ Add personal detail</button></div>
          <div className="admin-favorites-grid">
            {draft.teacher.personalDetails.map((detail, index) => (
              <article className="admin-edit-card" key={index}>
                <div className="admin-row-actions"><strong>Personal detail {index + 1}</strong><button type="button" className="admin-remove" onClick={() => setDraft((current) => ({ ...current, teacher: { ...current.teacher, personalDetails: current.teacher.personalDetails.filter((_, itemIndex) => itemIndex !== index) } }))}>Remove</button></div>
                <BilingualFields label="Label" multiline={false} value={detail.label} onChange={(label) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, personalDetails: current.teacher.personalDetails.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item) } }))} />
                <BilingualFields label="Information" value={detail.value} onChange={(value) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, personalDetails: current.teacher.personalDetails.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item) } }))} />
              </article>
            ))}
          </div>
          <h3 className="admin-subheading">Favorite things</h3>
          <div className="admin-favorites-grid">
            {draft.teacher.favorites.map((favorite, index) => (
              <article className="admin-edit-card" key={index}>
                <BilingualFields label="Label" multiline={false} value={favorite.label} onChange={(label) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, favorites: current.teacher.favorites.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item) } }))} />
                <BilingualFields label="Answer" multiline={false} value={favorite.value} onChange={(value) => setDraft((current) => ({ ...current, teacher: { ...current.teacher, favorites: current.teacher.favorites.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item) } }))} />
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title admin-title-actions"><span>05</span><div><h2>Calendar</h2><p>Add confirmed classroom dates; leave empty to show the current no-events message.</p></div><button type="button" onClick={() => setDraft((current) => ({ ...current, calendarEvents: [...current.calendarEvents, { id: globalThis.crypto?.randomUUID?.() || `event-${Date.now()}`, date: "", category: { en: "Classroom event", es: "Evento del salón" }, title: { en: "New event", es: "Nuevo evento" }, details: { en: "", es: "" } }] }))}>+ Add event</button></div>
          <div className="admin-card-stack">
            {draft.calendarEvents.map((item, index) => (
              <article className="admin-edit-card" key={item.id}>
                <div className="admin-row-actions"><label><span>Date</span><input type="date" value={item.date} onChange={(event) => setDraft((current) => ({ ...current, calendarEvents: current.calendarEvents.map((entry, itemIndex) => itemIndex === index ? { ...entry, date: event.target.value } : entry) }))} /></label><button type="button" className="admin-remove" onClick={() => setDraft((current) => ({ ...current, calendarEvents: current.calendarEvents.filter((_, itemIndex) => itemIndex !== index) }))}>Remove</button></div>
                <BilingualFields label="Category" multiline={false} value={item.category} onChange={(category) => setDraft((current) => ({ ...current, calendarEvents: current.calendarEvents.map((entry, itemIndex) => itemIndex === index ? { ...entry, category } : entry) }))} />
                <BilingualFields label="Event title" multiline={false} value={item.title} onChange={(title) => setDraft((current) => ({ ...current, calendarEvents: current.calendarEvents.map((entry, itemIndex) => itemIndex === index ? { ...entry, title } : entry) }))} />
                <BilingualFields label="Details" value={item.details} onChange={(details) => setDraft((current) => ({ ...current, calendarEvents: current.calendarEvents.map((entry, itemIndex) => itemIndex === index ? { ...entry, details } : entry) }))} />
              </article>
            ))}
            {!draft.calendarEvents.length && <p className="admin-empty">No calendar events yet.</p>}
          </div>
        </section>

        <div className="admin-publish-bar">
          <div><strong>Ready to publish?</strong><span>Changes become public as soon as the save completes.</span></div>
          <button type="button" className="admin-secondary-button" onClick={() => void load()} disabled={status === "loading" || status === "saving"}>Reload production</button>
          <button type="submit" className="admin-primary" disabled={status === "loading" || status === "saving"}>{status === "saving" ? "Publishing…" : "Publish updates"}</button>
        </div>
      </form>
    </main>
  );
}
