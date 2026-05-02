import { deleteSkill, updateSkill } from "@/lib/portfolioRepository";

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
    if (!body.category || !body.name) {
      return badRequest("category and name are required.");
    }

    const updated = await updateSkill(numericId, {
      category: String(body.category).trim(),
      name: String(body.name).trim(),
      sortOrder: body.sortOrder,
    });

    if (!updated) {
      return Response.json({ error: "Skill not found." }, { status: 404 });
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

    const deleted = await deleteSkill(numericId);
    if (!deleted) {
      return Response.json({ error: "Skill not found." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
