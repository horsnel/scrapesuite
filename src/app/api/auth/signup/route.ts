import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { ensureDbInit } from "@/lib/api-init";
import { randomBytes } from "crypto";

function generateApiKey(): string {
  const bytes = randomBytes(24).toString("hex");
  return `ss_live_${bytes}`;
}

export async function POST(request: Request) {
  try {
    await ensureDbInit();
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        plan: "free",
      },
    });

    // Create default API key
    await db.apiKey.create({
      data: {
        name: "Default Key",
        key: generateApiKey(),
        userId: user.id,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    });

    response.cookies.set("scrapesuite_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
