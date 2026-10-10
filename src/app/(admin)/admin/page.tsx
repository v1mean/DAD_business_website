"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminDashboardStats,
  getAdminProducts,
  type DashboardStats,
} from "@/lib/supabase/admin-service";
import type { ProductWithDetails } from "@/types/database";
import {
  Package,
  CheckCircle2,
  FileEdit,
  Archive,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    categoriesCount: 0,
  });
  const [recentProducts, setRecentProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [statsData, productsData] = await Promise.all([
        getAdminDashboardStats(),
        getAdminProducts(),
      ]);
      setStats(statsData);
      setRecentProducts(productsData.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  const metricCards = [
    {
      title: "Total Appliances",
      value: stats.total,
      icon: Package,
      color: "text-[#0066cc]",
      bg: "bg-[#0066cc]/10",
      desc: "Models tracked in system",
    },
    {
      title: "Published (Live)",
      value: stats.published,
      icon: CheckCircle2,
      color: "text-[#2e7d32]",
      bg: "bg-[#2e7d32]/10",
      desc: "Visible to showroom customers",
    },
    {
      title: "Drafts",
      value: stats.draft,
      icon: FileEdit,
      color: "text-[#f57c00]",
      bg: "bg-[#f57c00]/10",
      desc: "Pending review / unverified",
    },
    {
      title: "Archived",
      value: stats.archived,
      icon: Archive,
      color: "text-[#7a7a7a]",
      bg: "bg-[#7a7a7a]/10",
      desc: "Discontinued models",
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-[#1d1d1f]">
            Catalog Overview
          </h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-[#7a7a7a]">
            Manage electronics appliances, specifications, and showroom QR codes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-5 py-2.5 text-[14px] font-medium text-white active-press transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-white hover:bg-[#f5f5f7] px-4 py-2.5 text-[14px] font-medium text-[#1d1d1f] active-press transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-[#7a7a7a]" />
            <span>Showroom View</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards (DESIGN.md utility-card layout) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 transition-all hover:border-[#b0b0b5]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#7a7a7a]">
                  {card.title}
                </span>
                <span className={`p-2 rounded-[10px] ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[32px] font-bold text-[#1d1d1f]">
                  {loading ? "..." : card.value}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#7a7a7a]">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Products Table */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] p-6">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
              Recent Appliances
            </h2>
            <p className="text-[13px] text-[#7a7a7a]">
              Latest models added to your inventory catalog
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0066cc] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#fafafc] border-b border-[#f0f0f0] text-[12px] uppercase tracking-wider text-[#7a7a7a]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Model & Brand</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Price</th>
                <th className="px-6 py-3.5 font-semibold">Price Visibility</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#7a7a7a]">
                    Loading catalog data...
                  </td>
                </tr>
              ) : recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#7a7a7a]">
                    No appliances found. Click &quot;Add New Product&quot; to start.
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => {
                  const enTranslation =
                    p.translations.find((t) => t.locale === "en") || p.translations[0];

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#fafafc] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1d1d1f]">
                          {enTranslation?.name || `${p.brand} ${p.model_number}`}
                        </div>
                        <div className="text-[12px] text-[#7a7a7a] font-mono">
                          {p.brand} • {p.model_number}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[#333333]">
                        {p.category?.name_en || "General Appliance"}
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#1d1d1f]">
                        {p.price !== null ? `$${p.price}` : "Not Set"}
                      </td>

                      <td className="px-6 py-4">
                        {p.show_price ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[12px] text-[#2e7d32]">
                            <Eye className="h-3 w-3" />
                            <span>Public</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[12px] text-[#7a7a7a]">
                            <EyeOff className="h-3 w-3" />
                            <span>Inquiry Only</span>
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            p.status === "published"
                              ? "bg-[#e3f2fd] text-[#0066cc]"
                              : p.status === "draft"
                              ? "bg-[#fff3e0] text-[#f57c00]"
                              : "bg-[#f5f5f7] text-[#7a7a7a]"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-[6px] border border-[#e0e0e0] bg-white px-3 py-1.5 text-[13px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
