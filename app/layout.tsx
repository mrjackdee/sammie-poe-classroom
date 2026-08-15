import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { siteDescription, siteName, siteUrl } from "./seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    applicationName: siteName,
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: [
      "Mr. Sammie Poe",
      "Mr. Poe third grade",
      "third grade classroom",
      "Rogers Heights Elementary School",
      "Rogers Heights Jaguars",
      "third grade reading",
      "third grade math",
      "English language development",
      "bilingual family resources",
      "PGCPS",
    ],
    authors: [{ name: "Mr. Sammie Poe" }],
    creator: "Mr. Sammie Poe",
    publisher: "Mr. Poe's 3rd Grade Class",
    category: "education",
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/",
        "es-US": "/",
      },
    },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      type: "website",
      siteName,
      url: origin,
      locale: "en_US",
      alternateLocale: ["es_US"],
      images: [
        {
          url: `${origin}/og.png`,
          width: 1200,
          height: 630,
          alt: "Mr. Poe’s 3rd Grade Jaguars — Learn, Grow, Roar",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [`${origin}/og.png`],
    },
    other: {
      "content-language": "en, es",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173b8f",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: ["en-US", "es-US"],
      audience: {
        "@type": "EducationalAudience",
        educationalRole: ["student", "caregiver"],
      },
      publisher: { "@id": `${siteUrl}/#teacher` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#teacher`,
      name: "Mr. Sammie Poe",
      jobTitle: "Third Grade Teacher",
      worksFor: { "@id": `${siteUrl}/#school` },
    },
    {
      "@type": "School",
      "@id": `${siteUrl}/#school`,
      name: "Rogers Heights Elementary School",
      url: "https://www.pgcps.org/schools/rogers-heights-elementary",
      address: {
        "@type": "PostalAddress",
        streetAddress: "4301 58th Avenue",
        addressLocality: "Bladensburg",
        addressRegion: "MD",
        postalCode: "20710",
        addressCountry: "US",
      },
      telephone: "+1-301-985-1860",
    },
    {
      "@type": "LearningResource",
      "@id": `${siteUrl}/#classroom-resource`,
      name: siteName,
      description: siteDescription,
      url: siteUrl,
      educationalLevel: "Grade 3",
      learningResourceType: "Classroom website",
      inLanguage: ["en-US", "es-US"],
      teaches: [
        "English language arts",
        "Mathematics",
        "English language development",
      ],
      isAccessibleForFree: true,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
