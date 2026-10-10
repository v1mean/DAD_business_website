"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import type { MockProductWithDetails } from "@/data/mock-products";
import { APPLIANCE_ICONS, getProductsByCategory } from "@/data/mock-products";
import { buildTelegramInquiryUrl, getTelegramUsername } from "@/lib/telegram";
import { ProductCard } from "./product-card";
import { QrModal } from "@/components/qr/qr-modal";
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Calendar,
  Globe2,
} from "lucide-react";

interface ProductDetailViewProps {
  product: MockProductWithDetails;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { locale, t } = useLanguage();
  const [showQrModal, setShowQrModal] = useState(false);

  const translation =
    product.translations.find((tr) => tr.locale === locale) ||
    product.translations.find((tr) => tr.locale === "en") ||
    product.translations[0];

  const productName = translation?.name || `${product.brand} ${product.model_number}`;
  const description = translation?.description || "";
  const warranty = translation?.warranty_text || "";

  const storagePath = product.images[0]?.storage_path || "";
  const isUrl = storagePath.startsWith("http") || storagePath.startsWith("/");

  let fallbackIconKey = "washer";
  const catSlug = product.category?.slug?.toLowerCase() || "";
  if (catSlug.includes("air")) fallbackIconKey = "ac";
  else if (catSlug.includes("refriger") || catSlug.includes("fridge")) fallbackIconKey = "fridge";
  else if (catSlug.includes("tv") || catSlug.includes("television")) fallbackIconKey = "tv";
  else if (catSlug.includes("wash")) fallbackIconKey = "washer";
  else if (catSlug.includes("freezer")) fallbackIconKey = "freezer";

  const iconSvg =
    APPLIANCE_ICONS[storagePath as keyof typeof APPLIANCE_ICONS] ||
    APPLIANCE_ICONS[fallbackIconKey as keyof typeof APPLIANCE_ICONS] ||
    APPLIANCE_ICONS.washer;

  const telegramUrl = buildTelegramInquiryUrl({
    modelNumber: product.model_number,
    productName,
    locale,
  });

  const telegramUsername = getTelegramUsername();

