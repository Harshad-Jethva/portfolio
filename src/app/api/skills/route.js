import { createSkill, listSkillGroups, listSkills } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET() {
  try {
    const [items, groups] = await Promise.all([listSkills(), listSkillGroups()]);
    return Response.json({ items, groups });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.category || !body.name) {
      return badRequest("category and name are required.");
    }

    const skill = await createSkill({
      category: String(body.category).trim(),
      name: String(body.name).trim(),
      sortOrder: body.sortOrder,
    });

    return Response.json(skill, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
