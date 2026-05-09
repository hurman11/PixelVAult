import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://ai-quiz-generaor.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // We block Google from scanning private or admin pages
      disallow: ["/admin/", "/dashboard/", "/checkout/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
