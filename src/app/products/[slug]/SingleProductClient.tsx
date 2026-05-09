"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Download, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface SingleProductClientProps {
  product: any;
  hasPurchased: boolean;
  orderId: string | null;
}

export function SingleProductClient({
  product,
  hasPurchased,
  orderId,
}: SingleProductClientProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!orderId) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/download/${orderId}`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(data.error || "Download failed");
      }
    } catch {
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container-main">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Templates
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-up">
          {/* Preview Image */}
          <div className="card overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={product.previewUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="badge badge-accent mb-4">
              {product.category.name}
            </span>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">
              {product.name}
            </h1>

            <p className="text-[var(--muted)] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-display font-extrabold text-3xl text-[var(--accent2)]">
                Rs. {Number(product.price).toLocaleString()}
              </span>
              <span className="text-sm text-[var(--muted)] font-mono">PKR</span>
            </div>

            {/* Action */}
            {hasPurchased ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent3)]">
                  <CheckCircle size={18} />
                  <span className="font-display font-bold text-sm">
                    You own this product
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-primary w-full sm:w-auto !py-3 !px-8"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download
                    </>
                  )}
                </button>
              </div>
            ) : (
              <Link
                href={`/checkout/${product.id}`}
                className="btn-primary w-full sm:w-auto !py-3 !px-8 text-base"
              >
                <ShoppingCart size={18} />
                Buy Now
              </Link>
            )}

            {/* Features */}
            <div className="mt-10 space-y-3">
              <h3 className="section-label">What You Get</h3>
              <ul className="space-y-2 mt-3">
                {[
                  "Fully editable Canva template",
                  "Instant digital download",
                  "24-hour access window",
                  "High-resolution files",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-[var(--muted)]"
                  >
                    <CheckCircle
                      size={14}
                      className="text-[var(--accent3)] flex-shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
