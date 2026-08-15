export type Lang = "en" | "es";
export type Localized = { en: string; es: string };

// EDIT HERE: Recurring classroom content and links are centralized in this file.
export const classroomConfig = {
  canvasUrl: "",
  classDojoUrl: "",
  teacherPhotoUrl: "",
  schoolUrl: "https://www.pgcps.org/schools/rogers-heights-elementary",
  school: {
    name: "Rogers Heights Elementary School",
    address1: "4301 58th Avenue",
    address2: "Bladensburg, MD 20710",
    phone: "301-985-1860",
    grades: "Pre-K–5",
    mascot: "Jaguar",
    colors: "Royal Blue and Gold",
  },
};

export const weekItems: { icon: string; title: Localized; text: Localized }[] =
  [
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
  ];

export const announcements: {
  priority?: boolean;
  date: Localized;
  category: Localized;
  title: Localized;
  body: Localized;
}[] = [
  {
    priority: true,
    date: { en: "Update needed", es: "Se necesita actualizar" },
    category: { en: "Teacher note", es: "Nota del maestro" },
    title: {
      en: "Welcome, Jaguar families!",
      es: "¡Bienvenidas, familias Jaguar!",
    },
    body: {
      en: "Mr. Poe: replace this sample with your first classroom announcement.",
      es: "Sr. Poe: reemplace este ejemplo con su primer anuncio del salón.",
    },
  },
  {
    date: { en: "Update needed", es: "Se necesita actualizar" },
    category: { en: "Learning", es: "Aprendizaje" },
    title: {
      en: "Weekly learning update",
      es: "Actualización semanal de aprendizaje",
    },
    body: {
      en: "Add current skills, practice, and materials for families here.",
      es: "Agregue aquí las destrezas, la práctica y los materiales actuales para las familias.",
    },
  },
];

export const externalResources = [
  {
    icon: "▣",
    category: "platforms",
    name: "PGCPS Student Resources",
    description: {
      en: "District access to Canvas, Clever, Sora, and student tools.",
      es: "Acceso del distrito a Canvas, Clever, Sora y herramientas estudiantiles.",
    },
    url: "https://www.pgcps.org/students",
    access: {
      en: "School-provided • Sign-in may be required",
      es: "Provisto por la escuela • Puede requerir inicio de sesión",
    },
  },
  {
    icon: "÷",
    category: "math",
    name: "Khan Academy — Grade 3",
    description: {
      en: "Free videos and practice for third-grade math skills.",
      es: "Videos y práctica gratis para destrezas de matemáticas de tercer grado.",
    },
    url: "https://www.khanacademy.org/math/cc-third-grade-math",
    access: {
      en: "Free public resource • Account optional",
      es: "Recurso público gratis • Cuenta opcional",
    },
  },
  {
    icon: "Aa",
    category: "reading",
    name: "ReadWorks",
    description: {
      en: "Reading passages and comprehension practice selected by a teacher.",
      es: "Lecturas y práctica de comprensión seleccionadas por un maestro.",
    },
    url: "https://www.readworks.org/",
    access: {
      en: "Free • Account may be required",
      es: "Gratis • Puede requerir una cuenta",
    },
  },
  {
    icon: "☷",
    category: "reading",
    name: "CommonLit",
    description: {
      en: "A digital reading library with materials beginning in grade 3.",
      es: "Una biblioteca digital de lectura con materiales desde tercer grado.",
    },
    url: "https://www.commonlit.org/",
    access: {
      en: "Free options • Account may be required",
      es: "Opciones gratis • Puede requerir una cuenta",
    },
  },
  {
    icon: "✦",
    category: "research",
    name: "PBS LearningMedia",
    description: {
      en: "Educational videos, activities, and learning collections.",
      es: "Videos educativos, actividades y colecciones de aprendizaje.",
    },
    url: "https://www.pbslearningmedia.org/",
    access: { en: "Free public resource", es: "Recurso público gratis" },
  },
  {
    icon: "◎",
    category: "research",
    name: "National Geographic Kids",
    description: {
      en: "Explore animals, science, geography, and fascinating facts.",
      es: "Explora animales, ciencias, geografía y datos fascinantes.",
    },
    url: "https://kids.nationalgeographic.com/",
    access: { en: "Free public resource", es: "Recurso público gratis" },
  },
  {
    icon: "⌂",
    category: "library",
    name: "PGCPS LINK Resources",
    description: {
      en: "Use a school ID to access Prince George’s County public library resources.",
      es: "Use una identificación escolar para acceder a recursos de la biblioteca pública del condado.",
    },
    url: "https://www.pgcps.org/offices/library-media-services/link-resources",
    access: {
      en: "School-provided access",
      es: "Acceso provisto por la escuela",
    },
  },
];

