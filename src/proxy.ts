import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@/utils/supabase/middleware";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  // Update Supabase session
  let response = await createClient(request);

  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });
      return response;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If already logged in, redirect away from login page
  if (pathname === "/login") {
    const session = request.cookies.get("session")?.value;
    if (session) {
      try {
        await jwtVerify(session, key, {
          algorithms: ["HS256"],
        });
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch (error) {
        // Invalid session, allow login
      }
    }
  }

  return response;
}


export const config = {
  matcher: ["/admin/:path*", "/login"],
};
