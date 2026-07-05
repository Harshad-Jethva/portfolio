import { getSession } from "@/lib/auth";
import { getGlobalSettings, updateGlobalSettings } from "@/lib/portfolioRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const settings = await getGlobalSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = session.user?.role || "Viewer";
    if (role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: Viewers cannot change settings" }, { status: 403 });
    }

    const body = await request.json();
    const updated = await updateGlobalSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
