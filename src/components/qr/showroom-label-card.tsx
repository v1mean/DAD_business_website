"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { ProductWithDetails } from "@/types/database";
import { getProductDestinationUrl, generateQrDataUrl } from "@/lib/qr";
import { CheckCircle2, QrCode as QrIcon } from "lucide-react";

interface ShowroomLabelCardProps {
  product: ProductWithDetails;
  onClose?: () => void;
}

export function ShowroomLabelCard({ product, onClose }: ShowroomLabelCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const url = getProductDestinationUrl(product.slug);
  const enTrans = product.translations.find((t) => t.locale === "en");
  const kmTrans = product.translations.find((t) => t.locale === "km");
  const productNameEn = enTrans?.name || `${product.brand} ${product.model_number}`;
  const productNameKm = kmTrans?.name || "";

  useEffect(() => {
    generateQrDataUrl(url, { width: 600 }).then(setQrDataUrl);
  }, [url]);

  const handlePrint = () => {
    window.print();
  };

  const primarySpecs = product.specifications.slice(0, 4);

  return (
    <div className="flex flex-col items-center">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 w-full max-w-[480px]">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-5 py-2 text-[13px] font-medium text-white active-press transition-colors"
          >
            <QrIcon className="h-4 w-4" />
            <span>Print Label Card</span>
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="rounded-full border border-[#e0e0e0] bg-[#fafafc] hover:bg-[#f5f5f7] px-4 py-2 text-[13px] font-medium text-[#1d1d1f] active-press transition-colors"
          >
            Close
          </button>
        )}
      </div>

      {/* Printable Showroom Tent / Sticker Card (Targeted by @media print) */}
      <div
        id="printable-label"
        className="w-full max-w-[480px] rounded-[18px] border-2 border-[#1d1d1f] bg-[#ffffff] p-8 text-[#1d1d1f] print:border-2 print:border-black print:rounded-none print:p-6 print:m-0 print:w-full print:max-w-none"
      >
        {/* Header: Business & Showroom Tag */}
        <div className="flex items-center justify-between border-b-2 border-[#1d1d1f] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Washy"
              width={26}
              height={26}
              className="rounded-[5px] object-contain"
            />
            <span className="text-[17px] font-bold tracking-tight uppercase">
              Washy
            </span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#7a7a7a]">
            Showroom Display
          </span>
        </div>

        {/* Model Number Pill & Origin */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-[#1d1d1f] px-3 py-1 text-[12px] font-bold text-white uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="font-mono text-[14px] font-semibold text-[#1d1d1f]">
              {product.model_number}
            </span>
          </div>

          {product.origin_country && (
            <span className="text-[11px] font-medium text-[#7a7a7a]">
              Made in {product.origin_country}
            </span>
          )}
        </div>

        {/* Product Names: English & Khmer */}
        <div className="mb-5">
          <h2 className="text-[20px] font-bold leading-tight text-[#1d1d1f]">
            {productNameEn}
          </h2>
          {productNameKm && (
            <p className="mt-1 text-[16px] font-medium text-[#333333] leading-relaxed">
              {productNameKm}
            </p>
          )}
        </div>

        {/* Center: QR Code Pedestal */}
        <div className="my-6 flex flex-col items-center justify-center p-4 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0] print:bg-transparent print:border">
          {qrDataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={qrDataUrl}
              alt={`QR Code for ${product.model_number}`}
              className="h-44 w-44 object-contain"
            />
          ) : (
            <div className="h-44 w-44 flex items-center justify-center text-[#7a7a7a] text-[13px]">
              Generating QR Code...
            </div>
          )}

          <div className="mt-3 text-center">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc]">
              Scan with Phone Camera
            </p>
            <p className="text-[11px] text-[#333333] font-medium mt-0.5">
              ស្កេនដើម្បីមើលលក្ខណៈបច្ចេកទេស និងតម្លៃ
            </p>
          </div>
        </div>

        {/* Key Verified Technical Specifications */}
        {primarySpecs.length > 0 && (
          <div className="border-t border-[#e0e0e0] pt-4 mb-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7a7a7a] mb-2">
              Verified Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {primarySpecs.map((spec) => (
                <div key={spec.id || spec.spec_key} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1d1d1f] block leading-tight">
                      {spec.spec_key}
                    </span>
                    <span className="text-[#333333] font-mono text-[11px]">
                      {spec.value_text || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer: Permanent Link and Contact */}
        <div className="border-t border-[#e0e0e0] pt-3 text-center text-[10px] text-[#7a7a7a] font-mono break-all">
          <span>{url}</span>
        </div>
      </div>
    </div>
  );
}
