import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Pastels",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="min-h-screen p-4 pt-16 sm:p-6 sm:pt-6 lg:ml-64 lg:p-8">
        {children}
      </main>
    </div>
  );
}
