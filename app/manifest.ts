import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mr. Poe's 3rd Grade Class",
    short_name: "Mr. Poe's Class",
    description:
      "A bilingual learning home for Mr. Poe's third-grade students and families.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#173b8f",
    lang: "en-US",
    icons: [
      {
        src: "/favicon.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
