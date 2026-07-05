import { getSession } from "@/lib/auth";
import { listWidgets, createWidget, updateWidget, deleteWidget, withTransaction } from "@/lib/portfolioRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("sectionId");
    if (!sectionId) {
      return NextResponse.json({ error: "sectionId is required" }, { status: 400 });
    }
    const widgets = await listWidgets(Number(sectionId));
    return NextResponse.json({ widgets });
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
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.sectionId || !body.type) {
      return NextResponse.json({ error: "sectionId and type are required" }, { status: 400 });
    }

    const widget = await createWidget(body);
    return NextResponse.json(widget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = session.user?.role || "Viewer";
    if (role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    if (body.reorder && Array.isArray(body.reorder)) {
      // Expect array of { id, sortOrder }
      await withTransaction(async (client) => {
        for (const item of body.reorder) {
          await client.query(
            "UPDATE widgets SET sort_order = $1 WHERE id = $2;",
            [item.sortOrder, item.id]
          );
        }
      });
      return NextResponse.json({ success: true });
    }

    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const widget = await updateWidget(body.id, body);
    return NextResponse.json(widget);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = session.user?.role || "Viewer";
    if (role === "Viewer") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const success = await deleteWidget(Number(id));
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
