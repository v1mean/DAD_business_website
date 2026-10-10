"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#fafafc] text-[#1d1d1f]">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1440px] w-full">
        {children}
      </main>
    </div>
  );
}
