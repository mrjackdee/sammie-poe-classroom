"use client";

import { useEffect, useMemo, useState } from "react";
import {
  announcements,
  classroomConfig,
  externalResources,
  faqItems,
  Lang,
  skillPages,
  weekItems,
} from "./classroom-data";

const ui = {
  en: {
    brand: "Mr. Poe’s 3rd Grade Jaguars",
    school: "Rogers Heights Elementary",
    nav: ["Home", "Learn", "Resources", "Families", "About Mr. Poe"],
    search: "Search",
    dojo: "ClassDojo",
    open: "Open resource",
    add: "Link to be added",
    edit: "Editable placeholder",
    back: "Back to home",
    more: "More",
    footer:
      "This classroom website supports students and families and does not replace official Prince George’s County Public Schools communications.",
  },
  es: {
    brand: "Jaguares de 3.er grado del Sr. Poe",
    school: "Escuela Primaria Rogers Heights",
    nav: ["Inicio", "Aprender", "Recursos", "Familias", "Conozca al Sr. Poe"],
    search: "Buscar",
    dojo: "ClassDojo",
    open: "Abrir recurso",
    add: "Enlace pendiente",
    edit: "Marcador editable",
    back: "Volver al inicio",
    more: "Más",
    footer:
      "Este sitio web del salón apoya a estudiantes y familias y no reemplaza las comunicaciones oficiales de las Escuelas Públicas del Condado de Prince George.",
  },
};

const routes = [
  ["/", "⌂"],
  ["/learn", "◇"],
  ["/resources", "✦"],
  ["/families", "♥"],
  ["/about", "●"],
];

const thoughts = {
  en: [
    "Mistakes help our brains grow.",
    "Kind words make our classroom stronger.",
    "Small steps can lead to big discoveries.",
  ],
  es: [
    "Los errores ayudan a crecer a nuestro cerebro.",
    "Las palabras amables fortalecen nuestro salón.",
    "Los pasos pequeños pueden llevar a grandes descubrimientos.",
  ],
};

function LocalLink({
  url,
  children,
  className = "button primary",
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!url)
    return (
      <span className={`${className} disabled`} aria-disabled="true">
        {children}
      </span>
    );
  return (
    <a href={url} className={className}>
      {children}
    </a>
  );
}

function PageIntro({
  kicker,
  title,
  text,
  icon,
}: {
  kicker: string;
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <section className="page-intro">
      <div>
        <span className="page-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <span className="page-icon" aria-hidden="true">
        {icon}
      </span>
    </section>
  );
}

function Breadcrumb({ lang, title }: { lang: Lang; title: string }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/">{lang === "en" ? "Home" : "Inicio"}</a>
      <span>›</span>
      <strong>{title}</strong>
    </nav>
  );
}

function Placeholder({
  lang,
  children,
}: {
  lang: Lang;
  children?: React.ReactNode;
}) {
  return (
    <span className="placeholder">
      <b>✎</b>
      {children || ui[lang].edit}
    </span>
  );
}

