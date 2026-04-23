import createMiddleware from "next-intl/middleware";
import { routing } from "@/src/i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/(id|en)/:path*",
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"
  ],
};