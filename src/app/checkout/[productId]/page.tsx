import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

interface Props {
  params: { productId: string };
}

export const metadata: Metadata = {
  title: "Checkout — Pastels",
  description: "Complete your purchase securely via Safepay.",
};

export default async function CheckoutPage({ params }: Props) {
  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { id: params.productId, isPublished: true },
      include: { category: true },
    });
  } catch (e) {}

  if (!product) {
    notFound();
  }

  return <CheckoutClient product={JSON.parse(JSON.stringify(product))} />;
}
