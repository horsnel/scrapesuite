import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const webhookSecret =
      process.env.PAYSTACK_WEBHOOK_SECRET || "whsec_default";
    const expectedSignature = crypto
      .createHmac("sha512", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "subscription.create": {
        const { customer, plan } = event.data;
        const user = await db.user.findFirst({
          where: { email: customer.email },
        });
        if (user) {
          await db.subscription.upsert({
            where: { userId: user.id },
            update: {
              status: "active",
              paystackCode: event.data.subscription_code,
              paystackEmail: customer.email,
              plan: plan.plan_code,
            },
            create: {
              userId: user.id,
              status: "active",
              paystackCode: event.data.subscription_code,
              paystackEmail: customer.email,
              plan: plan.plan_code,
            },
          });
        }
        break;
      }

      case "charge.success": {
        const { customer, metadata } = event.data;
        const userId = metadata?.userId;
        const plan = metadata?.plan;
        if (userId && plan) {
          await db.user.update({
            where: { id: userId },
            data: { plan },
          });
        }
        break;
      }

      case "subscription.disable": {
        const { customer } = event.data;
        const user = await db.user.findFirst({
          where: { email: customer.email },
        });
        if (user) {
          await db.subscription.update({
            where: { userId: user.id },
            data: { status: "cancelled" },
          });
          await db.user.update({
            where: { id: user.id },
            data: { plan: "free" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
