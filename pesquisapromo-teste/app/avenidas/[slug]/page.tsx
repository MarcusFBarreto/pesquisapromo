import { notFound } from "next/navigation";
import { AreaView } from "@/components/area-view";
import { getArea, getAreasByKind } from "@/lib/city-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAreasByKind("avenidas").map((area) => ({ slug: area.slug }));
}

export default async function AvenuePage({ params }: PageProps) {
  const { slug } = await params;
  const area = getArea("avenidas", slug);

  if (!area) {
    notFound();
  }

  return <AreaView area={area} />;
}
