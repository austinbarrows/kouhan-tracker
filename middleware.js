import { NextResponse } from "next/server";

export function middleware(request) {
  // if (request.nextUrl.pathname.startsWith("/api/hello")) {
  //   return NextResponse.rewrite(new URL("/api/reroute", request.url));
  // }
}

export const config = {
  // matcher: "/api/hello",
};
