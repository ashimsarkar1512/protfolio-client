
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";


type IDecoded = {
  email?: string;
  role?: string;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwtDecode(token) as IDecoded;
    const role = decoded?.role?.toUpperCase();
    if (role && role !== "ADMIN") {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  } catch {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*"],
};
