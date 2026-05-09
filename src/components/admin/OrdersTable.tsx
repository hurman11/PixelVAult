"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  user: { email: string };
  product: { name: string; price: number };
  status: string;
  projectStatus: string;
  liveUrl: string | null;
  gateway: string;
  createdAt: string;
}

interface OrdersTableProps {
  orders: Order[];
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export function OrdersTable({
  orders,
  statusFilter,
  onStatusFilterChange,
}: OrdersTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "badge-success";
      case "PENDING":
        return "badge-warning";
      case "FAILED":
        return "badge-danger";
      default:
        return "badge-accent";
    }
  };

  const handleUpdateProjectStatus = async (orderId: string, newStatus: string, currentLiveUrl: string | null) => {
    let newLiveUrl = currentLiveUrl;
    
    if (newStatus === "COMPLETED") {
      const url = prompt("Please provide the Live URL for the completed website:", currentLiveUrl || "");
      if (url === null) return; // User cancelled
      newLiveUrl = url;
    }

    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectStatus: newStatus, liveUrl: newLiveUrl }),
      });

      if (!res.ok) throw new Error("Update failed");
      window.location.reload();
    } catch (e) {
      alert("Failed to update project status");
      setUpdating(null);
    }
  };

  return (
    <div>
      {onStatusFilterChange && (
        <div className="flex gap-2 mb-4">
          {["ALL", "PENDING", "PAID", "FAILED"].map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                (statusFilter || "ALL") === s
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Project Status</th>
              <th>Live URL</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-[var(--muted)] py-8">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-xs text-[var(--muted)]">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="text-sm">{order.user.email}</td>
                  <td className="text-sm font-display font-bold">
                    {order.product.name}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      disabled={updating === order.id}
                      className="input !py-1 !px-2 text-xs w-auto bg-[var(--surface)] border-[var(--border)]"
                      value={order.projectStatus}
                      onChange={(e) => handleUpdateProjectStatus(order.id, e.target.value, order.liveUrl)}
                    >
                      <option value="PENDING_REQUIREMENTS">Awaiting Info</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVISION">Revision</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="text-xs">
                    {order.liveUrl ? (
                      <a href={order.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline truncate inline-block max-w-[100px]">
                        Link
                      </a>
                    ) : (
                      <span className="text-[var(--muted)]">-</span>
                    )}
                  </td>
                  <td className="text-sm text-[var(--muted)] font-mono text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
