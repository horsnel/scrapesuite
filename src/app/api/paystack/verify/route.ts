import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(reference);

    if (!result.data || result.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const metadata = result.data.metadata;
    const userId = metadata?.userId as string;
    const plan = metadata?.plan as string;

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "Invalid payment metadata" },
        { status: 400 }
      );
    }

    // Update user plan
    await db.user.update({
      where: { id: userId },
      data: { plan },
    });

    // Update or create subscription
    const existingSub = await db.subscription.findUnique({
      where: { userId },
    });

    if (existingSub) {
      await db.subscription.update({
        where: { userId },
        data: {
          plan,
          status: "active",
          paystackEmail: result.data.customer?.email,
          currentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });
    } else {
      await db.subscription.create({
        data: {
          userId,
          plan,
          status: "active",
          paystackEmail: result.data.customer?.email,
          currentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    return NextResponse.json({
      success: true,
      plan,
      message: "Payment verified and plan updated",
    });
  } catch (error) {
    console.error("Paystack verify route error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
