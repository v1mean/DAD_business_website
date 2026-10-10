import React, { Suspense } from "react";
import { getPublicProducts, getPublicCategories } from "@/lib/supabase/products";
import { HomeView } from "@/components/home/home-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DAD Electronics — Official Electronics & Home Appliance Catalog",
  description:
    "Explore our showroom inventory of washing machines, refrigerators, air conditioners, and TVs with verified technical specifications and instant QR code access.",
  openGraph: {
    title: "DAD Electronics Showroom",
    description: "Curated home appliances with verified specifications and instant QR scanning.",
  },
};

async function HomeDataWrapper() {
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getPublicCategories(),
  ]);

  return <HomeView products={products} categories={categories} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#7a7a7a]">
          Loading showroom...
        </div>
      }
    >
      <HomeDataWrapper />
    </Suspense>
  );
}
