# Sammie Poe Classroom

A polished, mobile-first bilingual classroom hub for Mr. Sammie Poe’s third-grade students and families at Rogers Heights Elementary School.

## Highlights

- Complete English and Spanish experiences
- Immersive Jaguar learning worlds with accessible motion
- Student learning hubs for English, mathematics, and ELD
- Canvas and ClassDojo guidance with editable link placeholders
- Family Center, resources, calendar, announcements, FAQ, and teacher profile
- Responsive navigation for phones, tablets, Chromebooks, and desktops
- Reduced-motion support and keyboard-accessible interactions

## Deploy on Vercel

1. In Vercel, choose **Add New → Project**.
2. Import the **Sammie Poe Classroom** GitHub repository.
3. Keep the detected framework as **Next.js** and the project root as `./`.
4. Select **Deploy**. No environment variables are required.

Vercel will use:

- Build command: `npm run build`
- Output: Next.js default
- Install command: `npm install`

## Classroom updates

Recurring content and editable URLs are centralized in `app/classroom-data.ts`. Add Mr. Poe’s confirmed Canvas link, ClassDojo link, teacher photo, weekly learning goals, announcements, calendar events, and approved biography there without redesigning the interface.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
