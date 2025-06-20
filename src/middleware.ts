import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/h/")) {
    const authResponse = await auth0.getSession(request);

    if (!authResponse?.session) {
      return NextResponse.redirect(new URL("/unauth", request.url));
    }
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
