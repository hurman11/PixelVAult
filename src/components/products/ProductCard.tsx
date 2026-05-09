"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  previewUrl: string;
  categoryName: string;
  index?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  previewUrl,
  categoryName,
  index = 0,
}: ProductCardProps) {
  return (
    <div
      className={`card overflow-hidden opacity-0 animate-fade-up stagger-${
        (index % 8) + 1
      }`}
    >
      {/* Preview Image */}
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
          <Image
            src={previewUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="badge badge-accent mb-2">{categoryName}</span>

        {/* Name */}
        <Link href={`/products/${slug}`}>
          <h3 className="font-display font-bold text-[var(--text)] text-sm mt-1 hover:text-[var(--accent)] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-3">
          <span className="font-mono text-[var(--accent2)] font-medium text-sm">
            Rs. {price.toLocaleString()}
          </span>
        </div>

        <Link
          href={`/checkout/${id}`}
          className="btn-primary w-full mt-3 text-sm"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4">
        <div className="h-5 w-20 skeleton mb-2" />
        <div className="h-5 w-full skeleton mb-3" />
        <div className="h-4 w-24 skeleton mb-3" />
        <div className="h-10 w-full skeleton" />
      </div>
    </div>
  );
}
