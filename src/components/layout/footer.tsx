"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { getTelegramUsername } from "@/lib/telegram";
import { MOCK_CATEGORIES } from "@/data/mock-products";
import { Send, MapPin, Clock } from "lucide-react";

export function Footer() {
  const { t, isKhmer } = useLanguage();
  const telegramUsername = getTelegramUsername();

  return (
    <footer className="border-t border-[#e0e0e0] bg-[#f5f5f7] text-[#333333] select-none">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="Washy"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-[18px] font-semibold tracking-tight text-[#1d1d1f]">
                Washy
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-[#7a7a7a]">
              {t("footer.desc")}
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-3">
              {t("footer.categories")}
            </h4>
            <ul className="text-[15px] sm:text-[16px] leading-[2.2]">
              {MOCK_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-[#333333] hover:text-[#0066cc] transition-colors"
                  >
                    {isKhmer ? cat.name_km : cat.name_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-3">
              {t("footer.quick_links")}
            </h4>
            <ul className="text-[15px] sm:text-[16px] leading-[2.2]">
              <li>
                <Link
                  href="/"
                  className="text-[#333333] hover:text-[#0066cc] transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-[#333333] hover:text-[#0066cc] transition-colors"
                >
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[#333333] hover:text-[#0066cc] transition-colors"
                >
                  {t("nav.admin")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store & Telegram Contact */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-3">
              {t("footer.contact")}
            </h4>
            <div className="space-y-3 text-[14px] text-[#333333]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-[#0066cc] shrink-0" />
                <span>{t("footer.address")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#0066cc] shrink-0" />
                <span>{t("footer.hours")}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://t.me/${telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white px-5 py-2 text-[13px] font-medium transition-all active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Telegram (@{telegramUsername})</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Fine-Print Row */}
        <div className="mt-12 pt-8 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#7a7a7a]">
          <p>© 2026 {t("footer.rights")}</p>
          <p>{t("footer.legal")}</p>
        </div>
      </div>
    </footer>
  );
}
