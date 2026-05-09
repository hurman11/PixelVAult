import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminProductsClient } from "./AdminProductsClient";

export default async function AdminProductsPage() {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {}

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-label">Management</span>
          <h1 className="font-display font-extrabold text-2xl mt-1">
            Products
          </h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <AdminProductsClient products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
