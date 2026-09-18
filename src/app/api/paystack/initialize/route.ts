import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import {
  initializeTransaction,
  PLAN_AMOUNTS,
} from "@/lib/paystack";
import { ensureDbInit } from "@/lib/api-init";

export async function POST(request: Request) {
  try {
    await ensureDbInit();
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body; // "pro" or "business"

    if (!plan || !PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS]) {
      return NextResponse.json(
        { error: "Invalid plan. Choose 'pro' or 'business'" },
        { status: 400 }
      );
    }

    const amount = PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS];

    const result = await initializeTransaction({
      email: user.email,
      amount,
      plan,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({
      authorization_url: result.data?.authorization_url,
      reference: result.data?.reference,
    });
  } catch (error) {
    console.error("Paystack initialize route error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
