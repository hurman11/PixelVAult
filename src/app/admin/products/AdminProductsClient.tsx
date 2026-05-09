"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface AdminProductsClientProps {
  products: any[];
}

export function AdminProductsClient({ products }: AdminProductsClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Preview</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-[var(--muted)] py-8">
                No products yet. Add your first product!
              </td>
            </tr>
          ) : (
            products.map((product: any) => (
              <tr key={product.id}>
                <td>
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[var(--surface)]">
                    <Image
                      src={product.previewUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="font-display font-bold text-sm">
                  {product.name}
                </td>
                <td>
                  <span className="badge badge-accent text-[0.55rem]">
                    {product.category.name}
                  </span>
                </td>
                <td className="font-mono text-sm text-[var(--accent2)]">
                  Rs. {Number(product.price).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      product.isPublished ? "badge-success" : "badge-warning"
                    } text-[0.55rem]`}
                  >
                    {product.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                    >
                      <Pencil size={14} className="text-[var(--accent)]" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent4)] transition-colors"
                    >
                      {deletingId === product.id ? (
                        <Loader2
                          size={14}
                          className="text-[var(--accent4)] animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={14}
                          className="text-[var(--accent4)]"
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
