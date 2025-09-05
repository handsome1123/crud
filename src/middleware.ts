import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define protected routes
  const authRequired = ["/account", "/seller", "/admin"];

  // If route is not protected → allow
  if (!authRequired.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify JWT
    const decoded = await jose.jwtVerify(token, secret);
    const payload = decoded.payload as { id: string; role: string };

    // Role-based protection
    if (pathname.startsWith("/seller") && payload.role !== "seller" && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Allow access
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/account/:path*", "/seller/:path*", "/admin/:path*"],
};
