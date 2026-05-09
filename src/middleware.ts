import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware uses only the edge-compatible auth config.
 * It reads JWT from cookies and checks the `authorized` callback —
 * no database calls, no Node.js crypto modules.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/download/:path*",
  ],
};
