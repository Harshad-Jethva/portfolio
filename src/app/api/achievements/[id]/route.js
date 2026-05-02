import { deleteAchievement, updateAchievement } from "@/lib/portfolioRepository";

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
    const requiredFields = [
      "imageUrl",
      "title",
      "organizer",
      "year",
      "category",
      "details",
      "location",
    ];
    for (const field of requiredFields) {
      if (!body[field]) return badRequest(`${field} is required.`);
    }

    const updated = await updateAchievement(numericId, {
      imageUrl: String(body.imageUrl).trim(),
      title: String(body.title).trim(),
      organizer: String(body.organizer).trim(),
      year: String(body.year).trim(),
      category: String(body.category).trim(),
      details: String(body.details).trim(),
      location: String(body.location).trim(),
      sortOrder: body.sortOrder,
    });

    if (!updated) {
      return Response.json({ error: "Achievement not found." }, { status: 404 });
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

    const deleted = await deleteAchievement(numericId);
    if (!deleted) {
      return Response.json({ error: "Achievement not found." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
