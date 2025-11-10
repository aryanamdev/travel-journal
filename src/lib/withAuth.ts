// src/lib/withAuth.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

type UserPayload = { userId: string };

// naive cookie parser (small, zero-deps)
function parseCookies(cookieHeader: string | null) {
  const map: Record<string, string> = {};
  if (!cookieHeader) return map;
  cookieHeader.split(";").forEach((pair) => {
    const [k, ...v] = pair.split("=");
    if (!k) return;
    const key = decodeURIComponent(k.trim());
    const val = decodeURIComponent(v.join("=").trim());
    map[key] = val;
  });
  return map;
}

/**
 * Handler signature: (req: Request, user: { userId }) => Promise<Response | NextResponse>
 */
export function withAuth(handler: (req: Request, user: UserPayload) => Promise<Response | NextResponse>) {
  return async (req: Request) => {
    try {
      // Read cookie header
      const cookieHeader = req.headers.get("cookie");
      const cookies = parseCookies(cookieHeader);
      const token = cookies["token"];

      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      } catch (err) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
      }

      // Call actual handler with authenticated user
      return await handler(req, { userId: decoded.userId });
    } catch (err) {
      // Fallback error handling
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
}
