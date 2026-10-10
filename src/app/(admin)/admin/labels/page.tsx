import React from "react";
import { getAdminProducts } from "@/lib/supabase/admin-service";
import { BatchLabelsView } from "@/components/admin/batch-labels-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print Showroom QR Labels | Washy Admin",
  description: "Batch export and print QR code display cards for physical showroom appliances.",
};

export default async function AdminLabelsPage() {
  const products = await getAdminProducts({ status: "published" });

  return (
    <div className="max-w-6xl mx-auto">
      <BatchLabelsView products={products} />
    </div>
  );
}
