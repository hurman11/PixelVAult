"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">P</span>
            </div>
            <span className="font-display font-bold text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Pastels
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors font-display font-bold"
            >
              Browse
            </Link>

            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                    <User size={14} className="text-[var(--accent)]" />
                  </div>
                  <span className="font-display font-bold">
                    {session.user.name || session.user.email?.split("@")[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden animate-slide-down shadow-xl">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--surface)] transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShoppingBag size={14} className="text-[var(--accent)]" />
                      My Purchases
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--surface)] transition-colors text-[var(--accent4)]"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors font-display font-bold"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm !py-2 !px-4">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)] animate-slide-down pb-4">
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="/products"
                className="px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors font-display font-bold"
                onClick={() => setMenuOpen(false)}
              >
                Browse
              </Link>
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors font-display font-bold"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Purchases
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2 text-sm text-[var(--accent4)] text-left font-display font-bold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors font-display font-bold"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="mx-3 btn-primary text-sm text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
