import { deleteProject, updateProject } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

function parseId(id) {
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const numericId = parseId(id);
    if (!numericId) return badRequest("Invalid id.");

    const body = await request.json();
    const requiredFields = ["index", "title", "tech", "desc", "year", "link"];
    for (const field of requiredFields) {
      if (!body[field]) return badRequest(`${field} is required.`);
    }

    const updated = await updateProject(numericId, {
      index: String(body.index).trim(),
      title: String(body.title).trim(),
      tech: String(body.tech).trim(),
      desc: String(body.desc).trim(),
      year: String(body.year).trim(),
      link: String(body.link).trim(),
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : "",
      sortOrder: body.sortOrder,
    });

    if (!updated) {
      return Response.json({ error: "Project not found." }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  try {
    const { id } = await context.params;
    const numericId = parseId(id);
    if (!numericId) return badRequest("Invalid id.");

    const deleted = await deleteProject(numericId);
    if (!deleted) {
      return Response.json({ error: "Project not found." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
