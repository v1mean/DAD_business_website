import React from "react";
import { ProductForm } from "@/components/admin/product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Product | DAD Electronics Admin",
  description: "Create and publish a new appliance product with bilingual specs.",
};

export default function NewProductPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProductForm />
    </div>
  );
}
