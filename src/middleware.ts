import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = [
  "/api/users/login",
  "/api/users",
  "/api/search",
  "/api/items",
  "/api/brands",
  "/api/item-types",
];

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized - Missing Token" },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
