export const siteName = "Mr. Poe's 3rd Grade Class";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://mr-poe-third-grade-jaguars.wizard1914.chatgpt.site";

export const siteDescription =
  "A bilingual classroom home for Mr. Sammie Poe's third-grade students and families at Rogers Heights Elementary School, with learning guides, family resources, announcements, and student support.";

export type RouteSeo = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export const routeSeo: Record<string, RouteSeo> = {
  learn: {
    title: "Learning Hub",
    description:
      "Explore Mr. Poe's third-grade learning hub for English language arts, math, English language development, assignments, and practice resources.",
    image: "/og.png",
    imageAlt: "Mr. Poe's 3rd Grade Class — Learn, Grow, Roar",
  },
  english: {
    title: "English Language Arts",
    description:
      "Third-grade reading and writing support for main idea, key details, vocabulary, fluency, comprehension, and written expression.",
    image: "/art/reading-world.png",
    imageAlt: "Jaguar student exploring a colorful third-grade reading world",
  },
  math: {
    title: "Third-Grade Math",
    description:
      "Third-grade math support for multiplication, division, fractions, place value, measurement, geometry, data, and problem solving.",
    image: "/art/math-world.png",
    imageAlt: "Jaguar student exploring a colorful third-grade math world",
  },
  eld: {
    title: "English Language Development",
    description:
      "Bilingual English language development support with vocabulary, visuals, sentence frames, home-language encouragement, and family learning ideas.",
    image: "/art/language-jaguar.png",
    imageAlt: "Friendly Jaguar student practicing English language skills",
  },
  resources: {
    title: "Student Learning Resources",
    description:
      "Trusted third-grade learning resources for reading, math, research, Canvas, Clever, Sora, and Prince George's County student tools.",
  },
  families: {
    title: "Family Corner",
    description:
      "Bilingual classroom information and practical ideas that help families support third-grade learning, communication, routines, and student growth at home.",
    image: "/art/family-jaguar.png",
    imageAlt: "Jaguar family learning together at home",
  },
  canvas: {
    title: "Canvas Help",
    description:
      "Simple directions for Mr. Poe's third-grade students and families to access Canvas, find classroom assignments, and review learning materials.",
  },
  about: {
    title: "About Mr. Poe's Class",
    description:
      "Meet Mr. Sammie Poe's third-grade classroom community at Rogers Heights Elementary School, home of the Jaguars.",
  },
  calendar: {
    title: "Class Calendar",
    description:
      "Find classroom dates, reminders, learning milestones, and upcoming events for Mr. Poe's third-grade class.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Answers for families about contacting Mr. Poe, Canvas, ClassDojo, passwords, assignments, home learning, and support for English learners.",
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
