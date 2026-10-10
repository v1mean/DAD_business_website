"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { ProductWithDetails } from "@/types/database";
import { getProductDestinationUrl, generateQrDataUrl } from "@/lib/qr";
import { MOCK_CATEGORIES } from "@/data/mock-products";
import {
  Printer,
  CheckCircle2,
  Filter,
  ArrowLeft,
  QrCode as QrIcon,
} from "lucide-react";
import Link from "next/link";

interface BatchLabelsViewProps {
  products: ProductWithDetails[];
}

export function BatchLabelsView({ products }: BatchLabelsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.category?.slug !== selectedCategory) {
      return false;
    }
    return p.status === "published";
  });

  // Pre-generate QR data URLs for all filtered products
  useEffect(() => {
    let ignore = false;
    async function generateAll() {
      const map: Record<string, string> = {};
      for (const p of filteredProducts) {
        const url = getProductDestinationUrl(p.slug);
        const dataUrl = await generateQrDataUrl(url, { width: 450 });
        map[p.id] = dataUrl;
      }
      if (!ignore) {
        setQrMap(map);
      }
    }
    generateAll();
    return () => {
      ignore = true;
    };
  }, [selectedCategory, filteredProducts]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar (no-print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-[13px] text-[#7a7a7a] hover:text-[#0066cc]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Products</span>
            </Link>
          </div>
          <h1 className="text-[26px] font-semibold text-[#1d1d1f] tracking-tight">
            Showroom Appliance QR Labels
          </h1>
          <p className="text-[14px] text-[#7a7a7a]">
            Print display cards and sticker labels for showroom floor appliances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#7a7a7a]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-[40px] rounded-[10px] border border-[#e0e0e0] bg-white px-3 text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
            >
              <option value="all">All Categories ({products.length})</option>
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Big Print Button */}
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-6 py-2.5 text-[14px] font-medium text-white active-press transition-colors shadow-none"
          >
            <Printer className="h-4 w-4" />
            <span>Print {filteredProducts.length} Labels</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:p-0">
        {filteredProducts.map((product) => {
          const url = getProductDestinationUrl(product.slug);
          const enTrans = product.translations.find((t) => t.locale === "en");
          const kmTrans = product.translations.find((t) => t.locale === "km");
          const nameEn = enTrans?.name || `${product.brand} ${product.model_number}`;
          const nameKm = kmTrans?.name || "";
          const specs = product.specifications.slice(0, 4);
          const qrDataUrl = qrMap[product.id];

          return (
            <div
              key={product.id}
              className="rounded-[16px] border-2 border-[#1d1d1f] bg-white p-6 flex flex-col justify-between print:rounded-none print:border-2 print:border-black print:break-inside-avoid print:p-5"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-[#1d1d1f] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Washy"
                      width={22}
                      height={22}
                      className="rounded-[4px] object-contain"
                    />
                    <span className="text-[15px] font-bold tracking-tight uppercase">
                      Washy
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7a7a7a]">
                    Showroom Product
                  </span>
                </div>

                {/* Model badge & origin */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="rounded-full bg-[#1d1d1f] px-2.5 py-0.5 text-[11px] font-bold text-white uppercase">
                      {product.brand}
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-[#1d1d1f]">
                      {product.model_number}
                    </span>
                  </div>

                  {product.origin_country && (
                    <span className="text-[10px] text-[#7a7a7a]">
                      Made in {product.origin_country}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-[#1d1d1f] leading-snug">
                  {nameEn}
                </h3>
                {nameKm && (
                  <p className="mt-0.5 text-[14px] font-medium text-[#333333] leading-relaxed">
                    {nameKm}
                  </p>
                )}

                {/* QR Code Centerpiece */}
                <div className="my-4 flex items-center gap-4 rounded-[12px] bg-[#f5f5f7] p-3.5 border border-[#e0e0e0] print:bg-transparent">
                  <div className="h-28 w-28 shrink-0 bg-white p-1 rounded-[8px] border border-[#e0e0e0] flex items-center justify-center">
                    {qrDataUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={qrDataUrl}
                        alt={`QR for ${product.model_number}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <QrIcon className="h-8 w-8 text-[#7a7a7a]" />
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc]">
                      Scan with Phone Camera
                    </p>
                    <p className="text-[11px] text-[#333333] font-medium mt-0.5">
                      ស្កេនដើម្បីមើលលក្ខណៈបច្ចេកទេស និងតម្លៃ
                    </p>
                    <p className="text-[9px] text-[#7a7a7a] mt-1">
                      iOS Camera & Android QR scanner
                    </p>
                  </div>
                </div>

                {/* Key Specs */}
                {specs.length > 0 && (
                  <div className="border-t border-[#e0e0e0] pt-3 mb-3">
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {specs.map((s) => (
                        <div key={s.id || s.spec_key} className="flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 text-[#0066cc] shrink-0 mt-0.5" />
                          <div className="truncate">
                            <span className="font-semibold text-[#1d1d1f]">
                              {s.spec_key}:{" "}
                            </span>
                            <span className="text-[#333333] font-mono">
                              {s.value_text || "-"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* URL Footnote */}
              <div className="border-t border-[#e0e0e0] pt-2 text-center text-[9px] text-[#7a7a7a] font-mono truncate">
                {url}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
