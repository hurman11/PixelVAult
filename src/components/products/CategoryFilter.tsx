"use client";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  activeSlug,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-lg text-sm font-display font-bold transition-all duration-200 ${
          activeSlug === null
            ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
            : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--text)]"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-2 rounded-lg text-sm font-display font-bold transition-all duration-200 ${
            activeSlug === cat.slug
              ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
              : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--text)]"
          }`}
        >
          {cat.icon && <span className="mr-1">{cat.icon}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
