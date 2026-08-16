import type { Lang } from "./classroom-data";
import Link from "next/link";

const effectiveDate = "August 16, 2026";

function LegalLayout({
  lang,
  title,
  summary,
  children,
}: {
  lang: Lang;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{lang === "en" ? "Home" : "Inicio"}</Link><span>›</span><strong>{title}</strong>
      </nav>
      <section className="legal-hero">
        <span>TRUST • SAFETY • TRANSPARENCY</span>
        <h1>{title}</h1>
        <p>{summary}</p>
        <small>Effective date: {effectiveDate}</small>
      </section>
      {lang === "es" && (
        <aside className="legal-language-note">
          Esta política se proporciona actualmente en inglés. La versión en inglés es la versión oficial y aplicable.
        </aside>
      )}
      <article className="legal-document">{children}</article>
    </>
  );
}

export function PrivacyPolicy({ lang }: { lang: Lang }) {
  return (
    <LegalLayout
      lang={lang}
      title="Privacy Policy"
      summary="How this classroom website handles information while protecting students, families, Mr. Sammie Poe, and the site’s designer."
    >
      <section>
        <h2>1. Scope and site operators</h2>
        <p>
          This Privacy Policy applies to Mr. Poe’s 3rd Grade Class website (the “Site”), an informational classroom resource maintained for Mr. Sammie Poe and designed by DonOra Global. The Site is not the official website of Rogers Heights Elementary School, Prince George’s County Public Schools (“PGCPS”), or any government agency. Official school and district systems, ClassDojo, Canvas, ChatGPT, Vercel, and linked websites have their own privacy practices.
        </p>
      </section>
      <section>
        <h2>2. Children and student privacy</h2>
        <p>
          The public Site is designed for third-grade students and their families, but it does not ask public visitors to create accounts, submit forms, post comments, or provide names, contact information, student work, photographs, education records, or other personal information. Children under 13 should not submit personal information through this Site. Parents and guardians should use official school channels or ClassDojo when communication is needed.
        </p>
        <p>
          Mr. Poe should not publish personally identifiable student information, education records, student photographs, or student work unless disclosure is authorized by PGCPS policy and all consent or other legal requirements have been satisfied. If information about a child is inadvertently received or published, a parent or guardian may request review or removal through the contact process below.
        </p>
      </section>
      <section>
        <h2>3. Information processed</h2>
        <ul>
          <li><strong>Ordinary visit data.</strong> Hosting and security providers may automatically process an IP address, browser and device information, requested pages, timestamps, diagnostic data, and security-related cookies or identifiers.</li>
          <li><strong>Language preference.</strong> The Site stores the visitor’s English or Spanish selection in the visitor’s browser using local storage. It is not used for advertising.</li>
          <li><strong>Administrator data.</strong> The secure admin portal uses Sign in with ChatGPT. The authentication service may provide an authenticated user ID, email address, and display name. Access is restricted to an approved administrator. Published edits, editor identity, and update time are stored in the production database.</li>
          <li><strong>Profile image.</strong> A teacher profile image uploaded by the authorized administrator is stored in protected production object storage and displayed publicly only after publication.</li>
          <li><strong>External links.</strong> Selecting a link to Canvas, ClassDojo, PGCPS, or another resource sends the visitor to that provider, which may collect information under its own policies.</li>
        </ul>
      </section>
      <section>
        <h2>4. Purposes and legal basis</h2>
        <p>
          Information is processed only as reasonably necessary to deliver and secure the Site, remember a visitor’s language choice, authenticate the administrator, save classroom content, prevent misuse, diagnose technical problems, comply with law, and protect students, families, Mr. Poe, DonOra Global, and service providers. The Site does not sell personal data, use behavioral advertising, or knowingly profile children.
        </p>
      </section>
      <section>
        <h2>5. Service providers and disclosures</h2>
        <p>
          Limited information may be processed by vendors that supply hosting, authentication, security, database, storage, deployment, and source-control services, including OpenAI Sites, Cloudflare, Vercel, and GitHub. Information may also be disclosed when reasonably necessary to comply with law, protect safety or rights, investigate abuse, maintain Site security, or respond to lawful government requests. No student information should be entered into the admin portal.
        </p>
      </section>
      <section>
        <h2>6. Retention and security</h2>
        <p>
          Classroom content is retained until replaced or removed. Administrator identity and update records may be retained for security and accountability. Service-provider logs are retained under provider policies. Reasonable administrative and technical safeguards are used, including authenticated administration, an email allowlist, same-origin checks, file-type and size restrictions, and managed production storage. No Internet service can guarantee absolute security.
        </p>
      </section>
      <section>
        <h2>7. Privacy choices and Maryland rights</h2>
        <p>
          Visitors may change or clear the saved language preference through browser settings. To the extent an applicable law grants a right to know, access, correct, delete, or obtain a copy of personal data, or to appeal a denied request, the visitor or an authorized representative may submit a request through Mr. Poe’s official school communication channel or the Rogers Heights Elementary School main office. Identity and authority may be verified before action is taken. Because the public Site does not maintain visitor accounts, some requests may relate only to data controlled by a hosting provider.
        </p>
      </section>
      <section>
        <h2>8. Contact</h2>
        <p>
          Contact Mr. Sammie Poe through the approved classroom ClassDojo channel or contact Rogers Heights Elementary School at 301-985-1860. Do not send sensitive student, health, financial, authentication, or government-identification information through an unapproved channel.
        </p>
      </section>
      <section>
        <h2>9. Policy updates</h2>
        <p>
          This Policy may be revised to reflect Site, vendor, or legal changes. A new effective date will be posted here. Material changes affecting children’s information will be handled in accordance with applicable law and school policy before new collection or use begins.
        </p>
      </section>
      <section className="legal-sources">
        <h2>10. Legal framework</h2>
        <p>
          This Policy is informed by the <a href="https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gcl&section=14-4707" target="_blank" rel="noopener noreferrer">Maryland Online Data Privacy Act</a>, the <a href="https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions" target="_blank" rel="noopener noreferrer">FTC’s COPPA guidance</a>, and the U.S. Department of Education’s <a href="https://studentprivacy.ed.gov/" target="_blank" rel="noopener noreferrer">student privacy resources</a>. References do not imply that every statute applies to every Site activity.
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsOfService({ lang }: { lang: Lang }) {
  return (
    <LegalLayout
      lang={lang}
      title="Terms of Service"
      summary="Rules for using this free classroom resource and important limits concerning educational information and third-party services."
    >
      <section>
        <h2>1. Acceptance and adult supervision</h2>
        <p>
          By accessing or using the Site, an adult user agrees to these Terms. A child may use the Site only with the permission and supervision of a parent, guardian, teacher, or school. These Terms do not require a minor to waive any right that cannot lawfully be waived. If you do not agree, do not use the Site.
        </p>
      </section>
      <section>
        <h2>2. Informational classroom resource</h2>
        <p>
          The Site is a free supplemental resource for classroom information and learning support. It is not an official PGCPS or Rogers Heights Elementary School record or communication system, does not replace Canvas, ClassDojo, school notices, district policy, individualized educational services, or emergency instructions, and does not create an employment, agency, fiduciary, professional, or contractual relationship with PGCPS.
        </p>
        <p>
          Classroom information can change. When the Site conflicts with an official school or district communication, the official communication controls. Families should verify deadlines, assignments, schedules, policies, closures, and safety information through official channels.
        </p>
      </section>
      <section>
        <h2>3. Permitted and prohibited use</h2>
        <p>You may use the Site for lawful personal, family, and educational purposes. You may not:</p>
        <ul>
          <li>attempt to enter, bypass, probe, or interfere with the admin portal, authentication, database, storage, or security controls;</li>
          <li>submit malware, automated traffic, misleading information, or content that violates privacy, intellectual-property, safety, or other rights;</li>
          <li>scrape, republish, sell, or commercially exploit Site content or artwork without written permission;</li>
          <li>impersonate Mr. Poe, DonOra Global, a student, parent, school official, or service provider; or</li>
          <li>use the Site to identify, contact, profile, track, or harm a student or family.</li>
        </ul>
      </section>
      <section>
        <h2>4. Administrator responsibilities</h2>
        <p>
          The authorized administrator must protect the associated ChatGPT account, use only approved devices and networks, sign out when appropriate, publish accurate and lawful content, and promptly report suspected compromise. The administrator represents that uploaded text and images may lawfully be used and publicly displayed and must not upload student records, student personal information, confidential school information, or third-party material without authorization.
        </p>
      </section>
      <section>
        <h2>5. Intellectual property</h2>
        <p>
          Unless otherwise identified, the Site’s original classroom content is © 2026 Mr. Sammie Poe and the Site design and development are © 2026 DonOra Global. All rights are reserved. Third-party names, logos, platforms, and linked materials remain the property of their respective owners. Limited access to the Site does not transfer ownership or grant a license beyond viewing and ordinary educational use.
        </p>
      </section>
      <section>
        <h2>6. Privacy and children</h2>
        <p>
          The Privacy Policy is incorporated into these Terms. Public visitors should not submit personal information. Parents, guardians, and school personnel remain responsible for supervising children’s Internet use and deciding whether linked third-party services are appropriate. Nothing in these Terms shifts an operator’s legal obligations under COPPA to a school, teacher, parent, or child.
        </p>
      </section>
      <section>
        <h2>7. Third-party links and services</h2>
        <p>
          Links are provided for convenience and do not constitute endorsement, sponsorship, subscription, or a guarantee of availability, accessibility, accuracy, security, privacy, or suitability. Mr. Poe and DonOra Global do not control third-party services and are not responsible for their content, terms, data practices, accounts, charges, or interruptions. Use those services under their own terms and school or family instructions.
        </p>
      </section>
      <section>
        <h2>8. Disclaimer of warranties</h2>
        <p>
          To the maximum extent permitted by law, the Site is provided “as is” and “as available,” without express or implied warranties, including warranties of accuracy, completeness, availability, noninfringement, merchantability, fitness for a particular purpose, security, or educational outcome. Mr. Poe and DonOra Global do not promise uninterrupted or error-free operation.
        </p>
      </section>
      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Mr. Sammie Poe, DonOra Global, and their respective personnel and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages; lost data, opportunities, or profits; reliance on Site content; or harm arising from third-party services, unauthorized access, or interruptions. If liability cannot lawfully be excluded, aggregate liability arising from the free Site will not exceed $100. These limits do not exclude liability that applicable law prohibits limiting, including liability for proven willful misconduct or other nonwaivable obligations.
        </p>
      </section>
      <section>
        <h2>10. Indemnification by adult users</h2>
        <p>
          To the extent permitted by law, an adult user or authorized administrator agrees to defend, indemnify, and hold harmless Mr. Poe and DonOra Global from third-party claims, losses, and reasonable costs arising from that person’s unlawful use, security breach, uploaded content, infringement, privacy violation, or material violation of these Terms. This section does not apply to children and does not require indemnification for another party’s own gross negligence or willful misconduct.
        </p>
      </section>
      <section>
        <h2>11. Governing law and disputes</h2>
        <p>
          Maryland law governs these Terms, without regard to conflict-of-law principles. Before filing a non-emergency claim, an adult user should provide written notice through the contact process below and allow 30 days for a good-faith resolution attempt; this does not shorten any legal limitations period or prevent urgent injunctive relief. Subject to applicable jurisdiction rules, proceedings shall be brought in a court of competent jurisdiction in Prince George’s County, Maryland, or the United States District Court for the District of Maryland. Nonwaivable consumer and child protections remain in effect.
        </p>
      </section>
      <section>
        <h2>12. Suspension, changes, and general terms</h2>
        <p>
          Access may be restricted to protect the Site, users, or legal rights. These Terms may be updated prospectively by posting a new effective date. If a provision is unenforceable, it will be limited or severed to the minimum extent necessary, and the remaining provisions will continue. Failure to enforce a provision is not a waiver. These Terms and the Privacy Policy are the complete Site terms and do not modify official school or district obligations.
        </p>
      </section>
      <section>
        <h2>13. Contact</h2>
        <p>
          Questions or notices may be directed to Mr. Sammie Poe through the approved classroom ClassDojo channel or through Rogers Heights Elementary School at 301-985-1860. Questions for the designer may be submitted through <a href="https://www.donoraglobal.com" target="_blank" rel="noopener noreferrer">DonOra Global</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
