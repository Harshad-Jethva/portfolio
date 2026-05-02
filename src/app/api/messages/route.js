import { createContactMessage, listContactMessages } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET() {
  try {
    const items = await listContactMessages();
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return badRequest("name, email, and message are required.");
    }

    const message = await createContactMessage({
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      message: String(body.message).trim(),
    });
    return Response.json(message, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
