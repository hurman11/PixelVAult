import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";

export default async function AdminDashboardPage() {
  let totalProducts = 0;
  let totalOrders = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];

  try {
    [totalProducts, totalOrders, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.findMany({
        include: {
          user: { select: { email: true } },
          product: { select: { name: true, price: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const revenueResult = await prisma.order.findMany({
      where: { status: "PAID" },
      include: { product: { select: { price: true } } },
    });
    totalRevenue = revenueResult.reduce(
      (sum, o) => sum + Number(o.product.price),
      0
    );
  } catch (e) {}

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: <Package size={20} className="text-[var(--accent)]" />,
      color: "accent",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart size={20} className="text-[var(--accent3)]" />,
      color: "accent3",
    },
    {
      label: "Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={20} className="text-[var(--accent2)]" />,
      color: "accent2",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-label">Overview</span>
          <h1 className="font-display font-extrabold text-2xl mt-1">
            Admin Dashboard
          </h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-[var(--${stat.color})]/10 flex items-center justify-center`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="section-label">{stat.label}</p>
                <p className="font-display font-extrabold text-xl">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link href="/admin/products" className="card p-5 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[var(--accent)]" />
              <span className="font-display font-bold text-sm">
                Manage Products
              </span>
            </div>
            <ArrowRight
              size={16}
              className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors"
            />
          </div>
        </Link>
        <Link href="/admin/orders" className="card p-5 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={18} className="text-[var(--accent3)]" />
              <span className="font-display font-bold text-sm">
                View Orders
              </span>
            </div>
            <ArrowRight
              size={16}
              className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors"
            />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-[var(--muted)] py-8"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs text-[var(--muted)]">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="text-sm">{order.user.email}</td>
                    <td className="text-sm font-display font-bold">
                      {order.product.name}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.status === "PAID"
                            ? "badge-success"
                            : order.status === "PENDING"
                            ? "badge-warning"
                            : "badge-danger"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="text-xs text-[var(--muted)] font-mono">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
