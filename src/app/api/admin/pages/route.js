import { getSession } from "@/lib/auth";
import { listPages, createPage, updatePage, deletePage } from "@/lib/portfolioRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const pages = await listPages();
    return NextResponse.json({ pages });
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
    if (role === "Viewer" || role === "Content Manager") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    
    if (body.action === "sync_composition") {
      const { pageId, sections } = body;
      if (!pageId) {
        return NextResponse.json({ error: "pageId is required" }, { status: 400 });
      }

      const { withTransaction } = await import("@/lib/portfolioRepository");
      const { query } = await import("@/lib/postgres");

      await withTransaction(async (client) => {
        // Delete all old sections (will cascade delete old widgets)
        await client.query("DELETE FROM sections WHERE page_id = $1;", [pageId]);

        // Insert new sections and widgets
        for (const [secIdx, sec] of sections.entries()) {
          const secResult = await client.query(
            `
              INSERT INTO sections (page_id, name, sort_order, is_hidden, is_locked, is_global, template_name)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING id;
            `,
            [
              pageId,
              sec.name,
              secIdx,
              sec.isHidden || false,
              sec.isLocked || false,
              sec.isGlobal || false,
              sec.templateName || null
            ]
          );
          const newSecId = secResult.rows[0].id;

          if (sec.widgets && Array.isArray(sec.widgets)) {
            for (const [widIdx, wid] of sec.widgets.entries()) {
              await client.query(
                `
                  INSERT INTO widgets (section_id, type, content, style, layout, animation, visibility, sort_order)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
                [
                  newSecId,
                  wid.type,
                  JSON.stringify(wid.content || {}),
                  JSON.stringify(wid.style || {}),
                  JSON.stringify(wid.layout || {}),
                  JSON.stringify(wid.animation || {}),
                  JSON.stringify(wid.visibility || {}),
                  widIdx
                ]
              );
            }
          }
        }
      });

      try {
        const { createPageRevision, logAuditEvent } = await import("@/lib/portfolioRepository");
        await createPageRevision(Number(pageId), sections, "Auto-saved Visual Builder sync state");
        await logAuditEvent("save_layout", "page", pageId);
      } catch (logErr) {
        console.error("Failed revision log:", logErr);
      }

      return NextResponse.json({ success: true });
    }

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const page = await createPage(body);
    return NextResponse.json(page, { status: 201 });
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
    if (role === "Viewer" || role === "Content Manager") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions to update pages" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const page = await updatePage(body.id, body);
    return NextResponse.json(page);
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
    if (role !== "Super Admin" && role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions to delete pages" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const success = await deletePage(Number(id));
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