export const skillPages = {
  english: [
    ["⌕", "Main Idea & Key Details", "Idea principal y detalles clave"],
    ["♙", "Character, Setting & Plot", "Personaje, ambiente y trama"],
    ["?", "Making Inferences", "Hacer inferencias"],
    ["Aa", "Context Clues", "Pistas de contexto"],
    ["↔", "Compare & Contrast", "Comparar y contrastar"],
    ["◉", "Point of View", "Punto de vista"],
    ["1·2·3", "Sequencing", "Secuencia"],
    ["✎", "Opinion Writing", "Escritura de opinión"],
    ["i", "Informative Writing", "Escritura informativa"],
    ["✦", "Narrative Writing", "Escritura narrativa"],
    ["▤", "Text Features", "Características del texto"],
    ["◌", "Fluency & Expression", "Fluidez y expresión"],
  ],
  math: [
    ["+ −", "Addition & Subtraction", "Suma y resta"],
    ["×", "Multiplication", "Multiplicación"],
    ["÷", "Division", "División"],
    ["100", "Place Value", "Valor posicional"],
    ["½", "Fractions", "Fracciones"],
    ["⌇", "Measurement", "Medición"],
    ["◷", "Time", "Tiempo"],
    ["▥", "Data & Graphs", "Datos y gráficas"],
    ["△", "Geometry", "Geometría"],
    ["?", "Problem Solving", "Resolución de problemas"],
  ],
};

export const faqItems: { q: Localized; a: Localized }[] = [
  {
    q: {
      en: "How do I contact Mr. Poe?",
      es: "¿Cómo me comunico con el Sr. Poe?",
    },
    a: {
      en: "Use ClassDojo, our primary family communication tool. Mr. Poe’s class invitation link still needs to be added.",
      es: "Use ClassDojo, nuestra herramienta principal de comunicación familiar. Todavía se debe agregar el enlace de invitación de la clase del Sr. Poe.",
    },
  },
  {
    q: {
      en: "Where does my child find assignments?",
      es: "¿Dónde encuentra mi hijo/a las tareas?",
    },
    a: {
      en: "Assignments may appear in Canvas. Open the course, review announcements and modules, and follow Mr. Poe’s directions.",
      es: "Las tareas pueden aparecer en Canvas. Abra el curso, revise los anuncios y módulos, y siga las instrucciones del Sr. Poe.",
    },
  },
  {
    q: { en: "How do I access Canvas?", es: "¿Cómo accedo a Canvas?" },
    a: {
      en: "Students can open Canvas through PGCPS student resources or Clever. Mr. Poe’s direct course link still needs to be added.",
      es: "Los estudiantes pueden abrir Canvas mediante los recursos estudiantiles de PGCPS o Clever. Todavía se debe agregar el enlace directo del curso del Sr. Poe.",
    },
  },
  {
    q: { en: "How do I use ClassDojo?", es: "¿Cómo uso ClassDojo?" },
    a: {
      en: "Open the app or website, sign into a parent account, and connect using Mr. Poe’s classroom invitation.",
      es: "Abra la aplicación o el sitio web, inicie sesión en una cuenta familiar y conéctese con la invitación del salón del Sr. Poe.",
    },
  },
  {
    q: {
      en: "Where can my child practice math or reading?",
      es: "¿Dónde puede practicar matemáticas o lectura mi hijo/a?",
    },
    a: {
      en: "Visit the Resources page for free, legitimate learning tools. Follow any assignments Mr. Poe shares first.",
      es: "Visite la página de Recursos para encontrar herramientas de aprendizaje legítimas y gratis. Primero siga las tareas que comparta el Sr. Poe.",
    },
  },
  {
    q: {
      en: "What if my child forgets a password?",
      es: "¿Qué hago si mi hijo/a olvida una contraseña?",
    },
    a: {
      en: "Contact Mr. Poe through ClassDojo or use the school’s official technology support process. Add classroom-specific directions here when confirmed.",
      es: "Comuníquese con el Sr. Poe por ClassDojo o use el proceso oficial de apoyo tecnológico de la escuela. Agregue aquí instrucciones específicas cuando estén confirmadas.",
    },
  },
  {
    q: {
      en: "How can I support learning at home?",
      es: "¿Cómo puedo apoyar el aprendizaje en casa?",
    },
    a: {
      en: "Read and talk together, ask your child to explain their thinking, practice with everyday objects, and celebrate effort and growth.",
      es: "Lean y conversen juntos, pida a su hijo/a que explique su razonamiento, practiquen con objetos cotidianos y celebren el esfuerzo y el crecimiento.",
    },
  },
  {
    q: {
      en: "What resources support English learners?",
      es: "¿Qué recursos apoyan a los estudiantes de inglés?",
    },
    a: {
      en: "The ELD page includes visuals, sentence frames, vocabulary supports, and family ideas. Continuing to use the home language builds learning and connection.",
      es: "La página de ELD incluye apoyos visuales, marcos de oraciones, vocabulario e ideas familiares. Seguir usando el idioma del hogar fortalece el aprendizaje y la conexión.",
    },
  },
];
