import { createProject, listProjects } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET() {
  try {
    const items = await listProjects();
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const requiredFields = ["index", "title", "tech", "desc", "year", "link"];
    for (const field of requiredFields) {
      if (!body[field]) return badRequest(`${field} is required.`);
    }

    const project = await createProject({
      index: String(body.index).trim(),
      title: String(body.title).trim(),
      tech: String(body.tech).trim(),
      desc: String(body.desc).trim(),
      year: String(body.year).trim(),
      link: String(body.link).trim(),
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : "",
      sortOrder: body.sortOrder,
    });
    return Response.json(project, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
