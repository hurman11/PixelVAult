import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "Pastels — Premium Custom Web Agency",
  description:
    "Discover and download premium Canva templates, digital assets, and creative resources. Built for creators, by creators.",
  keywords: ["digital marketplace", "canva templates", "digital assets", "design templates"],
  verification: {
    google: "zZPf4AVfpNbp01K8F9N9xPRpuUSD7FCrg3Upss8nTEA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
