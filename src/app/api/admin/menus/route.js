import { getSession } from "@/lib/auth";
import { listMenus, createMenu, deleteMenu, listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getMenuStructure } from "@/lib/portfolioRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const menuId = searchParams.get("menuId");

    if (location) {
      const items = await getMenuStructure(location);
      return NextResponse.json({ items });
    }

    if (menuId) {
      const items = await listMenuItems(Number(menuId));
      return NextResponse.json({ items });
    }

    const menus = await listMenus();
    return NextResponse.json({ menus });
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
    if (body.type === "item") {
      if (!body.menuId || !body.label || !body.url) {
        return NextResponse.json({ error: "menuId, label, and url are required" }, { status: 400 });
      }
      const item = await createMenuItem(body);
      return NextResponse.json(item, { status: 201 });
    }

    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const menu = await createMenu(body);
    return NextResponse.json(menu, { status: 201 });
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.id || !body.label || !body.url) {
      return NextResponse.json({ error: "id, label, and url are required" }, { status: 400 });
    }
    const item = await updateMenuItem(body.id, body);
    return NextResponse.json(item);
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // menu or item

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (type === "item") {
      const success = await deleteMenuItem(Number(id));
      return NextResponse.json({ success });
    }

    const success = await deleteMenu(Number(id));
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
