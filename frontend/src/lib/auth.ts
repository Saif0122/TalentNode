import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function requireAuth(req?: NextRequest) {
  if (req) {
    const token = await getToken({ req });
    if (!token) {
      throw new Error("Unauthorized");
    }
    return token;
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireRole(role: string | string[], req?: NextRequest) {
  const user = await requireAuth(req);
  
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes((user as any).role)) {
    throw new Error("Forbidden");
  }
  
  return user;
}
