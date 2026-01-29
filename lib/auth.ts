import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("JWT_SECRET is required in production");
      })()
    : "your-secret-key");

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export function verifyAuth(request: NextRequest): AuthPayload | null {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export function requireAuth(
  handler: (
    request: NextRequest,
    auth: AuthPayload
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return handler(request, auth);
  };
}

export function requireAdmin(
  handler: (
    request: NextRequest,
    auth: AuthPayload
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (auth.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    return handler(request, auth);
  };
}
