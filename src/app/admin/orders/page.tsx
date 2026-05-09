import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { AdminOrdersClient } from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    orders = await prisma.order.findMany({
      include: {
        user: { select: { email: true } },
        product: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {}

  return (
    <div>
      <div className="mb-8">
        <span className="section-label">Management</span>
        <h1 className="font-display font-extrabold text-2xl mt-1">Orders</h1>
      </div>

      <AdminOrdersClient orders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
