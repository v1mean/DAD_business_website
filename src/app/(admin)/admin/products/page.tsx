"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getAdminProducts,
  updateProductStatus,
  deleteProduct,
} from "@/lib/supabase/admin-service";
import type { ProductWithDetails, ProductStatus } from "@/types/database";
import { MOCK_CATEGORIES } from "@/data/mock-products";
import {
  PlusCircle,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Archive,
  QrCode,
} from "lucide-react";
import { QrModal } from "@/components/qr/qr-modal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedQrProduct, setSelectedQrProduct] = useState<ProductWithDetails | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getAdminProducts({
      status: selectedStatus,
      categoryId: selectedCategory,
      search: searchQuery,
    });
    setProducts(data);
    setLoading(false);
  }, [selectedStatus, selectedCategory, searchQuery]);

  useEffect(() => {
    let ignore = false;
    const fetchCurrent = async () => {
      setLoading(true);
      const data = await getAdminProducts({
        status: selectedStatus,
        categoryId: selectedCategory,
        search: searchQuery,
      });
      if (!ignore) {
        setProducts(data);
        setLoading(false);
      }
    };
    fetchCurrent();
    return () => {
      ignore = true;
    };
  }, [selectedStatus, selectedCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleStatusChange = async (id: string, newStatus: ProductStatus) => {
    setActionLoadingId(id);
    const res = await updateProductStatus(id, newStatus);
    if (res.success) {
      await loadProducts();
    } else {
      alert(res.error || "Failed to update status");
    }
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }
    setActionLoadingId(id);
    const res = await deleteProduct(id);
    if (res.success) {
      await loadProducts();
    } else {
      alert(res.error || "Failed to delete product");
    }
    setActionLoadingId(null);
  };

  const statusTabs = [
    { id: "all", label: "All Items" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Drafts" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-[#1d1d1f]">
            Product Management
          </h1>
          <p className="mt-1 text-[14px] text-[#7a7a7a]">
            Add, update specifications, toggle price visibility, and publish electronics
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-5 py-2.5 text-[14px] font-medium text-white active-press transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {statusTabs.map((tab) => {
              const active = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  type="button"
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-[#0066cc] text-white"
                      : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Category Inputs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-[#e0e0e0] bg-[#ffffff] px-3.5 py-1.5 text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
            >
              <option value="all">All Categories</option>
              {MOCK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en}
                </option>
              ))}
            </select>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model or brand..."
                className="h-[36px] w-48 sm:w-64 rounded-full border border-[#e0e0e0] bg-[#ffffff] pl-9 pr-3 text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
              />
              <Search className="absolute left-3 h-3.5 w-3.5 text-[#7a7a7a]" />
            </form>
          </div>
        </div>
      </div>

      {/* Main Products Table */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#fafafc] border-b border-[#f0f0f0] text-[12px] uppercase tracking-wider text-[#7a7a7a]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Model & Brand</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Price</th>
                <th className="px-6 py-3.5 font-semibold">Visibility</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7a7a7a]">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7a7a7a]">
                    No appliances found matching this filter.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const enTranslation =
                    p.translations.find((t) => t.locale === "en") || p.translations[0];
                  const productName = enTranslation?.name || `${p.brand} ${p.model_number}`;
                  const isActionLoading = actionLoadingId === p.id;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#fafafc] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1d1d1f]">
                          {productName}
                        </div>
                        <div className="text-[12px] text-[#7a7a7a] font-mono mt-0.5">
                          {p.brand} • {p.model_number} • slug: {p.slug}
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
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[11px] font-medium text-[#2e7d32]">
                            <Eye className="h-3 w-3" />
                            <span>Public Price</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-medium text-[#7a7a7a]">
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
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Publish / Draft Toggle */}
                          {p.status === "published" ? (
                            <button
                              onClick={() => handleStatusChange(p.id, "archived")}
                              disabled={isActionLoading}
                              title="Archive product"
                              className="p-1.5 text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-[6px]"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(p.id, "published")}
                              disabled={isActionLoading}
                              title="Publish product"
                              className="p-1.5 text-[#2e7d32] hover:bg-[#e8f5e9] rounded-[6px]"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}

                          {/* QR Code & Showroom Label Button */}
                          <button
                            onClick={() => setSelectedQrProduct(p)}
                            type="button"
                            title="View & Print Showroom QR Label"
                            className="p-1.5 text-[#0066cc] hover:bg-[#e3f2fd] rounded-[6px]"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>

                          {/* Edit Button */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            title="Edit product"
                            className="p-1.5 text-[#0066cc] hover:bg-[#e3f2fd] rounded-[6px]"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Public View */}
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            title="Open showroom view"
                            className="p-1.5 text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-[6px]"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(p.id, productName)}
                            disabled={isActionLoading}
                            title="Delete product"
                            className="p-1.5 text-[#d32f2f] hover:bg-[#ffebee] rounded-[6px]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Showroom Modal */}
      {selectedQrProduct && (
        <QrModal
          product={selectedQrProduct}
          isOpen={!!selectedQrProduct}
          onClose={() => setSelectedQrProduct(null)}
        />
      )}
    </div>
  );
}
