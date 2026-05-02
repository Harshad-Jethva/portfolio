import { getDashboardStats } from "@/lib/portfolioRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return Response.json(stats);
  } catch (error) {
    return Response.json(
      {
        projects: 0,
        skills: 0,
        achievements: 0,
        messages: 0,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
