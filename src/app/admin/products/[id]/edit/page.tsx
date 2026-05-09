import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { EditProductClient } from "./EditProductClient";

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  let product: any = null;
  let categories: any[] = [];

  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id: params.id },
        include: { category: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (e) {}

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <span className="section-label">Products</span>
        <h1 className="font-display font-extrabold text-2xl mt-1">
          Edit Product
        </h1>
      </div>

      <div className="max-w-2xl">
        <div className="card p-6">
          <EditProductClient
            product={JSON.parse(JSON.stringify(product))}
            categories={JSON.parse(JSON.stringify(categories))}
          />
        </div>
      </div>
    </div>
  );
}
