"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { Search } from "lucide-react";

interface ProductsPageClientProps {
  products: any[];
  categories: any[];
}

export function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = products;

    if (activeCat) {
      result = result.filter((p: any) => p.category.slug === activeCat);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, activeCat, search]);

  return (
    <div className="pt-24 pb-20">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <span className="section-label">Marketplace</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-2 mb-2">
            Browse Templates
          </h1>
          <p className="text-[var(--muted)]">
            {products.length} premium templates available
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-up">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input !pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8 animate-fade-up">
            <CategoryFilter
              categories={categories}
              activeSlug={activeCat}
              onChange={setActiveCat}
            />
          </div>
        )}

        {/* Grid */}
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
