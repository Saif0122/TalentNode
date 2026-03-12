import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";

// Basic in-memory rate limiting for registration
const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    
    // Simple rate limiting: max 5 requests per minute per IP
    const now = Date.now();
    const windowMs = 60 * 1000;
    const limitInfo = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
    
    if (now > limitInfo.resetTime) {
      limitInfo.count = 1;
      limitInfo.resetTime = now + windowMs;
    } else {
      limitInfo.count++;
    }
    rateLimitMap.set(ip, limitInfo);

    if (limitInfo.count > 5) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const validRoles = ["candidate", "recruiter", "admin"];
    const assignedRole = validRoles.includes(role) ? role : "candidate";

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      password, // Pre-save hook will hash this
      role: assignedRole,
      provider: "credentials",
    });

    return NextResponse.json(
      { 
        message: "User registered successfully",
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