  // Related products from the same category
  const relatedProducts = getProductsByCategory(product.category?.slug || "")
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1d1d1f]">
      {/* Breadcrumb Navigation Strip */}
      <div className="border-b border-[#f0f0f0] bg-[#fafafc]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-8 text-[13px]">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[#0066cc] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t("detail.back")}</span>
          </Link>

          <button
            onClick={() => setShowQrModal(true)}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] active-press"
          >
            <QrCode className="h-3.5 w-3.5 text-[#0066cc]" />
            <span>{t("detail.cta_qr")}</span>
          </button>
        </div>
      </div>

      {/* Main Museum Gallery Hero Section */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Product Photography Pedestal (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative flex aspect-square w-full max-w-[540px] items-center justify-center rounded-[20px] bg-[#f5f5f7] p-8 sm:p-12">
              {/* Pedestal with signature single product drop shadow */}
              {isUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={storagePath}
                  alt={productName}
                  className="h-64 w-64 sm:h-80 sm:w-80 object-contain product-shadow"
                />
              ) : (
                <div
                  className="h-64 w-64 sm:h-80 sm:w-80 product-shadow flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: iconSvg }}
                />
              )}

              {/* Status Badge Over Image */}
              <div className="absolute top-4 left-4">
                {product.in_stock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[12px] font-medium text-[#2e7d32] border border-[#e0e0e0]">
                    <span className="h-2 w-2 rounded-full bg-[#2e7d32]" />
                    {t("card.in_stock")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[12px] font-medium text-[#7a7a7a] border border-[#e0e0e0]">
                    <span className="h-2 w-2 rounded-full bg-[#7a7a7a]" />
                    {t("card.available_order")}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-4 text-[12px] text-[#7a7a7a] text-center">
              Official showroom display render • Model {product.model_number}
            </p>
          </div>

          {/* Right Column: Model Information, Price, CTAs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Meta Tags Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-[#0066cc]/10 px-3 py-1 text-[12px] font-semibold text-[#0066cc]">
                {product.brand}
              </span>
              <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-mono text-[#7a7a7a]">
                {product.model_number}
              </span>
              {product.origin_country && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[11px] text-[#7a7a7a]">
                  <Globe2 className="h-3 w-3" />
                  {product.origin_country}
                </span>
              )}
              {product.release_year && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[11px] text-[#7a7a7a]">
                  <Calendar className="h-3 w-3" />
                  {product.release_year}
                </span>
              )}
            </div>

            {/* Product Title - Display-LG (40px, weight 600) */}
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.15] text-[#1d1d1f] tracking-tight">
              {productName}
            </h1>

            {/* Pricing Section (Handles Optional Price Display per spec 5.7) */}
            <div className="mt-6 rounded-[14px] bg-[#fafafc] border border-[#e0e0e0] p-4">
              {product.show_price && product.price !== null ? (
                <div>
                  <div className="text-[12px] font-medium text-[#7a7a7a] uppercase tracking-wider">
                    {t("detail.price")}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[32px] font-bold text-[#1d1d1f]">
                      ${product.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-[14px] font-medium text-[#7a7a7a]">
                      {product.currency} (Showroom Offer)
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f]">
                    {t("detail.price_hidden_title")}
                  </div>
                  <p className="mt-1 text-[13px] text-[#7a7a7a] leading-relaxed">
                    {t("detail.price_hidden_desc")}
                  </p>
                </div>
              )}
            </div>

            {/* Primary Action Button: Telegram Inquiry (Apple Pill Style) */}
            <div className="mt-6 space-y-3">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] py-3.5 px-6 text-[16px] font-medium text-white active-press transition-all shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>{t("detail.cta_telegram")}</span>
              </a>

              <p className="text-center text-[12px] text-[#7a7a7a]">
                Direct live chat with DAD Electronics sales desk (@{telegramUsername})
              </p>
            </div>

            {/* Description Paragraph */}
            <div className="mt-8 border-t border-[#f0f0f0] pt-6">
              <h2 className="text-[14px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2">
                Overview
              </h2>
              <p className="text-[15px] sm:text-[17px] leading-[1.6] text-[#333333]">
                {description}
              </p>
            </div>

            {/* Warranty Badge Block */}
            {warranty && (
              <div className="mt-6 flex items-start gap-3 rounded-[12px] bg-[#f5f5f7] p-4 text-[14px]">
                <ShieldCheck className="h-5 w-5 text-[#0066cc] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">
                    {t("detail.warranty_coverage")}
                  </span>
                  <span className="text-[#333333] mt-0.5 block">{warranty}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verified Technical Specifications Section */}
      <section className="border-t border-[#e0e0e0] bg-[#f5f5f7] py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="rounded-full bg-[#0066cc]/10 text-[#0066cc] px-3 py-1 text-[12px] font-semibold">
                Authentic Verification
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight mt-2">
                {t("detail.specifications")}
              </h2>
            </div>
            <p className="text-[13px] text-[#7a7a7a]">
              {t("detail.spec_source")}
            </p>
          </div>

          {/* Specifications Grid in Clean Hairline Cards (18px radius) */}
          <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8">
            <dl className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {product.specifications.map((spec) => (
                <div
                  key={spec.id}
                  className="border-b border-[#f0f0f0] pb-3 last:border-none sm:last:border-b"
                >
                  <dt className="text-[13px] font-medium text-[#7a7a7a] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0066cc]" />
                    <span>{spec.spec_key}</span>
                  </dt>
                  <dd className="mt-1 text-[16px] font-semibold text-[#1d1d1f]">
                    {spec.value_text || "-"}
                  </dd>
                  {spec.source_note && (
                    <span className="text-[11px] text-[#7a7a7a] block mt-0.5">
                      Verified from {spec.source_note}
                    </span>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Related Products Shelf */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#e0e0e0] bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            <div className="mb-8">
              <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#1d1d1f]">
                {t("detail.related_title")}
              </h2>
              <p className="text-[14px] text-[#7a7a7a] mt-1">
                {t("detail.related_subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Showroom Action Bar (Phones & Small Tablets) */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e0e0e0] p-4 flex items-center justify-between gap-3 safe-area-pb">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#7a7a7a] block leading-none mb-1">
            {product.brand} {product.model_number}
          </span>
          {product.show_price && product.price !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-bold text-[#1d1d1f]">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
              <span className="text-[11px] text-[#7a7a7a]">{product.currency}</span>
            </div>
          ) : (
            <span className="text-[13px] font-semibold text-[#0066cc]">
              {t("card.contact_for_price")}
            </span>
          )}
        </div>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-5 py-2.5 text-[14px] font-medium text-white active-press transition-colors shrink-0"
        >
          <Send className="h-4 w-4" />
          <span>{t("nav.telegram")}</span>
        </a>
      </div>

      {/* QR Code Showroom Modal */}
      <QrModal
        product={product}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
}
