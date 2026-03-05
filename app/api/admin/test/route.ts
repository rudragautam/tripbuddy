import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoded: any = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }

  if (decoded.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Forbidden - Admin only" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Welcome Admin 🎉",
    userId: decoded.userId,
  });
}