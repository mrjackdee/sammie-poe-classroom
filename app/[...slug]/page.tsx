import ClassroomApp from "../ClassroomApp";

export default async function ClassroomRoute({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}) {
  const resolved = await params;
  return <ClassroomApp initialPath={`/${resolved.slug.join("/")}`} />;
}
