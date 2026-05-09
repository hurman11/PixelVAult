"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Clock,
  ExternalLink,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface DashboardClientProps {
  user: any;
  orders: any[];
}

const getStatusDetails = (status: string) => {
  switch (status) {
    case "PENDING_REQUIREMENTS":
      return {
        label: "Awaiting Requirements",
        color: "var(--accent4)",
        icon: AlertCircle,
        bg: "var(--accent4)",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        color: "var(--accent)",
        icon: Activity,
        bg: "var(--accent)",
      };
    case "REVISION":
      return {
        label: "In Revision",
        color: "var(--accent2)",
        icon: Clock,
        bg: "var(--accent2)",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        color: "var(--accent3)",
        icon: CheckCircle2,
        bg: "var(--accent3)",
      };
    default:
      return {
        label: "Pending Setup",
        color: "var(--muted)",
        icon: Clock,
        bg: "var(--border)",
      };
  }
};

export function DashboardClient({ user, orders }: DashboardClientProps) {
  return (
    <div className="pt-24 pb-20">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <span className="section-label">Dashboard</span>
          <h1 className="font-display font-extrabold text-3xl mt-2">
            Welcome back, {user.name || user.email.split("@")[0]}
          </h1>
          <p className="text-[var(--muted)] mt-1">
            Manage your purchases and track project progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-fade-up">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <ShoppingBag size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <p className="section-label">Total Projects</p>
                <p className="font-display font-extrabold text-xl">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent2)]/10 flex items-center justify-center">
                <Package size={18} className="text-[var(--accent2)]" />
              </div>
              <div>
                <p className="section-label">Total Spent</p>
                <p className="font-display font-extrabold text-xl text-[var(--accent2)]">
                  Rs.{" "}
                  {orders
                    .reduce((sum: number, o: any) => sum + Number(o.product.price), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchases */}
        <div className="animate-fade-up">
          <h2 className="font-display font-bold text-xl mb-6">My Projects</h2>

          {orders.length === 0 ? (
            <div className="card p-12 text-center">
              <ShoppingBag
                size={40}
                className="text-[var(--muted)] mx-auto mb-4"
              />
              <h3 className="font-display font-bold text-lg mb-2">
                No projects yet
              </h3>
              <p className="text-[var(--muted)] text-sm mb-6">
                Browse our services to start your next big thing.
              </p>
              <Link href="/products" className="btn-primary">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => {
                const statusDetails = getStatusDetails(order.projectStatus);
                const StatusIcon = statusDetails.icon;

                return (
                  <div key={order.id} className="card p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Preview */}
                      <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
                        <Image
                          src={order.product.previewUrl}
                          alt={order.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="badge badge-accent text-[0.55rem]">
                            {order.product.category.name}
                          </span>
                          <span className="badge badge-success text-[0.55rem]">
                            Paid
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-sm">
                          {order.product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[var(--muted)] font-mono">
                          <span>
                            Rs. {Number(order.product.price).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions & Status */}
                      <div className="flex flex-col justify-center gap-3 min-w-[140px] items-start sm:items-end">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold" style={{ color: statusDetails.color }}>
                          <StatusIcon size={14} />
                          {statusDetails.label}
                        </div>
                        {order.projectStatus === "COMPLETED" && order.liveUrl && (
                          <a
                            href={order.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs !py-1.5"
                          >
                            <ExternalLink size={14} />
                            Visit Website
                          </a>
                        )}
                        {order.projectStatus === "PENDING_REQUIREMENTS" && (
                          <p className="text-[0.6rem] text-[var(--muted)] text-left sm:text-right">
                            We will contact you shortly to get started.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
