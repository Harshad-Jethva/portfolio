import { deleteContactMessage } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

function parseId(id) {
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function DELETE(_request, context) {
  try {
    const { id } = await context.params;
    const numericId = parseId(id);
    if (!numericId) return badRequest("Invalid id.");

    const deleted = await deleteContactMessage(numericId);
    if (!deleted) {
      return Response.json({ error: "Message not found." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
