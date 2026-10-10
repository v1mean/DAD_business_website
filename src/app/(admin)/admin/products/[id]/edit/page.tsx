import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/supabase/admin-service";
import { ProductForm } from "@/components/admin/product-form";
import { Metadata } from "next";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminProductById(id);
  const name =
    product?.translations.find((t) => t.locale === "en")?.name ||
    product?.model_number ||
    "Product";
  return {
    title: `Edit ${name} | DAD Electronics Admin`,
    description: `Manage specifications, price visibility, and translations for ${name}.`,
  };
}

async function EditProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} />;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Suspense
        fallback={
          <div className="py-24 text-center text-[#7a7a7a]">
            Loading product data...
          </div>
        }
      >
        <EditProductContent params={params} />
      </Suspense>
    </div>
  );
}
