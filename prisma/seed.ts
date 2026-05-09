import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "web-development" },
      update: {},
      create: {
        name: "Web Development",
        slug: "web-development",
        icon: "💻",
      },
    }),
    prisma.category.upsert({
      where: { slug: "ui-ux-design" },
      update: {},
      create: {
        name: "UI/UX Design",
        slug: "ui-ux-design",
        icon: "🎨",
      },
    }),
    prisma.category.upsert({
      where: { slug: "seo-optimization" },
      update: {},
      create: {
        name: "SEO Optimization",
        slug: "seo-optimization",
        icon: "🚀",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@pixelvault.com" },
    update: {},
    create: {
      email: "admin@pixelvault.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create sample products (services)
  const sampleProducts = [
    {
      name: "Custom E-Commerce Storefront",
      slug: "custom-ecommerce-storefront",
      description: "Full-stack e-commerce solution using Next.js, Prisma, and PostgreSQL. Includes payment gateway integration, admin dashboard, and responsive design.",
      price: 55000,
      categoryId: categories[0].id,
      previewUrl: "https://placehold.co/800x600/161622/7c6af7?text=E-Commerce+Website",
      isPublished: true,
    },
    {
      name: "SaaS Landing Page - Premium",
      slug: "saas-landing-page-premium",
      description: "High-converting, modern landing page for your SaaS product. Features dark mode, animations, and lead capture forms.",
      price: 15000,
      categoryId: categories[0].id,
      previewUrl: "https://placehold.co/800x600/161622/f7a26a?text=SaaS+Landing+Page",
      isPublished: true,
    },
    {
      name: "Complete UI/UX Redesign",
      slug: "complete-ui-ux-redesign",
      description: "Complete redesign of your existing application or website. Includes wireframing, high-fidelity mockups, and interactive prototypes.",
      price: 35000,
      categoryId: categories[1].id,
      previewUrl: "https://placehold.co/800x600/161622/6af7c2?text=UI/UX+Redesign",
      isPublished: true,
    },
    {
      name: "Technical SEO Audit & Fixes",
      slug: "technical-seo-audit-fixes",
      description: "Comprehensive SEO audit of your website and implementation of fixes to improve search engine rankings.",
      price: 12000,
      categoryId: categories[2].id,
      previewUrl: "https://placehold.co/800x600/161622/f76a8a?text=SEO+Audit",
      isPublished: true,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ Created ${sampleProducts.length} sample services`);
  console.log("\n🎉 Seed complete!");
  console.log("Admin login: admin@pixelvault.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