function Jaguar({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  return (
    <div
      className={`jaguar-wrap ${compact ? "compact" : ""}`}
      role="img"
      aria-label={
        lang === "en"
          ? "Friendly original jaguar classroom character"
          : "Personaje original y amistoso de jaguar del salón"
      }
    >
      <span className="paw paw-one">●</span>
      <span className="paw paw-two">●</span>
      <div className="jaguar">
        <div className="ear left" />
        <div className="ear right" />
        <div className="eye left" />
        <div className="eye right" />
        <div className="spot s1" />
        <div className="spot s2" />
        <div className="spot s3" />
        <div className="muzzle">
          <span>●</span>
          <i />
        </div>
      </div>
      {!compact && (
        <div className="mascot-badge">
          {lang === "en" ? "You belong here!" : "¡Tú perteneces aquí!"}
        </div>
      )}
    </div>
  );
}

function Home({ lang }: { lang: Lang }) {
  const t =
    lang === "en"
      ? {
          welcome: "Welcome to Mr. Poe’s 3rd Grade Class",
          intro:
            "Welcome, Jaguars! This is our classroom home for learning, growing, exploring, and staying connected.",
          start: "Start learning",
          actions: [
            ["Canvas", "Assignments", "/canvas", "▣"],
            ["ClassDojo", "Family messages", "/families", "♥"],
            ["Math", "Practice skills", "/math", "×"],
            ["English", "Read & write", "/english", "Aa"],
            ["Learning Tools", "Explore resources", "/resources", "✦"],
            ["Family Resources", "Help at home", "/families", "⌂"],
          ],
        }
      : {
          welcome: "Bienvenidos a la clase de 3.er grado del Sr. Poe",
          intro:
            "¡Bienvenidos, Jaguares! Este es nuestro hogar del salón para aprender, crecer, explorar y mantenernos conectados.",
          start: "Comenzar a aprender",
          actions: [
            ["Canvas", "Tareas", "/canvas", "▣"],
            ["ClassDojo", "Mensajes familiares", "/families", "♥"],
            ["Matemáticas", "Practicar destrezas", "/math", "×"],
            ["Inglés", "Leer y escribir", "/english", "Aa"],
            ["Herramientas", "Explorar recursos", "/resources", "✦"],
            ["Recursos familiares", "Apoyo en casa", "/families", "⌂"],
          ],
        };
  return (
    <>
      <section className="hero" aria-labelledby="welcome-title">
        <div className="hero-copy">
          <span className="eyebrow">
            <i>★</i>{" "}
            {lang === "en"
              ? "Learn • Grow • Roar"
              : "Aprender • Crecer • Rugir"}
          </span>
          <h1 id="welcome-title">{t.welcome}</h1>
          <p>{t.intro}</p>
          <a href="/learn" className="primary-button">
            {t.start}
            <span>→</span>
          </a>
        </div>
        <Jaguar lang={lang} />
      </section>
      <section
        className="quick-section section-wrap"
        aria-labelledby="quick-title"
      >
        <div className="section-heading">
          <div>
            <span>{lang === "en" ? "QUICK ACCESS" : "ACCESO RÁPIDO"}</span>
            <h2 id="quick-title">
              {lang === "en"
                ? "Where do you want to go?"
                : "¿Adónde quieres ir?"}
            </h2>
          </div>
          <span className="tiny-note">
            {lang === "en"
              ? "Tap a card to begin"
              : "Toca una tarjeta para comenzar"}
          </span>
        </div>
        <div className="quick-grid">
          {t.actions.map(([name, desc, href, icon], i) => (
            <a className={`quick-card c${i + 1}`} href={href} key={name}>
              <span className="quick-icon">{icon}</span>
              <span>
                <strong>{name}</strong>
                <small>{desc}</small>
              </span>
              <b>›</b>
            </a>
          ))}
        </div>
      </section>
      <section className="section-wrap dashboard-grid">
        <div className="panel week-panel">
          <div className="panel-title">
            <div>
              <span className="mini-label">
                {lang === "en" ? "CLASSROOM SNAPSHOT" : "RESUMEN DEL SALÓN"}
              </span>
              <h2>{lang === "en" ? "This Week" : "Esta Semana"}</h2>
            </div>
            <Placeholder lang={lang} />
          </div>
          <div className="week-list">
            {weekItems.map((item) => (
              <div className="week-row" key={item.title.en}>
                <span>{item.icon}</span>
                <div>
                  <h3>{item.title[lang]}</h3>
                  <p>{item.text[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="thought-card">
          <span className="thought-paw">●</span>
          <span>
            {lang === "en"
              ? "JAGUAR THOUGHT OF THE DAY"
              : "PENSAMIENTO JAGUAR DEL DÍA"}
          </span>
          <blockquote>“{thoughts[lang][0]}”</blockquote>
          <small>
            —{" "}
            {lang === "en"
              ? "Keep growing, Jaguars!"
              : "¡Sigan creciendo, Jaguares!"}
          </small>
        </aside>
      </section>
      <section className="section-wrap learning-today">
        <div className="section-heading">
          <div>
            <span>
              {lang === "en" ? "TODAY’S LEARNING" : "APRENDIZAJE DE HOY"}
            </span>
            <h2>
              {lang === "en"
                ? "Our learning lanes"
                : "Nuestras rutas de aprendizaje"}
            </h2>
          </div>
          <Placeholder lang={lang} />
        </div>
        <div className="subject-row">
          {[
            [
              "Aa",
              lang === "en"
                ? "English Language Arts"
                : "Artes del Lenguaje Inglés",
              lang === "en"
                ? "Read closely • Write clearly"
                : "Leer con atención • Escribir con claridad",
              "/english",
            ],
            [
              "×",
              lang === "en" ? "Mathematics" : "Matemáticas",
              lang === "en"
                ? "Reason • Model • Solve"
                : "Razonar • Modelar • Resolver",
              "/math",
            ],
            [
              "ELD",
              lang === "en" ? "Language Development" : "Desarrollo del Idioma",
              lang === "en"
                ? "Listen • Speak • Connect"
                : "Escuchar • Hablar • Conectar",
              "/eld",
            ],
          ].map((x) => (
            <a href={x[3]} className="subject-card" key={x[1]}>
              <span>{x[0]}</span>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
              <b>→</b>
            </a>
          ))}
        </div>
      </section>
      <section className="section-wrap announcements">
        <div className="section-heading">
          <div>
            <span>
              {lang === "en" ? "STAY CONNECTED" : "MANTÉNGASE CONECTADO"}
            </span>
            <h2>
              {lang === "en" ? "Class announcements" : "Anuncios de la clase"}
            </h2>
          </div>
          <a href="/calendar" className="text-link">
            {lang === "en" ? "View calendar" : "Ver calendario"} →
          </a>
        </div>
        <div className="announcement-grid">
          {announcements.map((a, i) => (
            <article
              className={`announcement-card ${a.priority ? "priority" : ""}`}
              key={i}
            >
              <div>
                <span>{a.category[lang]}</span>
                <time>{a.date[lang]}</time>
              </div>
              <h3>{a.title[lang]}</h3>
              <p>{a.body[lang]}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Learn({ lang }: { lang: Lang }) {
  const cats =
    lang === "en"
      ? [
          [
            "Aa",
            "English Language Arts",
            "Build reading, writing, vocabulary, fluency, and comprehension.",
            "/english",
          ],
          [
            "×",
            "Mathematics",
            "Practice number sense, operations, fractions, measurement, and problem solving.",
            "/math",
          ],
          [
            "ELD",
            "English Language Development",
            "Grow listening, speaking, reading, writing, and academic language.",
            "/eld",
          ],
          [
            "▣",
            "Canvas",
            "Find assignments, announcements, course materials, and teacher directions.",
            "/canvas",
          ],
          [
            "✦",
            "Educational Tools",
            "Open trusted learning, research, library, and practice resources.",
            "/resources",
          ],
          [
            "⌂",
            "Practice at Home",
            "Try simple literacy and math ideas using things already at home.",
            "/families",
          ],
        ]
      : [
          [
            "Aa",
            "Artes del Lenguaje Inglés",
            "Fortalece lectura, escritura, vocabulario, fluidez y comprensión.",
            "/english",
          ],
          [
            "×",
            "Matemáticas",
            "Practica sentido numérico, operaciones, fracciones, medición y resolución de problemas.",
            "/math",
          ],
          [
            "ELD",
            "Desarrollo del Idioma Inglés",
            "Desarrolla escuchar, hablar, leer, escribir y el lenguaje académico.",
            "/eld",
          ],
          [
            "▣",
            "Canvas",
            "Encuentra tareas, anuncios, materiales e instrucciones del maestro.",
            "/canvas",
          ],
          [
            "✦",
            "Herramientas educativas",
            "Abre recursos confiables de aprendizaje, investigación, biblioteca y práctica.",
            "/resources",
          ],
          [
            "⌂",
            "Práctica en casa",
            "Prueba ideas sencillas de lectura y matemáticas con cosas que ya tienes.",
            "/families",
          ],
        ];
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={lang === "en" ? "Learning Hub" : "Centro de Aprendizaje"}
      />
      <PageIntro
        kicker={
          lang === "en"
            ? "STUDENT LEARNING HUB"
            : "CENTRO DE APRENDIZAJE ESTUDIANTIL"
        }
        title={
          lang === "en"
            ? "Choose your learning adventure"
            : "Elige tu aventura de aprendizaje"
        }
        text={
          lang === "en"
            ? "Everything you need to practice, explore, and do your best work—in one organized place."
            : "Todo lo que necesitas para practicar, explorar y hacer tu mejor trabajo, en un solo lugar."
        }
        icon="◇"
      />
      <section className="section-wrap card-directory">
        {cats.map((c) => (
          <article className="directory-card" key={c[1]}>
            <span className="directory-icon">{c[0]}</span>
            <div>
              <h2>{c[1]}</h2>
              <p>{c[2]}</p>
              <a href={c[3]}>
                {lang === "en" ? "Explore" : "Explorar"} <b>→</b>
              </a>
            </div>
          </article>
        ))}
      </section>
      <section className="section-wrap jaguar-tip">
        <Jaguar lang={lang} compact />
        <div>
          <span>
            {lang === "en" ? "JAGUAR LEARNING TIP" : "CONSEJO JAGUAR"}
          </span>
          <h2>
            {lang === "en" ? "Pause. Plan. Pounce!" : "¡Pausa. Planea. Avanza!"}
          </h2>
          <p>
            {lang === "en"
              ? "Read the directions, choose a strategy, and check your work before you finish."
              : "Lee las instrucciones, elige una estrategia y revisa tu trabajo antes de terminar."}
          </p>
        </div>
      </section>
    </>
  );
}

function SubjectPage({
  lang,
  subject,
}: {
  lang: Lang;
  subject: "english" | "math";
}) {
  const isEnglish = subject === "english";
  const title = isEnglish
    ? lang === "en"
      ? "English Language Arts"
      : "Artes del Lenguaje Inglés"
    : lang === "en"
      ? "Mathematics"
      : "Matemáticas";
  const groups = isEnglish
    ? lang === "en"
      ? [
          "Reading",
          "Writing",
          "Vocabulary",
          "Grammar & Language",
          "Fluency",
          "Comprehension",
          "Independent Reading",
        ]
      : [
          "Lectura",
          "Escritura",
          "Vocabulario",
          "Gramática y lenguaje",
          "Fluidez",
          "Comprensión",
          "Lectura independiente",
        ]
    : lang === "en"
      ? [
          "Numbers & Operations",
          "Fractions",
          "Measurement & Time",
          "Data & Graphs",
          "Geometry",
          "Problem Solving",
        ]
      : [
          "Números y operaciones",
          "Fracciones",
          "Medición y tiempo",
          "Datos y gráficas",
          "Geometría",
          "Resolución de problemas",
        ];
  const tools =
    lang === "en"
      ? [
          "Draw a picture",
          "Make an array",
          "Use equal groups",
          "Build a number line",
          "Break apart numbers",
          "Estimate",
          "Find important information",
          "Show your work",
          "Check your answer",
        ]
      : [
          "Haz un dibujo",
          "Crea una matriz",
          "Usa grupos iguales",
          "Construye una recta numérica",
          "Descompón números",
          "Estima",
          "Busca información importante",
          "Muestra tu trabajo",
          "Revisa tu respuesta",
        ];
  const family = isEnglish
    ? lang === "en"
      ? [
          "Read together in the language that feels strongest.",
          "Ask who, what, where, when, why, and how questions.",
          "Discuss new words and connect them to everyday life.",
          "Invite your child to retell or summarize a story.",
          "Encourage notes, stories, lists, and daily writing.",
          "Visit the public library and let your child choose books.",
        ]
      : [
          "Lean juntos en el idioma que se sienta más fuerte.",
          "Hagan preguntas de quién, qué, dónde, cuándo, por qué y cómo.",
          "Conversen sobre palabras nuevas y conéctenlas con la vida diaria.",
          "Invite a su hijo/a a volver a contar o resumir una historia.",
          "Anime notas, cuentos, listas y escritura diaria.",
          "Visiten la biblioteca pública y deje que su hijo/a elija libros.",
        ]
    : lang === "en"
      ? [
          "Compare prices while grocery shopping.",
          "Measure ingredients while cooking.",
          "Read clocks and plan how long activities take.",
          "Count coins or make pretend change.",
          "Measure household objects with a ruler or string.",
          "Share food into equal fractions.",
          "Count equal groups of toys, socks, or utensils.",
          "Play number games with cards, dice, or scrap paper.",
        ]
      : [
          "Comparen precios al comprar alimentos.",
          "Midan ingredientes al cocinar.",
          "Lean relojes y calculen cuánto duran las actividades.",
          "Cuenten monedas o practiquen dar cambio.",
          "Midan objetos de casa con una regla o cuerda.",
          "Dividan alimentos en fracciones iguales.",
          "Cuenten grupos iguales de juguetes, calcetines o utensilios.",
          "Jueguen con números usando cartas, dados o papel usado.",
        ];
  return (
    <>
      <Breadcrumb lang={lang} title={title} />
      <PageIntro
        kicker={
          lang === "en" ? "GRADE 3 LEARNING" : "APRENDIZAJE DE 3.er GRADO"
        }
        title={title}
        text={
          isEnglish
            ? lang === "en"
              ? "Read with purpose, write with voice, and use language to share big ideas."
              : "Lee con propósito, escribe con tu propia voz y usa el lenguaje para compartir grandes ideas."
            : lang === "en"
              ? "Notice patterns, explain your thinking, and solve problems with confidence."
              : "Observa patrones, explica tu razonamiento y resuelve problemas con confianza."
        }
        icon={isEnglish ? "Aa" : "×"}
      />
      <section className="section-wrap">
        <div className="topic-pills">
          {groups.map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>
        <div className="section-heading">
          <div>
            <span>
              {lang === "en" ? "SKILLS TO GROW" : "DESTREZAS PARA CRECER"}
            </span>
            <h2>
              {lang === "en"
                ? "Third-grade skill cards"
                : "Tarjetas de destrezas de tercer grado"}
            </h2>
          </div>
        </div>
        <div className="skill-grid">
          {skillPages[subject].map((s) => (
            <article key={s[1]}>
              <span>{s[0]}</span>
              <h3>{lang === "en" ? s[1] : s[2]}</h3>
              <p>
                {isEnglish
                  ? lang === "en"
                    ? "Learn the strategy, see an example, then try it in your own reading or writing."
                    : "Aprende la estrategia, mira un ejemplo y pruébala en tu propia lectura o escritura."
                  : lang === "en"
                    ? "Use models, words, and numbers to show how your thinking works."
                    : "Usa modelos, palabras y números para mostrar tu razonamiento."}
              </p>
            </article>
          ))}
        </div>
      </section>
      {!isEnglish && (
        <section className="band">
          <div className="section-wrap">
            <span className="mini-label light">
              {lang === "en"
                ? "MATH STRATEGY TOOLBOX"
                : "CAJA DE ESTRATEGIAS MATEMÁTICAS"}
            </span>
            <h2>
              {lang === "en"
                ? "When you feel stuck, try a tool"
                : "Cuando te sientas atascado, prueba una herramienta"}
            </h2>
            <div className="strategy-grid">
              {tools.map((x, i) => (
                <span key={x}>
                  <b>{i + 1}</b>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section-wrap family-help">
        <div>
          <span className="mini-label">
            {lang === "en"
              ? "FAMILIES AS LEARNING PARTNERS"
              : "FAMILIAS COMO COMPAÑERAS DE APRENDIZAJE"}
          </span>
          <h2>
            {isEnglish
              ? lang === "en"
                ? "Ways families can help at home"
                : "Maneras en que las familias pueden ayudar en casa"
              : lang === "en"
                ? "Math at home"
                : "Matemáticas en casa"}
          </h2>
          <p>
            {lang === "en"
              ? "No special materials are needed. Conversation, curiosity, and everyday routines are powerful learning tools."
              : "No se necesitan materiales especiales. La conversación, la curiosidad y las rutinas diarias son herramientas poderosas."}
          </p>
        </div>
        <ul>
          {family.map((x) => (
            <li key={x}>
              <span>✓</span>
              {x}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ELD({ lang }: { lang: Lang }) {
  const areas =
    lang === "en"
      ? [
          [
            "◖",
            "Listening",
            "Watch, listen, and connect words to pictures, gestures, and examples.",
          ],
          [
            "◉",
            "Speaking",
            "Rehearse ideas with a partner and use sentence frames to share clearly.",
          ],
          [
            "Aa",
            "Reading",
            "Preview vocabulary, chunk text, and use pictures or organizers to build meaning.",
          ],
          [
            "✎",
            "Writing",
            "Study a model, plan with an organizer, and use a word bank while drafting.",
          ],
          [
            "abc",
            "Vocabulary",
            "Connect new words to known ideas, real objects, actions, and home-language knowledge.",
          ],
          [
            "↗",
            "Academic Language",
            "Practice the words and sentence patterns used to explain thinking in every subject.",
          ],
        ]
      : [
          [
            "◖",
            "Escuchar",
            "Mira, escucha y conecta palabras con imágenes, gestos y ejemplos.",
          ],
          [
            "◉",
            "Hablar",
            "Ensaya ideas con un compañero y usa marcos de oraciones para compartir con claridad.",
          ],
          [
            "Aa",
            "Leer",
            "Repasa vocabulario, divide el texto y usa imágenes u organizadores para comprender.",
          ],
          [
            "✎",
            "Escribir",
            "Estudia un modelo, planifica con un organizador y usa un banco de palabras al escribir.",
          ],
          [
            "abc",
            "Vocabulario",
            "Conecta palabras nuevas con ideas conocidas, objetos, acciones y el idioma del hogar.",
          ],
          [
            "↗",
            "Lenguaje académico",
            "Practica las palabras y patrones que usamos para explicar ideas en cada materia.",
          ],
        ];
  const frames = [
    ["I think ___ because ___.", "Pienso ___ porque ___."],
    ["The main idea is ___.", "La idea principal es ___."],
    ["I solved the problem by ___.", "Resolví el problema al ___."],
    [
      "First ___, then ___, and finally ___.",
      "Primero ___, luego ___ y finalmente ___.",
    ],
    [
      "I agree/disagree with ___ because ___.",
      "Estoy de acuerdo/no estoy de acuerdo con ___ porque ___.",
    ],
  ];
  const support =
    lang === "en"
      ? [
          "Continue using your home language—it is a strength.",
          "Read together in either language.",
          "Talk about school learning during everyday routines.",
          "Build vocabulary through real conversations.",
          "Ask your child to explain what they learned.",
          "Use pictures, gestures, and real objects.",
          "Celebrate progress, practice, and brave attempts.",
          "Stay connected with Mr. Poe through ClassDojo.",
        ]
      : [
          "Siga usando el idioma del hogar: es una fortaleza.",
          "Lean juntos en cualquiera de los dos idiomas.",
          "Hablen sobre el aprendizaje escolar durante las rutinas diarias.",
          "Desarrollen vocabulario mediante conversaciones reales.",
          "Pida a su hijo/a que explique lo que aprendió.",
          "Usen imágenes, gestos y objetos reales.",
          "Celebren el progreso, la práctica y los intentos valientes.",
          "Manténganse en contacto con el Sr. Poe por ClassDojo.",
        ];
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={
          lang === "en"
            ? "English Language Development"
            : "Desarrollo del Idioma Inglés"
        }
      />
      <PageIntro
        kicker="ELD"
        title={
          lang === "en"
            ? "English Language Development"
            : "Desarrollo del Idioma Inglés"
        }
        text={
          lang === "en"
            ? "Multilingualism is a strength. ELD gives learners practical tools to understand, participate, and share their full thinking in English."
            : "El multilingüismo es una fortaleza. ELD ofrece herramientas prácticas para comprender, participar y compartir ideas completas en inglés."
        }
        icon="ELD"
      />
      <section className="section-wrap">
        <div className="strategy-note">
          <b>{lang === "en" ? "In our classroom" : "En nuestro salón"}</b>
          <p>
            {lang === "en"
              ? "We use visual supports, word banks, vocabulary previews, graphic organizers, modeling, repetition, gestures, picture cues, partner talk, read-alouds, chunked directions, real examples, and frequent checks for understanding."
              : "Usamos apoyos visuales, bancos de palabras, repasos de vocabulario, organizadores gráficos, modelos, repetición, gestos, imágenes, conversaciones en pareja, lecturas en voz alta, instrucciones en partes, ejemplos reales y verificaciones frecuentes de comprensión."}
          </p>
        </div>
        <div className="eld-grid">
          {areas.map((x) => (
            <article key={x[1]}>
              <span>{x[0]}</span>
              <h2>{x[1]}</h2>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="band">
        <div className="section-wrap">
          <span className="mini-label light">
            {lang === "en" ? "SENTENCE FRAMES" : "MARCOS DE ORACIONES"}
          </span>
          <h2>
            {lang === "en"
              ? "Language that helps us share our thinking"
              : "Lenguaje que nos ayuda a compartir nuestras ideas"}
          </h2>
          <div className="frame-grid">
            {frames.map((f) => (
              <article key={f[0]}>
                <strong>“{f[0]}”</strong>
                <span>
                  {lang === "en" ? "In Spanish:" : "Significa:"} {f[1]}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-wrap family-help">
        <div>
          <span className="mini-label">
            {lang === "en" ? "FAMILY PARTNERS" : "FAMILIAS COLABORADORAS"}
          </span>
          <h2>
            {lang === "en"
              ? "Supporting an English learner at home"
              : "Apoyo en casa para un estudiante de inglés"}
          </h2>
          <p>
            {lang === "en"
              ? "Children learn more when all their languages, experiences, and ideas are welcomed."
              : "Los niños aprenden más cuando todos sus idiomas, experiencias e ideas son bienvenidos."}
          </p>
        </div>
        <ul>
          {support.map((x) => (
            <li key={x}>
              <span>✓</span>
              {x}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function CanvasPage({ lang }: { lang: Lang }) {
  const steps =
    lang === "en"
      ? [
          "Open Canvas",
          "Sign in",
          "Choose Mr. Poe’s class",
          "Open your assignment",
          "Read all directions",
          "Complete and submit your work",
        ]
      : [
          "Abre Canvas",
          "Inicia sesión",
          "Elige la clase del Sr. Poe",
          "Abre tu tarea",
          "Lee todas las instrucciones",
          "Completa y entrega tu trabajo",
        ];
  return (
    <>
      <Breadcrumb lang={lang} title="Canvas" />
      <PageIntro
        kicker={lang === "en" ? "CLASSROOM PLATFORM" : "PLATAFORMA DEL SALÓN"}
        title={
          lang === "en"
            ? "Your work starts in Canvas"
            : "Tu trabajo comienza en Canvas"
        }
        text={
          lang === "en"
            ? "Canvas is a digital learning space where students can find course materials, announcements, directions, and assignments shared by Mr. Poe."
            : "Canvas es un espacio digital donde los estudiantes pueden encontrar materiales, anuncios, instrucciones y tareas compartidas por el Sr. Poe."
        }
        icon="▣"
      />
      <section className="section-wrap canvas-callout">
        <div>
          <span className="mini-label">
            {lang === "en" ? "MR. POE’S COURSE" : "CURSO DEL SR. POE"}
          </span>
          <h2>
            {lang === "en"
              ? "Ready to go to class?"
              : "¿Listo para ir a clase?"}
          </h2>
          <p>
            {lang === "en"
              ? "The direct classroom course link has not been provided yet."
              : "Todavía no se ha proporcionado el enlace directo del curso."}
          </p>
        </div>
        <LocalLink url={classroomConfig.canvasUrl}>
          {classroomConfig.canvasUrl
            ? lang === "en"
              ? "Go to Canvas"
              : "Ir a Canvas"
            : ui[lang].add}
        </LocalLink>
      </section>
      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <span>{lang === "en" ? "STEP BY STEP" : "PASO A PASO"}</span>
            <h2>
              {lang === "en"
                ? "How to get to your work"
                : "Cómo llegar a tu trabajo"}
            </h2>
          </div>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s}>
              <span>{i + 1}</span>
              <strong>{s}</strong>
            </li>
          ))}
        </ol>
        <div className="info-grid">
          <article>
            <span>⌂</span>
            <h3>
              {lang === "en"
                ? "Where assignments appear"
                : "Dónde aparecen las tareas"}
            </h3>
            <p>
              {lang === "en"
                ? "Open Mr. Poe’s course and check the Home page, Modules, Assignments, Calendar, and To Do list. Course setup may vary."
                : "Abre el curso del Sr. Poe y revisa Inicio, Módulos, Tareas, Calendario y la lista Por hacer. La organización puede variar."}
            </p>
          </article>
          <article>
            <span>◉</span>
            <h3>
              {lang === "en" ? "Find announcements" : "Encuentra anuncios"}
            </h3>
            <p>
              {lang === "en"
                ? "Check Announcements and the course Home page for teacher updates and new directions."
                : "Revisa Anuncios y la página de Inicio del curso para ver novedades e instrucciones."}
            </p>
          </article>
          <article>
            <span>♥</span>
            <h3>{lang === "en" ? "For families" : "Para las familias"}</h3>
            <p>
              {lang === "en"
                ? "Use Canvas information when applicable and follow Mr. Poe’s ClassDojo messages. For official grades and attendance, use the district’s current family portal."
                : "Use la información de Canvas cuando corresponda y siga los mensajes del Sr. Poe en ClassDojo. Para calificaciones y asistencia oficiales, use el portal familiar actual del distrito."}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

function Resources({ lang }: { lang: Lang }) {
  const labels: Record<string, { en: string; es: string }> = {
    platforms: { en: "Classroom Platforms", es: "Plataformas del salón" },
    reading: { en: "Reading", es: "Lectura" },
    math: { en: "Mathematics", es: "Matemáticas" },
    research: {
      en: "Research & Discovery",
      es: "Investigación y descubrimiento",
    },
    library: { en: "Digital Library", es: "Biblioteca digital" },
  };
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={lang === "en" ? "Educational Tools" : "Herramientas Educativas"}
      />
      <PageIntro
        kicker={
          lang === "en"
            ? "SAFE, TRUSTED DESTINATIONS"
            : "DESTINOS SEGUROS Y CONFIABLES"
        }
        title={
          lang === "en"
            ? "Educational Tools Directory"
            : "Directorio de Herramientas Educativas"
        }
        text={
          lang === "en"
            ? "Explore official district tools and established educational resources. External sites open in a new tab."
            : "Explora herramientas oficiales del distrito y recursos educativos establecidos. Los sitios externos se abren en una pestaña nueva."
        }
        icon="✦"
      />
      <section className="section-wrap resource-groups">
        {Object.keys(labels).map((cat) => (
          <details open={cat === "platforms"} key={cat}>
            <summary>
              <span>{labels[cat][lang]}</span>
              <b>
                {externalResources.filter((r) => r.category === cat).length}
              </b>
            </summary>
            <div className="resource-grid">
              {externalResources
                .filter((r) => r.category === cat)
                .map((r) => (
                  <article className="resource-card" key={r.name}>
                    <span className="resource-icon">{r.icon}</span>
                    <div>
                      <h3>{r.name}</h3>
                      <p>{r.description[lang]}</p>
                      <small>{r.access[lang]}</small>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {ui[lang].open}
                        <span
                          aria-label={
                            lang === "en"
                              ? "opens in a new tab"
                              : "se abre en una pestaña nueva"
                          }
                        >
                          ↗
                        </span>
                      </a>
                    </div>
                  </article>
                ))}
            </div>
          </details>
        ))}
      </section>
      <section className="section-wrap safety-note">
        <span>✓</span>
        <div>
          <h2>
            {lang === "en"
              ? "A note for families"
              : "Una nota para las familias"}
          </h2>
          <p>
            {lang === "en"
              ? "A link here does not mean Rogers Heights or Mr. Poe subscribes to that service. Some tools may require an account, and students should follow teacher and family directions when leaving this site."
              : "Un enlace aquí no significa que Rogers Heights o el Sr. Poe estén suscritos al servicio. Algunas herramientas pueden requerir una cuenta, y los estudiantes deben seguir las instrucciones del maestro y la familia al salir de este sitio."}
          </p>
        </div>
      </section>
    </>
  );
}

function Families({ lang }: { lang: Lang }) {
  const steps =
    lang === "en"
      ? [
          "Download or open ClassDojo.",
          "Sign in to your parent account.",
          "Connect to your child’s class using Mr. Poe’s classroom invitation.",
          "Check messages and classroom updates regularly.",
          "Use ClassDojo to communicate with Mr. Poe.",
        ]
      : [
          "Descargue o abra ClassDojo.",
          "Inicie sesión en su cuenta familiar.",
          "Conéctese a la clase de su hijo/a con la invitación del salón del Sr. Poe.",
          "Revise los mensajes y las novedades del salón con regularidad.",
          "Use ClassDojo para comunicarse con el Sr. Poe.",
        ];
  const cards =
    lang === "en"
      ? [
          [
            "⌂",
            "Supporting Learning at Home",
            "Read, talk, count, measure, create, and ask your child to explain their thinking.",
          ],
          [
            "▣",
            "Canvas Help",
            "Use our step-by-step Canvas guide to locate directions and assignments.",
          ],
          [
            "◷",
            "Attendance",
            "Use the school or district’s official process for attendance questions and notices.",
          ],
          [
            "⚙",
            "Technology Help",
            "Contact the school or use official PGCPS support when a device or login needs help.",
          ],
          [
            "♥",
            "Family Engagement",
            "Watch ClassDojo and official school channels for confirmed opportunities.",
          ],
          [
            "◎",
            "Community Resources",
            "Visit official school and district family pages for current programs and services.",
          ],
        ]
      : [
          [
            "⌂",
            "Apoyo al aprendizaje en casa",
            "Lean, conversen, cuenten, midan, creen y pida a su hijo/a que explique su razonamiento.",
          ],
          [
            "▣",
            "Ayuda con Canvas",
            "Use nuestra guía paso a paso para encontrar instrucciones y tareas.",
          ],
          [
            "◷",
            "Asistencia",
            "Use el proceso oficial de la escuela o distrito para preguntas y avisos de asistencia.",
          ],
          [
            "⚙",
            "Ayuda tecnológica",
            "Comuníquese con la escuela o use el apoyo oficial de PGCPS para dispositivos o inicios de sesión.",
          ],
          [
            "♥",
            "Participación familiar",
            "Revise ClassDojo y canales oficiales para oportunidades confirmadas.",
          ],
          [
            "◎",
            "Recursos comunitarios",
            "Visite las páginas oficiales de la escuela y del distrito para programas y servicios actuales.",
          ],
        ];
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={lang === "en" ? "Family Center" : "Centro para Familias"}
      />
      <PageIntro
        kicker={
          lang === "en"
            ? "FAMILIES + SCHOOL, TOGETHER"
            : "FAMILIAS + ESCUELA, JUNTOS"
        }
        title={lang === "en" ? "Family Center" : "Centro para Familias"}
        text={
          lang === "en"
            ? "Quick answers, practical learning ideas, and trusted ways to stay connected with our classroom."
            : "Respuestas rápidas, ideas prácticas de aprendizaje y maneras confiables de mantenerse conectado con nuestro salón."
        }
        icon="♥"
      />
      <section className="section-wrap dojo-feature">
        <div>
          <span className="mini-label light">
            {lang === "en"
              ? "OUR PRIMARY COMMUNICATION TOOL"
              : "NUESTRA HERRAMIENTA PRINCIPAL DE COMUNICACIÓN"}
          </span>
          <h2>ClassDojo</h2>
          <p>
            {lang === "en"
              ? "ClassDojo is the primary communication channel between Mr. Poe and families. Check it regularly for classroom messages and updates."
              : "ClassDojo es el canal principal de comunicación entre el Sr. Poe y las familias. Revíselo regularmente para ver mensajes y novedades del salón."}
          </p>
          <LocalLink
            url={classroomConfig.classDojoUrl}
            className="button yellow"
          >
            {classroomConfig.classDojoUrl
              ? lang === "en"
                ? "Open ClassDojo"
                : "Abrir ClassDojo"
              : ui[lang].add}
          </LocalLink>
        </div>
        <ol>
          {steps.map((s, i) => (
            <li key={s}>
              <span>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>
      <section className="section-wrap">
        <div className="family-grid">
          {cards.map((x) => (
            <article key={x[1]}>
              <span>{x[0]}</span>
              <h2>{x[1]}</h2>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-wrap school-card">
        <div>
          <span className="mini-label">
            {lang === "en" ? "SCHOOL INFORMATION" : "INFORMACIÓN ESCOLAR"}
          </span>
          <h2>Rogers Heights Elementary School</h2>
          <address>
            {classroomConfig.school.address1}
            <br />
            {classroomConfig.school.address2}
            <br />
            <a href={`tel:${classroomConfig.school.phone}`}>
              {classroomConfig.school.phone}
            </a>
          </address>
          <p>
            {lang === "en"
              ? `Grades ${classroomConfig.school.grades} • Mascot: ${classroomConfig.school.mascot} • ${classroomConfig.school.colors}`
              : `Grados ${classroomConfig.school.grades} • Mascota: ${classroomConfig.school.mascot} • ${classroomConfig.school.colors}`}
          </p>
          <a
            className="button outline"
            href={classroomConfig.schoolUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === "en"
              ? "Official school website"
              : "Sitio oficial de la escuela"}{" "}
            ↗
          </a>
        </div>
        <Jaguar lang={lang} compact />
      </section>
    </>
  );
}

function About({ lang }: { lang: Lang }) {
  const favorites =
    lang === "en"
      ? [
          "Favorite book",
          "Favorite subject",
          "Favorite food",
          "Favorite color",
          "Favorite hobby",
          "Favorite sports team",
          "Favorite quote",
        ]
      : [
          "Libro favorito",
          "Materia favorita",
          "Comida favorita",
          "Color favorito",
          "Pasatiempo favorito",
          "Equipo deportivo favorito",
          "Cita favorita",
        ];
  const promises =
    lang === "en"
      ? [
          ["♥", "Be Kind"],
          ["✓", "Be Ready"],
          ["◉", "Be Respectful"],
          ["★", "Be Responsible"],
          ["?", "Be Curious"],
          ["↗", "Try Your Best"],
        ]
      : [
          ["♥", "Sé amable"],
          ["✓", "Prepárate"],
          ["◉", "Sé respetuoso/a"],
          ["★", "Sé responsable"],
          ["?", "Sé curioso/a"],
          ["↗", "Haz tu mejor esfuerzo"],
        ];
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={lang === "en" ? "About Mr. Poe" : "Conozca al Sr. Poe"}
      />
      <PageIntro
        kicker={lang === "en" ? "YOUR TEACHER" : "SU MAESTRO"}
        title={lang === "en" ? "About Mr. Poe" : "Conozca al Sr. Poe"}
        text={
          lang === "en"
            ? "Third-Grade Teacher • Grade Level Chairperson"
            : "Maestro de tercer grado • Coordinador del nivel de grado"
        }
        icon="●"
      />
      <section className="section-wrap teacher-grid">
        <div className="photo-placeholder">
          <span>Mr. Poe’s Photo</span>
          <p>
            {lang === "en"
              ? "Administrator editing note: upload Mr. Poe’s approved classroom photo here."
              : "Nota de edición: cargue aquí una foto aprobada del Sr. Poe."}
          </p>
        </div>
        <div className="teacher-copy">
          <article>
            <Placeholder lang={lang} />
            <h2>{lang === "en" ? "Meet Mr. Poe" : "Conozca al Sr. Poe"}</h2>
            <p>
              {lang === "en"
                ? "Add Mr. Poe’s teacher introduction here. Include only details he has reviewed and approved."
                : "Agregue aquí la presentación del Sr. Poe. Incluya solo detalles que él haya revisado y aprobado."}
            </p>
          </article>
          <article>
            <Placeholder lang={lang} />
            <h2>
              {lang === "en"
                ? "My Teaching Philosophy"
                : "Mi filosofía de enseñanza"}
            </h2>
            <p>
              {lang === "en"
                ? "Add Mr. Poe’s own words about how children learn and how the classroom community grows together."
                : "Agregue las propias palabras del Sr. Poe sobre cómo aprenden los niños y cómo crece la comunidad del salón."}
            </p>
          </article>
          <article>
            <Placeholder lang={lang} />
            <h2>
              {lang === "en"
                ? "Why I Love Teaching"
                : "Por qué me encanta enseñar"}
            </h2>
            <p>
              {lang === "en"
                ? "Add Mr. Poe’s personal reflection here."
                : "Agregue aquí la reflexión personal del Sr. Poe."}
            </p>
          </article>
          <article>
            <Placeholder lang={lang} />
            <h2>
              {lang === "en"
                ? "Education & Experience"
                : "Educación y experiencia"}
            </h2>
            <p>
              {lang === "en"
                ? "Add verified education and professional experience here."
                : "Agregue aquí educación y experiencia profesional verificadas."}
            </p>
          </article>
        </div>
      </section>
      <section className="section-wrap favorites">
        <div className="section-heading">
          <div>
            <span>
              {lang === "en"
                ? "GET TO KNOW YOUR TEACHER"
                : "CONOZCA A SU MAESTRO"}
            </span>
            <h2>
              {lang === "en"
                ? "A few of my favorite things"
                : "Algunas de mis cosas favoritas"}
            </h2>
          </div>
          <Placeholder lang={lang} />
        </div>
        <div>
          {favorites.map((x) => (
            <span key={x}>
              <b>{x}</b>
              <em>{lang === "en" ? "Add answer" : "Agregar respuesta"}</em>
            </span>
          ))}
        </div>
      </section>
      <section className="band">
        <div className="section-wrap">
          <span className="mini-label light">
            {lang === "en"
              ? "EDITABLE CLASSROOM EXPECTATIONS"
              : "EXPECTATIVAS EDITABLES DEL SALÓN"}
          </span>
          <h2>{lang === "en" ? "The Jaguar Way" : "La Manera Jaguar"}</h2>
          <p className="band-lead">
            {lang === "en"
              ? "These positive expectations are a starting point for Mr. Poe to review and personalize—not confirmed official policy."
              : "Estas expectativas positivas son un punto de partida para que el Sr. Poe las revise y personalice; no son una política oficial confirmada."}
          </p>
          <div className="promise-grid">
            {promises.map((x) => (
              <span key={x[1]}>
                <b>{x[0]}</b>
                {x[1]}
              </span>
            ))}
          </div>
          <div className="class-promise">
            <h3>
              {lang === "en"
                ? "Our Classroom Promise"
                : "Nuestra promesa del salón"}
            </h3>
            <p>
              {lang === "en"
                ? "We practice respect, responsibility, curiosity, kindness, effort, and growth. Mr. Poe: edit this promise with your class."
                : "Practicamos respeto, responsabilidad, curiosidad, amabilidad, esfuerzo y crecimiento. Sr. Poe: edite esta promesa con su clase."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Calendar({ lang }: { lang: Lang }) {
  const cats =
    lang === "en"
      ? [
          "No School",
          "Assessments",
          "Projects",
          "Classroom Events",
          "Family Events",
          "Field Trips",
          "School Events",
        ]
      : [
          "No hay clases",
          "Evaluaciones",
          "Proyectos",
          "Eventos del salón",
          "Eventos familiares",
          "Excursiones",
          "Eventos escolares",
        ];
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={
          lang === "en" ? "Calendar & Announcements" : "Calendario y Anuncios"
        }
      />
      <PageIntro
        kicker={lang === "en" ? "PLAN AHEAD" : "PLANIFIQUE CON TIEMPO"}
        title={
          lang === "en"
            ? "Calendar & Important Dates"
            : "Calendario y Fechas Importantes"
        }
        text={
          lang === "en"
            ? "A mobile-friendly home for confirmed classroom dates, reminders, and announcements."
            : "Un espacio móvil para fechas confirmadas, recordatorios y anuncios del salón."
        }
        icon="◷"
      />
      <section className="section-wrap calendar-empty">
        <span className="calendar-icon">◷</span>
        <Placeholder lang={lang} />
        <h2>
          {lang === "en"
            ? "No confirmed classroom dates yet"
            : "Aún no hay fechas confirmadas del salón"}
        </h2>
        <p>
          {lang === "en"
            ? "Mr. Poe can add events here later. This layout is ready for a future calendar feed without redesigning the page."
            : "El Sr. Poe puede agregar eventos aquí más adelante. Este diseño está listo para integrar un calendario en el futuro."}
        </p>
        <div className="category-legend">
          {cats.map((x, i) => (
            <span key={x}>
              <i className={`dot d${i}`} />
              {x}
            </span>
          ))}
        </div>
      </section>
      <section className="section-wrap announcements">
        <div className="section-heading">
          <div>
            <span>
              {lang === "en" ? "LATEST UPDATES" : "ÚLTIMAS NOVEDADES"}
            </span>
            <h2>{lang === "en" ? "Announcements" : "Anuncios"}</h2>
          </div>
          <Placeholder lang={lang} />
        </div>
        <div className="announcement-grid">
          {announcements.map((a, i) => (
            <article
              className={`announcement-card ${a.priority ? "priority" : ""}`}
              key={i}
            >
              <div>
                <span>{a.category[lang]}</span>
                <time>{a.date[lang]}</time>
              </div>
              <h3>{a.title[lang]}</h3>
              <p>{a.body[lang]}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function FAQ({ lang }: { lang: Lang }) {
  return (
    <>
      <Breadcrumb
        lang={lang}
        title={lang === "en" ? "Family FAQ" : "Preguntas de Familias"}
      />
      <PageIntro
        kicker={lang === "en" ? "QUICK ANSWERS" : "RESPUESTAS RÁPIDAS"}
        title={
          lang === "en" ? "Frequently Asked Questions" : "Preguntas Frecuentes"
        }
        text={
          lang === "en"
            ? "Start here for simple answers about classroom communication, learning tools, and support at home."
            : "Comience aquí para obtener respuestas sencillas sobre comunicación, herramientas y apoyo en casa."
        }
        icon="?"
      />
      <section className="section-wrap faq-list">
        {faqItems.map((f, i) => (
          <details key={f.q.en}>
            <summary>
              <span>{f.q[lang]}</span>
              <b aria-hidden="true">+</b>
            </summary>
            <div>
              <p>{f.a[lang]}</p>
              {i === 0 && (
                <a href="/families" className="text-link">
                  {lang === "en"
                    ? "Visit the Family Center"
                    : "Visitar el Centro para Familias"}{" "}
                  →
                </a>
              )}
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

function NotFound({ lang }: { lang: Lang }) {
  return (
    <section className="not-found">
      <Jaguar lang={lang} compact />
      <span>404</span>
      <h1>
        {lang === "en" ? "This trail ends here" : "Este camino termina aquí"}
      </h1>
      <p>
        {lang === "en"
          ? "Let’s head back to our classroom home."
          : "Volvamos al inicio de nuestro salón."}
      </p>
      <a className="button primary" href="/">
        {ui[lang].back}
      </a>
    </section>
  );
}

export default function ClassroomApp({
  initialPath = "/",
}: {
  initialPath?: string;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const path =
    initialPath === "/home" ? "/" : initialPath.replace(/\/$/, "") || "/";
  useEffect(() => {
    const saved = localStorage.getItem("mr-poe-language");
    if (saved === "en" || saved === "es") setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("mr-poe-language", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const nav = [
    ["/", ui[lang].nav[0]],
    ["/learn", ui[lang].nav[1]],
    ["/resources", ui[lang].nav[2]],
    ["/families", ui[lang].nav[3]],
    ["/about", ui[lang].nav[4]],
  ];
  const searchPages = useMemo(
    () => [
      [
        "/canvas",
        "Canvas",
        lang === "en"
          ? "assignments login announcements work"
          : "tareas iniciar sesión anuncios trabajo",
      ],
      [
        "/math",
        lang === "en" ? "Mathematics" : "Matemáticas",
        lang === "en"
          ? "multiplication division fractions problem solving practice"
          : "multiplicación división fracciones problemas práctica",
      ],
      [
        "/english",
        lang === "en" ? "English Language Arts" : "Artes del Lenguaje Inglés",
        lang === "en"
          ? "reading writing vocabulary fluency comprehension"
          : "lectura escritura vocabulario fluidez comprensión",
      ],
      [
        "/eld",
        lang === "en"
          ? "English Language Development"
          : "Desarrollo del Idioma Inglés",
        lang === "en"
          ? "multilingual sentence frames listening speaking"
          : "multilingüe marcos oraciones escuchar hablar",
      ],
      [
        "/families",
        lang === "en"
          ? "Family Center & ClassDojo"
          : "Centro para Familias y ClassDojo",
        lang === "en"
          ? "parents homework home attendance technology"
          : "familias tarea casa asistencia tecnología",
      ],
      [
        "/resources",
        lang === "en" ? "Educational Tools" : "Herramientas Educativas",
        lang === "en"
          ? "library research Khan reading resources"
          : "biblioteca investigación Khan lectura recursos",
      ],
      [
        "/calendar",
        lang === "en" ? "Calendar & Announcements" : "Calendario y Anuncios",
        lang === "en"
          ? "events assessments dates reminders"
          : "eventos evaluaciones fechas recordatorios",
      ],
      [
        "/faq",
        lang === "en" ? "Family FAQ" : "Preguntas de Familias",
        lang === "en"
          ? "help contact password questions"
          : "ayuda contacto contraseña preguntas",
      ],
    ],
    [lang],
  );
  const results = query.trim()
    ? searchPages.filter((x) =>
        `${x[1]} ${x[2]}`.toLowerCase().includes(query.toLowerCase()),
      )
    : searchPages;
  let page: React.ReactNode;
  if (path === "/") page = <Home lang={lang} />;
  else if (path === "/learn") page = <Learn lang={lang} />;
  else if (path === "/english" || path === "/math")
    page = (
      <SubjectPage lang={lang} subject={path.slice(1) as "english" | "math"} />
    );
  else if (path === "/eld") page = <ELD lang={lang} />;
  else if (path === "/canvas") page = <CanvasPage lang={lang} />;
  else if (path === "/resources") page = <Resources lang={lang} />;
  else if (path === "/families") page = <Families lang={lang} />;
  else if (path === "/about") page = <About lang={lang} />;
  else if (path === "/calendar") page = <Calendar lang={lang} />;
  else if (path === "/faq") page = <FAQ lang={lang} />;
  else page = <NotFound lang={lang} />;
  return (
    <main>
      <a href="#main-content" className="skip-link">
        {lang === "en" ? "Skip to content" : "Saltar al contenido"}
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label={ui[lang].brand}>
          <span className="brand-mark">J</span>
          <span>
            <strong>{ui[lang].brand}</strong>
            <small>{ui[lang].school}</small>
          </span>
        </a>
        <nav
          className="desktop-nav"
          aria-label={
            lang === "en" ? "Primary navigation" : "Navegación principal"
          }
        >
          {nav.map((n) => (
            <a href={n[0]} className={path === n[0] ? "active" : ""} key={n[0]}>
              {n[1]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="search-button"
            onClick={() => setSearchOpen(true)}
            aria-label={ui[lang].search}
          >
            ⌕<span>{ui[lang].search}</span>
          </button>
          <div className="language" role="group" aria-label="Language / Idioma">
            <button
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              className={lang === "es" ? "active" : ""}
              onClick={() => setLang("es")}
              aria-pressed={lang === "es"}
            >
              ES
            </button>
          </div>
          <a href="/families" className="dojo-button">
            ♥ <span>ClassDojo</span>
          </a>
        </div>
      </header>
      <div id="main-content">{page}</div>
      <footer>
        <div>
          <a className="footer-brand" href="/">
            <span>J</span>
            <strong>
              {lang === "en"
                ? "Mr. Poe’s 3rd Grade Classroom"
                : "Salón de 3.er grado del Sr. Poe"}
            </strong>
          </a>
          <p>
            Rogers Heights Elementary School
            <br />
            Bladensburg, Maryland
          </p>
        </div>
        <nav
          aria-label={
            lang === "en" ? "Footer navigation" : "Navegación del pie"
          }
        >
          <a href="/learn">
            {lang === "en" ? "Learning Hub" : "Centro de Aprendizaje"}
          </a>
          <a href="/canvas">Canvas</a>
          <a href="/families">ClassDojo</a>
          <a href="/calendar">{lang === "en" ? "Calendar" : "Calendario"}</a>
          <a href="/faq">FAQ</a>
          <a
            href={classroomConfig.schoolUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === "en" ? "Official school site" : "Sitio oficial"} ↗
          </a>
        </nav>
        <p className="disclaimer">{ui[lang].footer}</p>
      </footer>
      <nav
        className="bottom-nav"
        aria-label={
          lang === "en" ? "Primary navigation" : "Navegación principal"
        }
      >
        {routes.map((r, i) => (
          <a href={r[0]} className={path === r[0] ? "selected" : ""} key={r[0]}>
            <span>{r[1]}</span>
            {i === 0
              ? lang === "en"
                ? "Home"
                : "Inicio"
              : i === 1
                ? lang === "en"
                  ? "Learn"
                  : "Aprender"
                : i === 2
                  ? lang === "en"
                    ? "Resources"
                    : "Recursos"
                  : i === 3
                    ? lang === "en"
                      ? "Families"
                      : "Familias"
                    : ui[lang].more}
          </a>
        ))}
      </nav>
      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
        >
          <button
            className="overlay-close"
            onClick={() => setSearchOpen(false)}
            aria-label={lang === "en" ? "Close search" : "Cerrar búsqueda"}
          >
            ×
          </button>
          <div className="search-panel">
            <span className="mini-label">
              {lang === "en" ? "FIND IT FAST" : "ENCUÉNTRALO RÁPIDO"}
            </span>
            <h2 id="search-title">
              {lang === "en"
                ? "Search our classroom"
                : "Buscar en nuestro salón"}
            </h2>
            <label>
              <span className="sr-only">{ui[lang].search}</span>
              <b>⌕</b>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === "en"
                    ? "Try “multiplication” or “Canvas”"
                    : "Prueba “multiplicación” o “Canvas”"
                }
              />
            </label>
            <div className="search-results" aria-live="polite">
              {results.length ? (
                results.map((r) => (
                  <a href={r[0]} key={r[0]}>
                    <span>
                      <strong>{r[1]}</strong>
                      <small>{r[2]}</small>
                    </span>
                    <b>→</b>
                  </a>
                ))
              ) : (
                <div className="empty-search">
                  <span>?</span>
                  <p>
                    {lang === "en"
                      ? "No results yet. Try another classroom word."
                      : "No hay resultados. Prueba otra palabra del salón."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
