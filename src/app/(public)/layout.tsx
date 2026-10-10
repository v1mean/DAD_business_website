"use client";

import React, { Suspense } from "react";
import { LanguageProvider } from "@/context/language-context";
import { GlobalNav } from "@/components/layout/global-nav";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col bg-[#ffffff] text-[#1d1d1f]">
        <Suspense fallback={<header className="h-[44px] w-full bg-[#000000]" />}>
          <GlobalNav />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
