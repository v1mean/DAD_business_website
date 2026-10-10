// Supabase Product Data Access Layer
// Provides safe, server-side data fetching with price privacy enforcement.

import { createPublicClient } from "./public";
import type { Category } from "@/types/database";
import type { MockProductWithDetails } from "@/data/mock-products";
import {
  MOCK_CATEGORIES,
  getAllProducts,
  getProductBySlug,
} from "@/data/mock-products";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!url &&
    !!anonKey &&
    !url.includes("your-project-id") &&
    anonKey !== "your-anon-key-here"
  );
}

/**
 * Fetch all active public categories.
 */
export async function getPublicCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.error("Error fetching categories from Supabase, using fallback:", err);
    return MOCK_CATEGORIES;
  }
}

/**
 * Fetch published products for the public catalog with price privacy enforcement.
 */
export async function getPublicProducts(): Promise<MockProductWithDetails[]> {
  if (!isSupabaseConfigured()) {
    // Apply price privacy guard to mock data as well
    return getAllProducts().map(sanitizeProductPrice);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        translations:product_translations(*),
        specifications:product_specifications(*),
        images:product_images(*)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return getAllProducts().map(sanitizeProductPrice);
    }

    // Sanitize prices before returning
    return data.map((item) =>
      sanitizeProductPrice({
        ...item,
        in_stock: true, // Default active model tracking
      } as MockProductWithDetails)
    );
  } catch (err) {
    console.error("Error fetching products from Supabase, using fallback:", err);
    return getAllProducts().map(sanitizeProductPrice);
  }
}

/**
 * Fetch a single published product by its permanent slug (QR code destination).
 * Enforces price privacy and returns null for draft/archived products.
 */
export async function getPublicProductBySlug(
  slug: string
): Promise<MockProductWithDetails | null> {
  if (!isSupabaseConfigured()) {
    const found = getProductBySlug(slug);
    return found ? sanitizeProductPrice(found) : null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        translations:product_translations(*),
        specifications:product_specifications(*),
        images:product_images(*)
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      // Check fallback mock products
      const fallback = getProductBySlug(slug);
      return fallback ? sanitizeProductPrice(fallback) : null;
    }

    return sanitizeProductPrice({
      ...data,
      in_stock: true,
    } as MockProductWithDetails);
  } catch (err) {
    console.error(`Error fetching product [${slug}] from Supabase:`, err);
    const fallback = getProductBySlug(slug);
    return fallback ? sanitizeProductPrice(fallback) : null;
  }
}

/**
 * CRITICAL SECURITY FUNCTION: Price Privacy Guard
 * If show_price is false, scrub the price to null so private figures are
 * never transmitted to the browser or public API responses.
 */
function sanitizeProductPrice(product: MockProductWithDetails): MockProductWithDetails {
  if (!product.show_price) {
    return {
      ...product,
      price: null,
    };
  }
  return product;
}
