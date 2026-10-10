"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import type { MockProductWithDetails } from "@/data/mock-products";
import type { Category } from "@/types/database";
import { ProductCard } from "@/components/catalog/product-card";
import { CatalogFilter } from "@/components/catalog/catalog-filter";
import { SearchX } from "lucide-react";

interface CatalogExplorerProps {
  initialProducts: MockProductWithDetails[];
  categories?: Category[];
}

export function CatalogExplorer({
  initialProducts,
}: CatalogExplorerProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { t } = useLanguage();

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Distinct Brands extracted from live products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [initialProducts]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.in_stock);
    }

    // Search query (matches model, brand, en name, km name, specs)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesModel = p.model_number.toLowerCase().includes(q);
        const matchesTranslation = p.translations.some(
          (tr) =>
            tr.name.toLowerCase().includes(q) ||
            tr.description.toLowerCase().includes(q)
        );
        const matchesSpec = p.specifications.some((spec) =>
          (spec.value_text || "").toLowerCase().includes(q)
        );
        return matchesBrand || matchesModel || matchesTranslation || matchesSpec;
      });
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      // Newest
      result.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
    }

    return result;
  }, [initialProducts, selectedCategory, selectedBrand, inStockOnly, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setInStockOnly(false);
    setSortBy("newest");
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
          {t("catalog.title")}
        </h1>
        <p className="mt-2 text-[15px] sm:text-[17px] text-[#7a7a7a]">
          {t("catalog.subtitle")}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-10">
        <CatalogFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableBrands={availableBrands}
          totalResults={filteredProducts.length}
          onReset={handleResetFilters}
        />
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[18px] border border-[#e0e0e0] bg-[#fafafc] p-12 text-center my-8">
          <SearchX className="mx-auto h-12 w-12 text-[#7a7a7a] mb-4" />
          <h3 className="text-[19px] font-semibold text-[#1d1d1f]">
            {t("filter.empty_title")}
          </h3>
          <p className="mt-2 text-[14px] text-[#7a7a7a] max-w-md mx-auto">
            {t("filter.empty_desc")}
          </p>
          <div className="mt-6">
            <button
              onClick={handleResetFilters}
              type="button"
              className="rounded-full bg-[#0066cc] px-6 py-2.5 text-[14px] font-medium text-white active-press"
            >
              {t("filter.clear")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
