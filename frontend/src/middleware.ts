import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
     
    // Auth redirect - reverse proxy logic
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // RBAC Redirects
    const pathname = req.nextUrl.pathname;
    const role = token?.role;

    // Admin pages
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Recruiter pages 
    if (pathname.startsWith("/dashboard/recruiter") && !["admin", "recruiter"].includes(role as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Candidate pages
    if (pathname.startsWith("/dashboard/candidate") && !["admin", "candidate"].includes(role as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }: { token: JWT | null, req: any }) => {
         const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
         if (isAuthPage) return true; // Let the middleware handler redirect if they are already logged in

         // Require token for everything matched in config matcher
         return !!token; 
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
