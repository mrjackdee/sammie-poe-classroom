import type { Metadata } from "next";
import ClassroomApp from "../ClassroomApp";
import { faqItems } from "../classroom-data";
import { absoluteUrl, routeSeo, siteName } from "../seo";

type RouteProps = {
  params: Promise<{ slug: string[] }> | { slug: string[] };
};

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const resolved = await params;
  const route = resolved.slug[0] || "";
  const seo = routeSeo[route];

  if (!seo) {
    return {
      title: "Page Not Found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/${route}`;
  const image = seo.image ? absoluteUrl(seo.image) : undefined;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${seo.title} | ${siteName}`,
      description: seo.description,
      type: "website",
      url: absoluteUrl(path),
      siteName,
      images: image
        ? [{ url: image, alt: seo.imageAlt || seo.title }]
        : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${seo.title} | ${siteName}`,
      description: seo.description,
      images: image ? [image] : [],
    },
  };
}

export default async function ClassroomRoute({ params }: RouteProps) {
  const resolved = await params;
  const path = `/${resolved.slug.join("/")}`;
  const isFaq = resolved.slug[0] === "faq";
  const faqStructuredData = isFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q.en,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a.en,
          },
        })),
      }
    : null;

  return (
    <>
      {faqStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      ) : null}
      <ClassroomApp initialPath={path} />
    </>
  );
}
