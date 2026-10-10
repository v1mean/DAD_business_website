"use client";

import React, { useState, useEffect } from "react";
import type { ProductWithDetails } from "@/types/database";
import {
  getProductDestinationUrl,
  generateQrSvg,
  generateQrDataUrl,
  downloadSvgFile,
  downloadPngFile,
} from "@/lib/qr";
import { ShowroomLabelCard } from "./showroom-label-card";
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  QrCode as QrIcon,
} from "lucide-react";

interface QrModalProps {
  product: ProductWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export function QrModal({ product, isOpen, onClose }: QrModalProps) {
  const [viewMode, setViewMode] = useState<"quick" | "printable">("quick");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const url = getProductDestinationUrl(product.slug);
  const enTrans = product.translations.find((t) => t.locale === "en");
  const productName = enTrans?.name || `${product.brand} ${product.model_number}`;

  useEffect(() => {
    if (isOpen) {
      generateQrSvg(url, { color: "#1d1d1f" }).then(setQrSvg);
      generateQrDataUrl(url, { width: 1024 }).then(setQrDataUrl);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (qrDataUrl) {
      downloadPngFile(qrDataUrl, `${product.model_number}-QR`);
    }
  };

  const handleDownloadSvg = () => {
    if (qrSvg) {
      downloadSvgFile(qrSvg, `${product.model_number}-QR`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-2 text-[#7a7a7a] hover:text-[#1d1d1f] rounded-full hover:bg-[#f5f5f7] transition-colors"
          title="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {viewMode === "printable" ? (
          <div>
            <ShowroomLabelCard product={product} onClose={() => setViewMode("quick")} />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {/* Header */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0066cc]/10 px-3 py-1 text-[12px] font-semibold text-[#0066cc] mb-3">
              <QrIcon className="h-3.5 w-3.5" />
              <span>Showroom QR Code</span>
            </div>

            <h3 className="text-[20px] font-semibold text-[#1d1d1f] tracking-tight">
              {product.brand} {product.model_number}
            </h3>
            <p className="mt-1 text-[13px] text-[#7a7a7a] max-w-sm line-clamp-1">
              {productName}
            </p>

            {/* QR Code Canvas */}
            <div className="my-6 rounded-[14px] border border-[#e0e0e0] bg-[#fafafc] p-6">
              {qrSvg ? (
                <div
                  className="h-52 w-52 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="h-52 w-52 flex items-center justify-center text-[#7a7a7a] text-[13px]">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Permanent Link Copy Bar */}
            <div className="w-full rounded-[10px] border border-[#e0e0e0] bg-[#f5f5f7] p-2.5 flex items-center justify-between gap-2 text-[12px] mb-6">
              <span className="font-mono text-[#333333] truncate text-left pl-1">
                {url}
              </span>
              <button
                onClick={handleCopy}
                type="button"
                className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white border border-[#e0e0e0] px-3 py-1 text-[11px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] active-press transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-[#2e7d32]" />
                    <span className="text-[#2e7d32]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPng}
                type="button"
                className="flex items-center justify-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-4 py-2.5 text-[13px] font-medium text-white active-press transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download PNG (High-Res)</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                type="button"
                className="flex items-center justify-center gap-2 rounded-full border border-[#e0e0e0] bg-white hover:bg-[#f5f5f7] px-4 py-2.5 text-[13px] font-medium text-[#1d1d1f] active-press transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download SVG (Vector)</span>
              </button>

              <button
                onClick={() => setViewMode("printable")}
                type="button"
                className="sm:col-span-2 flex items-center justify-center gap-2 rounded-full border border-[#1d1d1f] bg-[#1d1d1f] hover:bg-[#333333] px-4 py-2.5 text-[13px] font-medium text-white active-press transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print Showroom Label Card</span>
              </button>
            </div>

            <div className="mt-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] text-[#7a7a7a] hover:text-[#0066cc] transition-colors"
              >
                <span>Preview destination page</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
