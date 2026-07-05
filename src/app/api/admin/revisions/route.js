import { getSession } from "@/lib/auth";
import { listPageRevisions, createPageRevision, logAuditEvent } from "@/lib/portfolioRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");
    if (!pageId) {
      return NextResponse.json({ error: "pageId is required" }, { status: 400 });
    }

    const revisions = await listPageRevisions(Number(pageId));
    return NextResponse.json({ revisions });
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { pageId, composition, comment } = body;
    if (!pageId || !composition) {
      return NextResponse.json({ error: "pageId and composition are required" }, { status: 400 });
    }

    const rev = await createPageRevision(Number(pageId), composition, comment);
    await logAuditEvent("create_revision", "page_revision", rev.id);
    return NextResponse.json(rev, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
