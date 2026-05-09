import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SingleProductClient } from "./SingleProductClient";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {}

  if (!product) {
    return { title: "Product Not Found — Pastels" };
  }

  return {
    title: `${product.name} — Pastels`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  let product: any = null;
  let hasPurchased = false;
  let orderId: string | null = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug, isPublished: true },
      include: { category: true },
    });
  } catch (e) {}

  if (!product) {
    notFound();
  }

  // Check if current user has purchased this
  try {
    const session = await auth();
    if (session?.user?.id) {
      const order = await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          productId: product.id,
          status: "PAID",
        },
      });
      if (order) {
        hasPurchased = true;
        orderId = order.id;
      }
    }
  } catch (e) {}

  return (
    <SingleProductClient
      product={JSON.parse(JSON.stringify(product))}
      hasPurchased={hasPurchased}
      orderId={orderId}
    />
  );
}
