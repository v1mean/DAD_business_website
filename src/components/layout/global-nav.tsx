"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import { Send, Menu, X, Shield, Globe } from "lucide-react";
import { getTelegramUsername } from "@/lib/telegram";

export function GlobalNav() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const telegramUsername = getTelegramUsername();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.products") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000] text-white select-none">
      <div className="mx-auto flex h-[44px] max-w-[1440px] items-center justify-between px-4 sm:px-8 text-[12px] font-normal tracking-[-0.12px]">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <Image
              src="/logo.png"
              alt="Washy"
              width={26}
              height={26}
              className="rounded-[6px] object-contain"
            />
            <span className="text-[14px] font-semibold tracking-tight text-white">
              Washy
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-6 text-white/90">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-white ${
                  isActive ? "text-white font-medium" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <a
            href={`https://t.me/${telegramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
          >
            <Send className="h-3 w-3 text-[#2997ff]" />
            <span>{t("nav.telegram")}</span>
          </a>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
          >
            <Shield className="h-3 w-3" />
            <span>{t("nav.admin")}</span>
          </Link>
        </nav>

        {/* Right Action Cluster: Language Switcher & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Bilingual Switcher (KM / EN) */}
          <button
            onClick={() => setLocale(locale === "en" ? "km" : "en")}
            type="button"
            className="flex items-center gap-1.5 rounded-[8px] bg-[#1d1d1f] hover:bg-[#272729] px-2.5 py-1 text-[11px] font-medium text-white transition-all active:scale-95 border border-white/10"
            title="Switch Language / ផ្លាស់ប្តូរភាសា"
            aria-label="Toggle language"
          >
            <Globe className="h-3 w-3 text-[#2997ff]" />
            <span>{locale === "en" ? "ខ្មែរ" : "English"}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-1 md:hidden text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#121214] px-6 py-4 md:hidden text-[14px]">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://t.me/${telegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-[#2997ff]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t("nav.telegram")} (@{telegramUsername})</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-white/50 hover:text-white"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{t("nav.admin")}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
