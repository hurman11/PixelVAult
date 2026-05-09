import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSafepaySession } from "@/lib/safepay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isPublished) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if already purchased
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        productId: product.id,
        status: "PAID",
      },
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: "You already own this product" },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        status: "PENDING",
        gateway: "SAFEPAY",
      },
    });

    // Create Safepay session
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const safepaySession = await createSafepaySession({
      amount: Number(product.price),
      orderId: order.id,
      successUrl: `${baseUrl}/checkout/success?order_id=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/${product.id}`,
    });

    // Update order with session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { sessionId: safepaySession.token },
    });

    return NextResponse.json({
      redirectUrl: safepaySession.redirect_url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
