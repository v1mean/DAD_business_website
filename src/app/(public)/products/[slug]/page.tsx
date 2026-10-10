import { Suspense } from "react";
import Link from "next/link";
import { getPublicProductBySlug, getPublicProducts } from "@/lib/supabase/products";
import { ProductDetailView } from "@/components/catalog/product-detail-view";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | DAD Electronics",
      description: "The requested appliance catalog entry could not be found.",
    };
  }

  const enTrans = product.translations.find((t) => t.locale === "en");
  const kmTrans = product.translations.find((t) => t.locale === "km");
  const productName = enTrans?.name || `${product.brand} ${product.model_number}`;

  return {
    title: `${productName} — ${product.brand} ${product.model_number} | DAD Electronics`,
    description:
      enTrans?.description?.slice(0, 160) ||
      kmTrans?.description?.slice(0, 160) ||
      `Official verified specifications, showroom warranty, and availability for ${productName}.`,
    openGraph: {
      title: `${productName} | DAD Electronics Showroom`,
      description: `Official specifications and showroom availability for ${product.brand} ${product.model_number}.`,
    },
  };
}

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f7] text-[#7a7a7a] mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-[28px] font-semibold text-[#1d1d1f]">
          Product Not Found
        </h1>
        <p className="mt-2 text-[15px] text-[#7a7a7a]">
          The appliance you scanned or requested is currently unavailable or has been archived.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] px-6 py-2.5 text-[14px] font-medium text-white active-press transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Full Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl py-24 text-center text-[#7a7a7a]">
          Loading product specifications...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
