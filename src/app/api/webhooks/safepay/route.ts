import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySafepayWebhook } from "@/lib/safepay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-sfpy-signature") || "";

    // Verify webhook signature
    const isValid = verifySafepayWebhook(body, signature);
    if (!isValid) {
      console.error("Invalid Safepay webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const { tracker, event_type } = payload.data || payload;

    if (event_type === "payment:created" || event_type === "payment.succeeded") {
      // Find order by session/tracker token
      const order = await prisma.order.findFirst({
        where: { sessionId: tracker },
      });

      if (!order) {
        console.error("Order not found for tracker:", tracker);
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      // Update order status to PAID
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });

      console.log(`Order ${order.id} marked as PAID`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
