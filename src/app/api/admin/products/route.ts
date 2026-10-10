import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SaveProductInput } from "@/lib/supabase/admin-service";
import type { ProductStatus } from "@/types/database";

async function verifyStaffSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("dad_staff_session")?.value;
  return session === "authenticated";
}

// POST: Create or Update Product
export async function POST(request: Request) {
  try {
    const isStaff = await verifyStaffSession();
    if (!isStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Staff session required." },
        { status: 401 }
      );
    }

    const input: SaveProductInput = await request.json();
    const supabase = createAdminClient();

    // Resolve category_id if it's a mock ID or slug
    let resolvedCategoryId = input.category_id;
    const MOCK_MAP: Record<string, string> = {
      "cat-ac": "c1000000-0000-0000-0000-000000000001",
      "air-conditioners": "c1000000-0000-0000-0000-000000000001",
      "cat-fridge": "c1000000-0000-0000-0000-000000000002",
      "refrigerators": "c1000000-0000-0000-0000-000000000002",
      "cat-washer": "c1000000-0000-0000-0000-000000000003",
      "washing-machines": "c1000000-0000-0000-0000-000000000003",
      "cat-tv": "c1000000-0000-0000-0000-000000000004",
      "televisions": "c1000000-0000-0000-0000-000000000004",
      "cat-kitchen": "c1000000-0000-0000-0000-000000000005",
      "kitchen-appliances": "c1000000-0000-0000-0000-000000000005",
    };

    if (MOCK_MAP[resolvedCategoryId]) {
      resolvedCategoryId = MOCK_MAP[resolvedCategoryId];
    } else {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          resolvedCategoryId
        );
      if (!isUuid) {
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", resolvedCategoryId)
          .single();
        if (catData?.id) {
          resolvedCategoryId = catData.id;
        } else {
          const { data: firstCat } = await supabase
            .from("categories")
            .select("id")
            .limit(1)
            .single();
          if (firstCat?.id) {
            resolvedCategoryId = firstCat.id;
          }
        }
      }
    }

    // 1. Prepare product payload
    const productPayload = {
      slug: input.slug.trim(),
      brand: input.brand.trim(),
      model_number: input.model_number.trim(),
      category_id: resolvedCategoryId,
      origin_country: input.origin_country || null,
      release_year: input.release_year || null,
      price:
        input.price !== undefined && input.price !== null ? input.price : null,
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

      if (input.specifications && input.specifications.length > 0) {
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

    return NextResponse.json({ success: true, productId });
  } catch (err: unknown) {
    console.error("Server error saving product:", err);
    let message = "Failed to save product.";
    if (err && typeof err === "object") {
      if ("message" in err && typeof err.message === "string") {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PATCH: Quick update product status
export async function PATCH(request: Request) {
  try {
    const isStaff = await verifyStaffSession();
    if (!isStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, status }: { id: string; status: ProductStatus } =
      await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Product id and status required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("products")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update product status.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(request: Request) {
  try {
    const isStaff = await verifyStaffSession();
    if (!isStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete product.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
