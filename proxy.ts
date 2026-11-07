import { NextResponse, type NextRequest } from "next/server";

import { buildContentSecurityPolicy, SECURITY_HEADERS } from "./lib/security-headers";

function isSensitivePath(pathname: string): boolean {
  return pathname.split("/").some((segment) => {
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return true;
    }
    return (
      decoded.startsWith(".") ||
      decoded === "node_modules" ||
      decoded.includes("..") ||
      decoded.includes("\\") ||
      decoded.includes("\0")
    );
  });
}

function applySecurityHeaders(response: NextResponse, csp?: string) {
  if (csp) response.headers.set("Content-Security-Policy", csp);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
}

export function proxy(request: NextRequest) {
  if (isSensitivePath(request.nextUrl.pathname)) {
    return applySecurityHeaders(new NextResponse(null, { status: 404 }));
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("content-security-policy", csp);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const jurisdiction = request.nextUrl.searchParams.get("jurisdiction");
  if (jurisdiction && /^[A-Z]{2}$/.test(jurisdiction)) {
    requestHeaders.set("x-cla-jurisdiction", jurisdiction);
  } else {
    requestHeaders.delete("x-cla-jurisdiction");
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  return applySecurityHeaders(response, csp);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
