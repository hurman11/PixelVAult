"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Please select a category"),
  previewUrl: z.string().url("Valid image URL required"),
  isPublished: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    previewUrl: string;
    isPublished: boolean;
  };
  onSubmit: (data: ProductFormData & { previewUrl: string }) => Promise<void>;
  submitLabel: string;
}

export function ProductForm({
  categories,
  initialData,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState(initialData?.previewUrl || "");
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || "",
      isPublished: initialData?.isPublished || false,
    },
  });

  const handleFileUpload = async (file: File) => {
    setUploadingPreview(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "preview");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setPreviewUrl(data.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingPreview(false);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    if (!previewUrl) {
      alert("Please upload a preview image");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...data, previewUrl });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="section-label block mb-2">Product Name</label>
        <input
          {...register("name")}
          className={`input ${errors.name ? "input-error" : ""}`}
          placeholder="e.g., Custom Business Website"
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="section-label block mb-2">Description</label>
        <textarea
          {...register("description")}
          className={`input min-h-[120px] resize-y ${
            errors.description ? "input-error" : ""
          }`}
          placeholder="Describe your product or service..."
        />
        {errors.description && (
          <p className="error-text">{errors.description.message}</p>
        )}
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="section-label block mb-2">Price (PKR)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className={`input ${errors.price ? "input-error" : ""}`}
            placeholder="e.g., 500"
          />
          {errors.price && <p className="error-text">{errors.price.message}</p>}
        </div>

        <div>
          <label className="section-label block mb-2">Category</label>
          <select
            {...register("categoryId")}
            className={`input ${errors.categoryId ? "input-error" : ""}`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="error-text">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      {/* Preview Image Upload */}
      <div>
        <label className="section-label block mb-2">Preview Image</label>
        <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--accent)] transition-colors">
          {previewUrl ? (
            <div className="space-y-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg"
              />
              <label className="btn-secondary text-xs cursor-pointer inline-block">
                Change Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer block">
              {uploadingPreview ? (
                <Loader2 className="w-8 h-8 mx-auto text-[var(--accent)] animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-[var(--muted)] mb-2" />
              )}
              <p className="text-sm text-[var(--muted)]">
                {uploadingPreview ? "Uploading..." : "Click to upload preview image"}
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          {...register("isPublished")}
          className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
        />
        <label htmlFor="isPublished" className="text-sm text-[var(--text)]">
          Published (visible to customers)
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
