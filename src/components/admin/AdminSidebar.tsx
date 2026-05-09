"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile toggle button — fixed top-left */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
        aria-label="Toggle admin menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-[50] h-full w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-5 pt-6 border-b border-[var(--border)]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm mb-4"
          >
            <ChevronLeft size={14} />
            <span className="font-mono text-xs">Back to Store</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-display font-extrabold text-sm">
                P
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-sm">Pastels</span>
              <p className="section-label !text-[0.55rem] mt-0.5">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-l-2 border-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)]">
          <p className="font-mono text-[0.6rem] text-[var(--muted)]">
            Pastels Admin v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
