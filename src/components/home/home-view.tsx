"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import type { MockProductWithDetails } from "@/data/mock-products";
import type { Category } from "@/types/database";
import { APPLIANCE_ICONS } from "@/data/mock-products";
import { ProductCard } from "@/components/catalog/product-card";
import { getTelegramUsername } from "@/lib/telegram";
import {
  Send,
  ArrowRight,
  QrCode,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface HomeViewProps {
  products: MockProductWithDetails[];
  categories: Category[];
}

export function HomeView({ products, categories }: HomeViewProps) {
  const { t, isKhmer } = useLanguage();
  const telegramUsername = getTelegramUsername();

  // Featured appliances: first 4 products
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* TILE 1: Full-Bleed Light Hero Tile */}
      <section className="relative overflow-hidden bg-[#ffffff] px-4 py-16 sm:py-24 lg:py-28 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1d1d1f] mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#0066cc]" />
            <span>{t("hero.badge")}</span>
          </div>

          {/* Hero Display Headline (SF Pro tight tracking) */}
          <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold tracking-tight text-[#1d1d1f] leading-[1.08]">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-[17px] sm:text-[21px] font-normal text-[#7a7a7a] max-w-2xl mx-auto leading-normal">
            {t("hero.subtitle")}
          </p>

          {/* Action CTAs (Two Apple Pill Buttons) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-7 py-3 text-[16px] font-medium text-white active-press transition-all"
            >
              <span>{t("hero.cta_catalog")}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <a
              href={`https://t.me/${telegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#0066cc] bg-white hover:bg-[#f5f5f7] px-7 py-3 text-[16px] font-medium text-[#0066cc] active-press transition-all"
            >
              <Send className="mr-2 h-4 w-4" />
              <span>{t("hero.cta_contact")}</span>
            </a>
          </div>

          {/* Hero Product Centerpiece with signature single product drop shadow */}
          <div className="mt-14 flex justify-center">
            <div className="relative flex h-60 w-60 sm:h-72 sm:w-72 items-center justify-center rounded-[20px] bg-[#f5f5f7] p-8">
              <div
                className="h-48 w-48 sm:h-56 sm:w-56 product-shadow flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: APPLIANCE_ICONS.washer }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TILE 2: Parchment Category Tile (#f5f5f7) */}
      <section className="bg-[#f5f5f7] px-4 py-16 sm:py-20 border-t border-[#e0e0e0]">
        <div className="mx-auto max-w-[1440px] px-2 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#1d1d1f] tracking-tight">
              {t("categories.title")}
            </h2>
            <p className="mt-2 text-[15px] sm:text-[17px] text-[#7a7a7a]">
              {t("categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const iconKey =
                cat.slug === "washing-machines"
                  ? "washer"
                  : cat.slug === "refrigerators"
                  ? "fridge"
                  : cat.slug === "air-conditioners"
                  ? "ac"
                  : cat.slug === "televisions"
                  ? "tv"
                  : "kitchen";

              const svgContent =
                APPLIANCE_ICONS[iconKey as keyof typeof APPLIANCE_ICONS] ||
                APPLIANCE_ICONS.washer;

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center rounded-[18px] border border-[#e0e0e0] bg-white p-6 text-center transition-all hover:border-[#b0b0b5] hover:scale-[1.02]"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-[#fafafc] p-3 mb-4">
                    <div
                      className="h-16 w-16 product-shadow flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                  </div>
                  <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">
                    {isKhmer ? cat.name_km : cat.name_en}
                  </h3>
                  <span className="mt-1 text-[12px] text-[#7a7a7a] flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TILE 3: Featured Appliances Grid (#ffffff) */}
      <section className="bg-[#ffffff] px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-2 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="rounded-full bg-[#0066cc]/10 px-3 py-1 text-[12px] font-semibold text-[#0066cc]">
                Curated Selection
              </span>
              <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#1d1d1f] tracking-tight mt-2">
                {t("featured.title")}
              </h2>
              <p className="mt-1 text-[15px] sm:text-[17px] text-[#7a7a7a]">
                {t("featured.subtitle")}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#0066cc] hover:underline"
            >
              <span>{t("hero.cta_catalog")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* TILE 4: Near-Black Tile (#272729) - Showroom & QR Experience */}
      <section className="bg-[#272729] text-white px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-[#2997ff] mb-4">
                <QrCode className="h-3.5 w-3.5" />
                <span>{t("showroom.badge")}</span>
              </span>

              <h2 className="text-[32px] sm:text-[44px] font-semibold leading-[1.15] text-white tracking-tight">
                {t("showroom.title")}
              </h2>

              <p className="mt-4 text-[16px] sm:text-[18px] text-[#cccccc] leading-relaxed">
                {t("showroom.desc")}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-[14px] text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2997ff]" />
                  <span>Instant verified specifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2997ff]" />
                  <span>Permanent stable URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2997ff]" />
                  <span>One-tap Telegram inquiries</span>
                </div>
              </div>
            </div>

            {/* QR Illustration Demo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-[20px] bg-[#1d1d1f] p-8 border border-white/10 text-center">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-[14px] bg-white p-4">
                  <QrCode className="h-28 w-28 text-[#0066cc]" />
                </div>
                <div className="mt-4 font-mono text-[13px] text-[#2997ff]">
                  Scan to preview product
                </div>
                <p className="mt-1 text-[12px] text-[#7a7a7a]">
                  Works with standard iOS Camera and Android QR scanners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
