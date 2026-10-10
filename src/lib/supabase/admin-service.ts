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
    const supabase = createClient();

    // 1. Upsert core product
    const productPayload = {
      slug: input.slug.trim(),
      brand: input.brand.trim(),
      model_number: input.model_number.trim(),
      category_id: input.category_id,
      origin_country: input.origin_country || null,
      release_year: input.release_year || null,
      price: input.price !== undefined && input.price !== null ? input.price : null,
      currency: input.currency || "USD",
      show_price: input.show_price,
      status: input.status,
    };

    let productId = input.id;

    if (productId) {
      // Update existing
      const { error: prodError } = await supabase
        .from("products")
        .update(productPayload)
        .eq("id", productId);
      if (prodError) throw prodError;
    } else {
      // Insert new
      const { data: newProd, error: prodError } = await supabase
        .from("products")
        .insert(productPayload)
        .select("id")
        .single();
      if (prodError) throw prodError;
      productId = newProd.id;
    }

    // 2. Upsert English and Khmer translations
    const translationsToUpsert = [
      {
        product_id: productId,
        locale: "en",
        name: input.translations.en.name.trim(),
        description: input.translations.en.description.trim(),
        warranty_text: input.translations.en.warranty_text || null,
      },
      {
        product_id: productId,
        locale: "km",
        name: input.translations.km.name.trim(),
        description: input.translations.km.description.trim(),
        warranty_text: input.translations.km.warranty_text || null,
      },
    ];

    const { error: transError } = await supabase
      .from("product_translations")
      .upsert(translationsToUpsert, { onConflict: "product_id,locale" });

    if (transError) throw transError;

    // 3. Replace specifications
    if (productId) {
      await supabase
        .from("product_specifications")
        .delete()
        .eq("product_id", productId);

      if (input.specifications.length > 0) {
        const specsToInsert = input.specifications.map((spec, index) => ({
          product_id: productId,
          spec_key: spec.spec_key.trim(),
          value_text: spec.value_text || null,
          value_numeric: spec.value_numeric || null,
          unit: spec.unit || null,
          display_order: index + 1,
          source_note: spec.source_note || null,
          verification_status: spec.verification_status,
        }));

        const { error: specsError } = await supabase
          .from("product_specifications")
          .insert(specsToInsert);

        if (specsError) throw specsError;
      }
    }

    // 4. Update or replace product image
    if (productId && input.image_url) {
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", productId);

      const { error: imgError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          storage_path: input.image_url,
          alt_text_en: input.translations.en.name,
          alt_text_km: input.translations.km.name,
          display_order: 1,
        });

      if (imgError) console.warn("Notice updating product image:", imgError);
    }

    return { success: true, productId };
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
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
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
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
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
    const supabase = createClient();
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `appliances/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.warn("Storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, error: message };
  }
}
