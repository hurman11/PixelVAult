import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsPageClient } from "./ProductsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Templates — PixelVault",
  description:
    "Explore our collection of premium Canva templates and digital assets. Filter by category and find the perfect template for your project.",
};

export default async function ProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (e) {
    // DB not connected
  }

  return (
    <ProductsPageClient
      products={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
