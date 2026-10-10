import React, { Suspense } from "react";
import { getPublicProducts, getPublicCategories } from "@/lib/supabase/products";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products — Electronics & Appliances | DAD Electronics",
  description:
    "Browse verified inventory of washing machines, refrigerators, air conditioners, and TVs with official specifications and pricing.",
  openGraph: {
    title: "Product Catalog | DAD Electronics",
    description: "Explore our curated showroom catalog with instant QR access and verified specs.",
  },
};

async function CatalogDataWrapper() {
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getPublicCategories(),
  ]);

  return <CatalogExplorer initialProducts={products} categories={categories} />;
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center text-[#7a7a7a]">
          Loading showroom inventory...
        </div>
      }
    >
      <CatalogDataWrapper />
    </Suspense>
  );
}
