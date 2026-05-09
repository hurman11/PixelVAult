"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Shield, Loader2, ArrowLeft } from "lucide-react";

interface CheckoutClientProps {
  product: any;
}

export function CheckoutClient({ product }: CheckoutClientProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!session) {
      window.location.href = `/login?callbackUrl=/checkout/${product.id}`;
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/safepay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Payment initialization failed");
        return;
      }

      // Redirect to Safepay
      window.location.href = data.redirectUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container-main max-w-2xl">
        <Link
          href={`/products`}
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Templates
        </Link>

        <div className="animate-fade-up">
          <span className="section-label">Checkout</span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2 mb-8">
            Order Summary
          </h1>
        </div>

        <div className="card p-6 animate-fade-up">
          {/* Product Summary */}
          <div className="flex gap-4 pb-6 border-b border-[var(--border)]">
            <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
              <Image
                src={product.previewUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="badge badge-accent text-[0.55rem]">
                {product.category.name}
              </span>
              <h3 className="font-display font-bold text-sm mt-1 truncate">
                {product.name}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="py-6 border-b border-[var(--border)] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="font-mono">
                Rs. {Number(product.price).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Processing Fee</span>
              <span className="font-mono text-[var(--accent3)]">Free</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between py-6 border-b border-[var(--border)]">
            <span className="font-display font-bold">Total</span>
            <span className="font-display font-extrabold text-xl text-[var(--accent2)]">
              Rs. {Number(product.price).toLocaleString()}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-[var(--accent4)]/10 border border-[var(--accent4)]/20 rounded-lg">
              <p className="text-sm text-[var(--accent4)] font-mono">{error}</p>
            </div>
          )}

          {/* Pay Button */}
          <div className="mt-6">
            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-primary w-full !py-3.5 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay with Safepay
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[var(--muted)]">
              <Shield size={14} className="text-[var(--accent3)]" />
              <span>Secure payment powered by Safepay</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 text-center animate-fade-up">
          <p className="section-label mb-3">Accepted Payment Methods</p>
          <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted)]">
            <span>Visa</span>
            <span className="text-[var(--border)]">•</span>
            <span>Mastercard</span>
            <span className="text-[var(--border)]">•</span>
            <span>Easypaisa</span>
            <span className="text-[var(--border)]">•</span>
            <span>JazzCash</span>
          </div>
        </div>
      </div>
    </div>
  );
}
