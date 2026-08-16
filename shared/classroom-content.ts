export type Localized = { en: string; es: string };

export type WeekItem = { icon: string; title: Localized; text: Localized };
export type Announcement = {
  priority: boolean;
  date: Localized;
  category: Localized;
  title: Localized;
  body: Localized;
};
export type Favorite = { label: Localized; value: Localized };
export type PersonalDetail = { label: Localized; value: Localized };
export type CalendarEvent = {
  id: string;
  date: string;
  category: Localized;
  title: Localized;
  details: Localized;
};

export type ClassroomContent = {
  version: 1;
  links: { canvasUrl: string; classDojoUrl: string; teacherPhotoUrl: string };
  weekItems: WeekItem[];
  announcements: Announcement[];
  teacher: {
    profileHeading: Localized;
    role: Localized;
    introduction: Localized;
    philosophy: Localized;
    whyTeaching: Localized;
    experience: Localized;
    favorites: Favorite[];
    personalDetails: PersonalDetail[];
    classPromise: Localized;
  };
  calendarEvents: CalendarEvent[];
  updatedAt?: string;
  updatedBy?: string;
};

export const defaultClassroomContent: ClassroomContent = {
  version: 1,
  links: { canvasUrl: "", classDojoUrl: "", teacherPhotoUrl: "" },
  weekItems: [
    {
      icon: "✎",
      title: { en: "What we’re learning", es: "Lo que estamos aprendiendo" },
      text: {
        en: "Mr. Poe: add this week’s reading, math, and language goals.",
        es: "Sr. Poe: agregue las metas de lectura, matemáticas y lenguaje de esta semana.",
      },
    },
    {
      icon: "⌁",
      title: { en: "Important reminder", es: "Recordatorio importante" },
      text: {
        en: "Mr. Poe: add a classroom reminder or homework note.",
        es: "Sr. Poe: agregue un recordatorio del salón o una nota de tarea.",
      },
    },
    {
      icon: "★",
      title: { en: "Celebration", es: "Celebración" },
      text: {
        en: "Mr. Poe: celebrate class effort, growth, or kindness here.",
        es: "Sr. Poe: celebre aquí el esfuerzo, crecimiento o amabilidad de la clase.",
      },
    },
  ],
  announcements: [
    {
      priority: true,
      date: { en: "Update needed", es: "Se necesita actualizar" },
      category: { en: "Teacher note", es: "Nota del maestro" },
      title: { en: "Welcome, Jaguar families!", es: "¡Bienvenidas, familias Jaguar!" },
      body: {
        en: "Mr. Poe: replace this sample with your first classroom announcement.",
        es: "Sr. Poe: reemplace este ejemplo con su primer anuncio del salón.",
      },
    },
    {
      priority: false,
      date: { en: "Update needed", es: "Se necesita actualizar" },
      category: { en: "Learning", es: "Aprendizaje" },
      title: { en: "Weekly learning update", es: "Actualización semanal de aprendizaje" },
      body: {
        en: "Add current skills, practice, and materials for families here.",
        es: "Agregue aquí las destrezas, la práctica y los materiales actuales para las familias.",
      },
    },
  ],
  teacher: {
    profileHeading: { en: "Meet Mr. Poe", es: "Conozca al Sr. Poe" },
    role: {
      en: "Third-Grade Teacher • Grade Level Chairperson",
      es: "Maestro de tercer grado • Coordinador del nivel de grado",
    },
    introduction: {
      en: "Add Mr. Poe’s teacher introduction here. Include only details he has reviewed and approved.",
      es: "Agregue aquí la presentación del Sr. Poe. Incluya solo detalles que él haya revisado y aprobado.",
    },
    philosophy: {
      en: "Add Mr. Poe’s own words about how children learn and how the classroom community grows together.",
      es: "Agregue las propias palabras del Sr. Poe sobre cómo aprenden los niños y cómo crece la comunidad del salón.",
    },
    whyTeaching: { en: "Add Mr. Poe’s personal reflection here.", es: "Agregue aquí la reflexión personal del Sr. Poe." },
    experience: {
      en: "Add verified education and professional experience here.",
      es: "Agregue aquí educación y experiencia profesional verificadas.",
    },
    favorites: [
      ["Favorite book", "Libro favorito"],
      ["Favorite subject", "Materia favorita"],
      ["Favorite food", "Comida favorita"],
      ["Favorite color", "Color favorito"],
      ["Favorite hobby", "Pasatiempo favorito"],
      ["Favorite sports team", "Equipo deportivo favorito"],
      ["Favorite quote", "Cita favorita"],
    ].map(([en, es]) => ({ label: { en, es }, value: { en: "Add answer", es: "Agregar respuesta" } })),
    personalDetails: [
      {
        label: { en: "Hometown", es: "Ciudad natal" },
        value: { en: "Add a detail", es: "Agregar un detalle" },
      },
      {
        label: { en: "Years in education", es: "Años en educación" },
        value: { en: "Add a detail", es: "Agregar un detalle" },
      },
      {
        label: { en: "A little about me", es: "Un poco sobre mí" },
        value: { en: "Add a personal detail", es: "Agregar un detalle personal" },
      },
    ],
    classPromise: {
      en: "We practice respect, responsibility, curiosity, kindness, effort, and growth. Mr. Poe: edit this promise with your class.",
      es: "Practicamos respeto, responsabilidad, curiosidad, amabilidad, esfuerzo y crecimiento. Sr. Poe: edite esta promesa con su clase.",
    },
  },
  calendarEvents: [],
};

