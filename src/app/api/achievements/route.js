import { createAchievement, listAchievements } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET() {
  try {
    const items = await listAchievements();
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
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

    const achievement = await createAchievement({
      imageUrl: String(body.imageUrl).trim(),
      title: String(body.title).trim(),
      organizer: String(body.organizer).trim(),
      year: String(body.year).trim(),
      category: String(body.category).trim(),
      details: String(body.details).trim(),
      location: String(body.location).trim(),
      sortOrder: body.sortOrder,
    });
    return Response.json(achievement, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
