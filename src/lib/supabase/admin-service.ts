// Admin Database Service
// Handles product CRUD, metrics, and bilingual translations management.

import { createClient } from "./client";
import type {
  ProductWithDetails,
  ProductStatus,
} from "@/types/database";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
} from "@/data/mock-products";

export interface DashboardStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  categoriesCount: number;
}

export interface SaveProductInput {
  id?: string;
  slug: string;
  brand: string;
  model_number: string;
  category_id: string;
  origin_country?: string | null;
  release_year?: number | null;
  price?: number | null;
  currency: string;
  show_price: boolean;
  status: ProductStatus;
  translations: {
    en: { name: string; description: string; warranty_text?: string | null };
    km: { name: string; description: string; warranty_text?: string | null };
  };
  specifications: Array<{
    id?: string;
    spec_key: string;
    value_text?: string | null;
    value_numeric?: number | null;
    unit?: string | null;
    display_order: number;
    source_note?: string | null;
    verification_status: "verified" | "unverified" | "not_provided";
  }>;
  image_url?: string | null;
}

/**
 * Get overview counts for the Admin Dashboard.
 */
export async function getAdminDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = createClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("status");

    if (error || !products) {
      // Fallback calculation from local data
      const total = MOCK_PRODUCTS.length;
      const published = MOCK_PRODUCTS.filter((p) => p.status === "published").length;
      const draft = MOCK_PRODUCTS.filter((p) => p.status === "draft").length;
      const archived = MOCK_PRODUCTS.filter((p) => p.status === "archived").length;
      return { total, published, draft, archived, categoriesCount: MOCK_CATEGORIES.length };
    }

    const total = products.length;
    const published = products.filter((p) => p.status === "published").length;
    const draft = products.filter((p) => p.status === "draft").length;
    const archived = products.filter((p) => p.status === "archived").length;

    const { count: catCount } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    return {
      total,
      published,
      draft,
      archived,
      categoriesCount: catCount || MOCK_CATEGORIES.length,
    };
  } catch (err) {
    console.error("Error getting dashboard stats:", err);
    return {
      total: MOCK_PRODUCTS.length,
      published: MOCK_PRODUCTS.length,
      draft: 0,
      archived: 0,
      categoriesCount: MOCK_CATEGORIES.length,
    };
  }
}

/**
 * Get all products for the admin table with filters.
 */
export async function getAdminProducts({
  status,
  categoryId,
  search,
}: {
  status?: string;
  categoryId?: string;
  search?: string;
} = {}): Promise<ProductWithDetails[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        translations:product_translations(*),
        specifications:product_specifications(*),
        images:product_images(*)
      `)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Local fallback with filtering
      let result = [...MOCK_PRODUCTS];
      if (status && status !== "all") {
        result = result.filter((p) => p.status === status);
      }
      if (categoryId && categoryId !== "all") {
        result = result.filter((p) => p.category_id === categoryId);
      }
      if (search && search.trim() !== "") {
        const q = search.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.brand.toLowerCase().includes(q) ||
            p.model_number.toLowerCase().includes(q) ||
            p.translations.some((t) => t.name.toLowerCase().includes(q))
        );
      }
      return result as ProductWithDetails[];
    }

    let products = data as ProductWithDetails[];
    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.brand.toLowerCase().includes(q) ||
          p.model_number.toLowerCase().includes(q) ||
          p.translations.some((t) => t.name.toLowerCase().includes(q))
      );
    }
    return products;
  } catch (err) {
    console.error("Error fetching admin products:", err);
    return MOCK_PRODUCTS as ProductWithDetails[];
  }
}

/**
 * Get single product by ID for editing.
 */
export async function getAdminProductById(
  id: string
): Promise<ProductWithDetails | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        translations:product_translations(*),
        specifications:product_specifications(*),
        images:product_images(*)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      const local = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
      return local ? (local as ProductWithDetails) : null;
    }

    return data as ProductWithDetails;
  } catch (err) {
    console.error("Error fetching product by id:", err);
    const local = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
    return local ? (local as ProductWithDetails) : null;
  }
}

/**
 * Save (create or update) a product and its associated translations and specifications.
 */
export async function saveProduct(input: SaveProductInput): Promise<{ success: boolean; productId?: string; error?: string }> {
  try {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to save product" };
    }

    return { success: true, productId: data.productId };
  } catch (err: unknown) {
    console.error("Error saving product:", err);
    const message = err instanceof Error ? err.message : "Failed to save product";
    return { success: false, error: message };
  }
}

/**
 * Quick toggle of product status (Draft, Published, Archived).
 */
export async function updateProductStatus(
  id: string,
  status: ProductStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to update status" };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error updating product status:", err);
    const message = err instanceof Error ? err.message : "Failed to update status";
    return { success: false, error: message };
  }
}

/**
 * Delete a product.
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to delete product" };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error deleting product:", err);
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return { success: false, error: message };
  }
}

/**
 * Upload an appliance photo directly to Supabase Storage 'product-images' bucket.
 */
export async function uploadProductImage(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to upload image" };
    }

    return { success: true, url: data.url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, error: message };
  }
}
