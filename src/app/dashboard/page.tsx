import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "My Dashboard — Pastels",
  description: "View your purchases and download your digital assets.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "PAID",
      },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {}

  return (
    <DashboardClient
      user={session.user}
      orders={JSON.parse(JSON.stringify(orders))}
    />
  );
}
