"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

interface NewProductClientProps {
  categories: { id: string; name: string }[];
}

export function NewProductClient({ categories }: NewProductClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create product");
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <ProductForm
      categories={categories}
      onSubmit={handleSubmit}
      submitLabel="Create Product"
    />
  );
}
