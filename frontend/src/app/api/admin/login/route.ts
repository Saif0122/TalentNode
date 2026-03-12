import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured on the server." },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      // Create a JWT for NextAuth using jose since jsonwebtoken is not edge-compatible by default
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret_change_me");
      const token = await new SignJWT({
        name: "Super Admin",
        email: adminEmail,
        role: "admin",
        id: "static_admin_id",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      // Set cookie directly matching NextAuth default cookie name
      const cookieName = process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token";
      
      const cookieStore = await cookies();
      cookieStore.set(cookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ message: "Admin authenticated" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  } catch (error) {
     console.error("Admin login error:", error);
     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