const text = (value: unknown, fallback: string, max = 1600) =>
  typeof value === "string" ? value.trim().slice(0, max) : fallback;

const localized = (value: unknown, fallback: Localized): Localized => {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return { en: text(record.en, fallback.en), es: text(record.es, fallback.es) };
};

const safeUrl = (value: unknown, fallback = "") => {
  const candidate = text(value, fallback, 2048);
  if (!candidate) return "";
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
};

export function normalizeClassroomContent(value: unknown): ClassroomContent {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const links = input.links && typeof input.links === "object" ? (input.links as Record<string, unknown>) : {};
  const teacher = input.teacher && typeof input.teacher === "object" ? (input.teacher as Record<string, unknown>) : {};
  const rawWeek = Array.isArray(input.weekItems) ? input.weekItems.slice(0, 8) : [];
  const weekItems = rawWeek.length ? rawWeek.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fallback = defaultClassroomContent.weekItems[index % defaultClassroomContent.weekItems.length];
    return { icon: text(row.icon, fallback.icon, 4), title: localized(row.title, fallback.title), text: localized(row.text, fallback.text) };
  }) : defaultClassroomContent.weekItems;
  const rawAnnouncements = Array.isArray(input.announcements) ? input.announcements.slice(0, 20) : [];
  const announcements = rawAnnouncements.length ? rawAnnouncements.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fallback = defaultClassroomContent.announcements[index % defaultClassroomContent.announcements.length];
    return { priority: row.priority === true, date: localized(row.date, fallback.date), category: localized(row.category, fallback.category), title: localized(row.title, fallback.title), body: localized(row.body, fallback.body) };
  }) : defaultClassroomContent.announcements;
  const rawFavorites = Array.isArray(teacher.favorites) ? teacher.favorites.slice(0, 12) : [];
  const favorites = rawFavorites.length ? rawFavorites.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fallback = defaultClassroomContent.teacher.favorites[index % defaultClassroomContent.teacher.favorites.length];
    return { label: localized(row.label, fallback.label), value: localized(row.value, fallback.value) };
  }) : defaultClassroomContent.teacher.favorites;
  const rawPersonalDetails = Array.isArray(teacher.personalDetails) ? teacher.personalDetails.slice(0, 12) : [];
  const personalDetails = rawPersonalDetails.length ? rawPersonalDetails.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fallback = defaultClassroomContent.teacher.personalDetails[index % defaultClassroomContent.teacher.personalDetails.length];
    return { label: localized(row.label, fallback.label), value: localized(row.value, fallback.value) };
  }) : defaultClassroomContent.teacher.personalDetails;
  const rawEvents = Array.isArray(input.calendarEvents) ? input.calendarEvents.slice(0, 40) : [];
  const calendarEvents = rawEvents.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id, `event-${index + 1}`, 80),
      date: text(row.date, "", 40),
      category: localized(row.category, { en: "Classroom event", es: "Evento del salón" }),
      title: localized(row.title, { en: "New event", es: "Nuevo evento" }),
      details: localized(row.details, { en: "", es: "" }),
    };
  });
  return {
    version: 1,
    links: { canvasUrl: safeUrl(links.canvasUrl), classDojoUrl: safeUrl(links.classDojoUrl), teacherPhotoUrl: safeUrl(links.teacherPhotoUrl) },
    weekItems,
    announcements,
    teacher: {
      profileHeading: localized(teacher.profileHeading, defaultClassroomContent.teacher.profileHeading),
      role: localized(teacher.role, defaultClassroomContent.teacher.role),
      introduction: localized(teacher.introduction, defaultClassroomContent.teacher.introduction),
      philosophy: localized(teacher.philosophy, defaultClassroomContent.teacher.philosophy),
      whyTeaching: localized(teacher.whyTeaching, defaultClassroomContent.teacher.whyTeaching),
      experience: localized(teacher.experience, defaultClassroomContent.teacher.experience),
      favorites,
      personalDetails,
      classPromise: localized(teacher.classPromise, defaultClassroomContent.teacher.classPromise),
    },
    calendarEvents,
    updatedAt: text(input.updatedAt, "", 80) || undefined,
    updatedBy: text(input.updatedBy, "", 320) || undefined,
  };
}
