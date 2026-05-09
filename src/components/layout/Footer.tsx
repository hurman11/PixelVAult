import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center">
                <span className="text-white font-display font-extrabold text-sm">P</span>
              </div>
              <span className="font-display font-bold text-lg">PixelVault</span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Premium digital templates and creative assets for designers,
              creators, and entrepreneurs.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="section-label mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                Browse Templates
              </Link>
              <Link
                href="/login"
                className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="section-label mb-4">Info</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[var(--muted)]">
                Secure payments via Safepay
              </span>
              <span className="text-sm text-[var(--muted)]">
                Instant digital delivery
              </span>
              <span className="text-sm text-[var(--muted)]">
                24-hour download window
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted)] font-mono">
            © {new Date().getFullYear()} PixelVault. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)] font-mono">
            Built with ♥ for creators
          </p>
        </div>
      </div>
    </footer>
  );
}
