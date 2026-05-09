"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductClientProps {
  product: any;
  categories: { id: string; name: string }[];
}

export function EditProductClient({ product, categories }: EditProductClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update product");
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <ProductForm
      categories={categories}
      initialData={{
        name: product.name,
        description: product.description,
        price: Number(product.price),
        categoryId: product.categoryId,
        previewUrl: product.previewUrl,
        isPublished: product.isPublished,
      }}
      onSubmit={handleSubmit}
      submitLabel="Update Product"
    />
  );
}
