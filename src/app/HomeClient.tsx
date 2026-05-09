"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

interface HomeClientProps {
  products: any[];
  categories: any[];
}

export function HomeClient({ products, categories }: HomeClientProps) {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = activeCat
    ? products.filter((p: any) => p.category.slug === activeCat)
    : products;

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent2)] opacity-[0.04] blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent3)] opacity-[0.02] blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <div className="animate-fade-up">
              <span className="section-label inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-full">
                <Sparkles size={12} className="text-[var(--accent)]" />
                Premium Digital Assets
              </span>
            </div>

            <h1 className="animate-fade-up text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] mb-6">
              Elevate Your
              <br />
              <span className="gradient-text">Creative Workflow</span>
            </h1>

            <p className="animate-fade-up text-[var(--muted)] text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
              Discover premium Canva templates and digital assets crafted for
              creators, entrepreneurs, and design professionals.
            </p>

            <div className="animate-fade-up flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary !py-3 !px-6 text-base">
                Browse Templates
                <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="btn-secondary !py-3 !px-6 text-base">
                Get Started
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-up mt-12 flex gap-8">
              <div>
                <p className="font-display font-extrabold text-2xl text-[var(--text)]">
                  100+
                </p>
                <p className="section-label mt-1">Templates</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-[var(--text)]">
                  500+
                </p>
                <p className="section-label mt-1">Downloads</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-[var(--text)]">
                  4.9★
                </p>
                <p className="section-label mt-1">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="text-[var(--accent)]" size={22} />,
                title: "Instant Delivery",
                desc: "Download your files immediately after purchase. No waiting.",
                color: "accent",
              },
              {
                icon: <Shield className="text-[var(--accent3)]" size={22} />,
                title: "Secure Payments",
                desc: "Pay safely with credit cards, Easypaisa, or JazzCash via Safepay.",
                color: "accent3",
              },
              {
                icon: <Sparkles className="text-[var(--accent2)]" size={22} />,
                title: "Premium Quality",
                desc: "Every template is handcrafted and thoroughly tested for quality.",
                color: "accent2",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`card p-6 opacity-0 animate-fade-up stagger-${i + 1}`}
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="section-label">Featured Templates</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
                Latest Releases
              </h2>
            </div>
            <Link
              href="/products"
              className="btn-secondary text-sm"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <CategoryFilter
                categories={categories}
                activeSlug={activeCat}
                onChange={setActiveCat}
              />
            </div>
          )}

          <ProductGrid products={filtered} />
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="container-main">
          <div className="card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent2)]/5" />
            <div className="relative z-10">
              <span className="section-label mb-4 inline-block">
                Start Creating Today
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-4">
                Ready to level up your designs?
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
                Join hundreds of clients who use Pastels to build their dream websites
                time and create stunning content.
              </p>
              <Link href="/products" className="btn-primary !py-3 !px-8 text-base">
                Browse Templates
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
