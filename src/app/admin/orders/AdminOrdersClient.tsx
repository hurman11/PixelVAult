"use client";

import { useState, useMemo } from "react";
import { OrdersTable } from "@/components/admin/OrdersTable";

interface AdminOrdersClientProps {
  orders: any[];
}

export function AdminOrdersClient({ orders }: AdminOrdersClientProps) {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((o: any) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <OrdersTable
      orders={filtered}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
    />
  );
}
