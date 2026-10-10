"use client";

import React from "react";
import { useLanguage } from "@/context/language-context";
import { MOCK_CATEGORIES } from "@/data/mock-products";
import { Search, X, ArrowUpDown } from "lucide-react";

interface CatalogFilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  inStockOnly: boolean;
  onInStockChange: (val: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  availableBrands: string[];
  totalResults: number;
  onReset: () => void;
}

export function CatalogFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortChange,
  availableBrands,
  totalResults,
  onReset,
}: CatalogFilterProps) {
  const { t, isKhmer } = useLanguage();

  const isFiltered =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    inStockOnly;

  return (
    <div className="space-y-6">
      {/* Search Bar - Signature Pill Input from DESIGN.md */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4.5 h-4 w-4 text-[#7a7a7a] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("nav.search_placeholder")}
            className="h-[44px] w-full rounded-full border border-[#e0e0e0] bg-[#ffffff] pl-11 pr-10 text-[15px] sm:text-[17px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              type="button"
              className="absolute right-3.5 p-1 text-[#7a7a7a] hover:text-[#1d1d1f]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
        <button
          onClick={() => onCategoryChange("all")}
          type="button"
          className={`shrink-0 rounded-full px-4 py-2 text-[13px] sm:text-[14px] font-medium transition-all active-press ${
            selectedCategory === "all"
              ? "bg-[#0066cc] text-white shadow-sm"
              : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          {t("filter.all_categories")}
        </button>

        {MOCK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] sm:text-[14px] font-medium transition-all active-press ${
                isSelected
                  ? "bg-[#0066cc] text-white shadow-sm"
                  : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
              }`}
            >
              {isKhmer ? cat.name_km : cat.name_en}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar: Brands, In-Stock Toggle, Sort, Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0f0f0] text-[13px] text-[#7a7a7a]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#333333] font-medium">{t("filter.brand")}:</span>
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="rounded-full border border-[#e0e0e0] bg-[#ffffff] px-3 py-1.5 text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
            >
              <option value="all">{t("filter.all_brands")}</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Only Checkbox Button */}
          <button
            onClick={() => onInStockChange(!inStockOnly)}
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
              inStockOnly
                ? "border-[#2e7d32] bg-[#e8f5e9] text-[#2e7d32] font-medium"
                : "border-[#e0e0e0] bg-white text-[#7a7a7a] hover:bg-[#f5f5f7]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                inStockOnly ? "bg-[#2e7d32]" : "bg-[#b0b0b5]"
              }`}
            />
            <span>{t("filter.in_stock")}</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              type="button"
              className="text-[13px] text-[#0066cc] hover:underline transition-colors"
            >
              {t("filter.clear")}
            </button>
          )}
        </div>

        {/* Right side: Sort By & Results Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="hidden sm:inline-block">
            {t("filter.results_count").replace("{count}", String(totalResults))}
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#7a7a7a]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-full border border-[#e0e0e0] bg-[#ffffff] px-3 py-1.5 text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
            >
              <option value="newest">{t("filter.sort_newest")}</option>
              <option value="price_asc">{t("filter.sort_price_asc")}</option>
              <option value="price_desc">{t("filter.sort_price_desc")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
