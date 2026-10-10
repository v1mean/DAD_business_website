"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import type { MockProductWithDetails } from "@/data/mock-products";
import { APPLIANCE_ICONS } from "@/data/mock-products";
import { buildTelegramInquiryUrl } from "@/lib/telegram";
import { Send, CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  product: MockProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLanguage();

  const translation =
    product.translations.find((tr) => tr.locale === locale) ||
    product.translations.find((tr) => tr.locale === "en") ||
    product.translations[0];

  const productName = translation?.name || `${product.brand} ${product.model_number}`;

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

  // Extract 2 key specifications for card preview
  const primarySpecs = product.specifications.slice(0, 2);

  return (
    <div className="group relative flex flex-col justify-between rounded-[18px] border border-[#e0e0e0] bg-[#ffffff] p-6 transition-colors hover:border-[#b0b0b5]">
      <div>
        {/* Top Badges: Brand & Availability Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-semibold tracking-tight text-[#1d1d1f]">
            {product.brand}
          </span>

          {product.in_stock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[11px] font-medium text-[#2e7d32]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2e7d32]" />
              {t("card.in_stock")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-medium text-[#7a7a7a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7a7a7a]" />
              {t("card.available_order")}
            </span>
          )}
        </div>

        {/* 1:1 Product Illustration Pedestal with signature single product drop shadow */}
        <Link
          href={`/products/${product.slug}`}
          className="relative flex aspect-square w-full items-center justify-center rounded-[12px] bg-[#fafafc] p-6 transition-transform group-hover:scale-[1.02]"
        >
          {isUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={storagePath}
              alt={productName}
              className="h-44 w-44 object-contain product-shadow"
              loading="lazy"
            />
          ) : (
            <div
              className="h-44 w-44 product-shadow flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
          )}
        </Link>

        {/* Model Number Tag */}
        <div className="mt-5 flex items-center gap-2">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#7a7a7a]">
            {product.model_number}
          </span>
          {product.origin_country && (
            <span className="text-[11px] text-[#7a7a7a]">• Made in {product.origin_country}</span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="mt-1.5 block">
          <h3 className="text-[17px] font-semibold leading-[1.3] text-[#1d1d1f] transition-colors group-hover:text-[#0066cc] line-clamp-2">
            {productName}
          </h3>
        </Link>

        {/* Key Technical Specifications Preview */}
        {primarySpecs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {primarySpecs.map((spec) => (
              <span
                key={spec.id}
                className="inline-flex items-center gap-1 rounded-[6px] bg-[#f5f5f7] px-2 py-1 text-[11px] text-[#333333]"
              >
                <CheckCircle2 className="h-2.5 w-2.5 text-[#0066cc]" />
                <span className="font-medium">{spec.spec_key}:</span>
                <span>{spec.value_text}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer: Price & CTA Actions */}
      <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
        {/* Price Display Block (Gracefully handles hidden/shown price) */}
        <div className="mb-4">
          {product.show_price && product.price !== null ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-semibold text-[#1d1d1f]">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
              <span className="text-[12px] text-[#7a7a7a]">{product.currency}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0066cc]">
              <span>{t("card.contact_for_price")}</span>
            </div>
          )}
        </div>

        {/* Dual Actions: Details & Telegram Pill */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center rounded-full border border-[#e0e0e0] bg-[#ffffff] hover:bg-[#f5f5f7] px-3 py-2.5 text-[13px] font-medium text-[#1d1d1f] active-press transition-colors"
          >
            <span>{t("card.view_details")}</span>
          </Link>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-3 py-2.5 text-[13px] font-medium text-white active-press transition-colors"
            title={t("card.inquire_telegram")}
          >
            <Send className="h-3.5 w-3.5" />
            <span className="truncate">{t("nav.telegram")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
