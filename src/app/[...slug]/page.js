import { getPageComposition } from "@/lib/portfolioRepository";
import WidgetRenderer from "@/components/builder/WidgetRenderer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  const composition = await getPageComposition(slugPath);
  if (!composition) return {};

  const { page } = composition;
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || "",
    keywords: page.keywords || "",
    alternates: {
      canonical: page.canonicalUrl || `/${slugPath}`,
    },
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || "",
      images: page.ogImage ? [{ url: page.ogImage }] : [],
    },
    robots: page.robotsMeta || "index, follow",
  };
}

export default async function DynamicBuilderPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  const composition = await getPageComposition(slugPath);

  if (!composition) {
    return notFound();
  }

  const { page, sections } = composition;

  // If page is a draft and not being previewed, throw notFound
  const isPreview = resolvedSearchParams.preview === "true";
  if (page.status === "draft" && !isPreview) {
    return notFound();
  }

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {sections.map((sec) => {
        if (sec.isHidden) return null;
        return (
          <section key={sec.id} id={`section-${sec.id}`}>
            {sec.widgets && sec.widgets.map((widget) => (
              <WidgetRenderer key={widget.id} widget={widget} />
            ))}
          </section>
        );
      })}
    </main>
  );
}
