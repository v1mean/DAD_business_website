"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  QrCode,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("staff@dadelectronics.com");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/dad_staff_email=([^;]+)/);
    if (match && match[1]) {
      const savedEmail = decodeURIComponent(match[1]);
      // Use requestAnimationFrame to avoid synchronous state update in effect
      requestAnimationFrame(() => setUserEmail(savedEmail));
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleSignOut = async () => {
    document.cookie = "dad_staff_session=; path=/; max-age=0;";
    document.cookie = "dad_staff_email=; path=/; max-age=0;";
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    {
      href: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/products",
      label: "All Products",
      icon: Package,
      exact: true,
    },
    {
      href: "/admin/products/new",
      label: "Add Product",
      icon: PlusCircle,
      exact: true,
    },
    {
      href: "/admin/labels",
      label: "QR Labels",
      icon: QrCode,
      exact: true,
    },
  ];

  const content = (
    <div className="flex h-full flex-col justify-between bg-[#ffffff] border-r border-[#e0e0e0] p-4 text-[#1d1d1f] select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-[#f0f0f0]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Washy"
              width={30}
              height={30}
              className="object-contain"
            />
            <div>
              <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] block leading-tight">
                Washy
              </span>
              <span className="text-[11px] text-[#7a7a7a] flex items-center gap-1">
                <Shield className="h-3 w-3 text-[#0066cc]" />
                Staff Management
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-[#7a7a7a]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#0066cc] text-white"
                    : "text-[#333333] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#7a7a7a]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Sign Out */}
      <div className="border-t border-[#f0f0f0] pt-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px] text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-[#0066cc]" />
            <span>Public Catalog</span>
          </span>
          <span className="text-[11px] text-[#7a7a7a]">Preview ↗</span>
        </Link>

        <div className="rounded-[10px] bg-[#f5f5f7] p-3 text-[12px]">
          <div className="font-medium text-[#1d1d1f] truncate">{userEmail}</div>
          <div className="text-[11px] text-[#7a7a7a]">Staff Administrator</div>
        </div>

        <button
          onClick={handleSignOut}
          type="button"
          className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-[13px] text-[#d32f2f] hover:bg-[#ffebee] transition-colors active-press"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Top Bar with Hamburger */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-[#e0e0e0] px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Washy"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-[14px] font-semibold text-[#1d1d1f]">
            Washy Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-[#1d1d1f] rounded-[6px] hover:bg-[#f5f5f7]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
