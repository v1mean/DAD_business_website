// TypeScript type definitions for database entities.
// These types mirror the database schema defined in Section 2 of the spec.
// Full implementation will be completed in Phase 3.

import type { Locale, ProductStatus, VerificationStatus, StaffRole } from "@/lib/constants";
export type { Locale, ProductStatus, VerificationStatus, StaffRole };

// --- Categories ---
export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_km: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Products ---
export interface Product {
  id: string;
  slug: string;
  brand: string;
  model_number: string;
  category_id: string;
  origin_country: string | null;
  release_year: number | null;
  price: number | null;
  currency: string;
  show_price: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

// --- Product Translations ---
export interface ProductTranslation {
  id: string;
  product_id: string;
  locale: Locale;
  name: string;
  description: string;
  warranty_text: string | null;
  created_at: string;
  updated_at: string;
}

// --- Product Specifications ---
export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_key: string;
  value_text: string | null;
  value_numeric: number | null;
  unit: string | null;
  display_order: number;
  source_note: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

// --- Product Images ---
export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text_en: string | null;
  alt_text_km: string | null;
  display_order: number;
  created_at: string;
}

// --- Profiles ---
export interface Profile {
  id: string;
  display_name: string;
  role: StaffRole;
  created_at: string;
  updated_at: string;
}

// --- Composite types for API responses ---
export interface ProductWithDetails extends Product {
  category: Category | null;
  translations: ProductTranslation[];
  specifications: ProductSpecification[];
  images: ProductImage[];
}
