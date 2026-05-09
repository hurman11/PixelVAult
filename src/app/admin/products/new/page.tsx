import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { NewProductClient } from "./NewProductClient";

export default async function NewProductPage() {
  let categories: any[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (e) {}

  return (
    <div>
      <div className="mb-8">
        <span className="section-label">Products</span>
        <h1 className="font-display font-extrabold text-2xl mt-1">
          Add New Product
        </h1>
      </div>

      <div className="max-w-2xl">
        <div className="card p-6">
          <NewProductClient
            categories={JSON.parse(JSON.stringify(categories))}
          />
        </div>
      </div>
    </div>
  );
}
