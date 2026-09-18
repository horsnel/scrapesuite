import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { ensureDbInit } from "@/lib/api-init";
import { randomBytes } from "crypto";

function generateApiKey(): string {
  const bytes = randomBytes(24).toString("hex");
  return `ss_live_${bytes}`;
}

export async function GET(request: Request) {
  try {
    await ensureDbInit();
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKeys = await db.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsed: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Return both masked and hidden versions for the eye toggle
    const processedKeys = apiKeys.map((k) => {
      const prefix = k.key.slice(0, 7); // "ss_live"
      const suffix = k.key.slice(-4);
      return {
        id: k.id,
        name: k.name,
        keyMasked: prefix + "••••••••••••••••••••" + suffix, // hidden: ss_live••••••••••••xyz9
        keyVisible: k.key.slice(0, 15) + "..." + suffix, // visible: ss_live_abc1d2...xyz9
        lastUsed: k.lastUsed,
        createdAt: k.createdAt,
      };
    });

    return NextResponse.json({ keys: processedKeys });
  } catch (error) {
    console.error("Get keys error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbInit();
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name || "New Key";
    const key = generateApiKey();

    const apiKey = await db.apiKey.create({
      data: {
        name,
        key,
        userId: user.id,
      },
    });

    return NextResponse.json({
      key: apiKey,
      // Return full key only on creation
      fullKey: apiKey.key,
    });
  } catch (error) {
    console.error("Create key error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureDbInit();
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json(
        { error: "Key ID is required" },
        { status: 400 }
      );
    }

    const key = await db.apiKey.findFirst({
      where: { id: keyId, userId: user.id },
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await db.apiKey.delete({ where: { id: keyId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete key error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
