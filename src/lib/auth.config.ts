import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — NO Node.js modules (no prisma, no bcrypt, no pg).
 * Used by middleware. The Credentials provider authorize function
 * lives in auth.ts (Node.js runtime only).
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "USER" | "ADMIN";
    };
  }
}

export const authConfig = {
  providers: [], // Providers added in auth.ts (needs Node.js runtime)
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "USER" | "ADMIN";
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      // This runs in the middleware (Edge Runtime)
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Admin routes
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (!isLoggedIn) return false;
        const role = (auth?.user as any)?.role;
        if (role !== "ADMIN") return false;
        return true;
      }

      // Protected routes
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/download")) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
