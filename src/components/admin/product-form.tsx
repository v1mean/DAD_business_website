"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveProduct, type SaveProductInput } from "@/lib/supabase/admin-service";
import type { ProductWithDetails, ProductStatus, Category } from "@/types/database";
import { MOCK_CATEGORIES } from "@/data/mock-products";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { uploadProductImage } from "@/lib/supabase/admin-service";

interface ProductFormProps {
  initialData?: ProductWithDetails | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();

  // Find English and Khmer translations from initialData
  const enTrans = initialData?.translations.find((t) => t.locale === "en");
  const kmTrans = initialData?.translations.find((t) => t.locale === "km");

  // Form State
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [modelNumber, setModelNumber] = useState(initialData?.model_number || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || MOCK_CATEGORIES[0].id
  );

  useEffect(() => {
    let ignore = false;
    const fetchCats = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });
        if (!error && data && data.length > 0 && !ignore) {
          setCategories(data);
          if (!initialData) {
            setCategoryId((prev) => (prev ? prev : data[0].id));
          }
        }
      } catch {
        // use fallback mock categories
      }
    };
    fetchCats();
    return () => {
      ignore = true;
    };
  }, [initialData]);

  const [originCountry, setOriginCountry] = useState(
    initialData?.origin_country || ""
  );
  const [releaseYear, setReleaseYear] = useState<number | "">(
    initialData?.release_year || new Date().getFullYear()
  );

  // Price & Visibility
  const [price, setPrice] = useState<number | "">(
    initialData?.price !== undefined && initialData?.price !== null
      ? initialData.price
      : ""
  );
  const [currency] = useState(initialData?.currency || "USD");
  const [showPrice, setShowPrice] = useState(
    initialData ? initialData.show_price : true
  );
  const [status, setStatus] = useState<ProductStatus>(
    initialData?.status || "published"
  );

  // Appliance Photography
  const [imageUrl, setImageUrl] = useState(
    initialData?.images && initialData.images.length > 0
      ? initialData.images[0].storage_path
      : ""
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const res = await uploadProductImage(file);
    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setUploadError(
        res.error || "Failed to upload image. Please check file format."
      );
    }
    setUploadingImage(false);
  };

  // Translations
  const [activeLangTab, setActiveLangTab] = useState<"en" | "km">("en");
  const [nameEn, setNameEn] = useState(enTrans?.name || "");
  const [descEn, setDescEn] = useState(enTrans?.description || "");
  const [warrantyEn, setWarrantyEn] = useState(enTrans?.warranty_text || "");

  const [nameKm, setNameKm] = useState(kmTrans?.name || "");
  const [descKm, setDescKm] = useState(kmTrans?.description || "");
  const [warrantyKm, setWarrantyKm] = useState(kmTrans?.warranty_text || "");

  // Specifications
  const [specifications, setSpecifications] = useState<
    Array<{
      id?: string;
      spec_key: string;
      value_text: string;
      unit: string;
      source_note: string;
      verification_status: "verified" | "unverified" | "not_provided";
      display_order: number;
    }>
  >(
    initialData?.specifications && initialData.specifications.length > 0
      ? initialData.specifications.map((s, idx) => ({
          id: s.id,
          spec_key: s.spec_key,
          value_text: s.value_text || "",
          unit: s.unit || "",
          source_note: s.source_note || "",
          verification_status: s.verification_status,
          display_order: idx + 1,
        }))
      : [
          {
            spec_key: "Capacity / Power",
            value_text: "",
            unit: "",
            source_note: "Manufacturer Sheet",
            verification_status: "verified",
            display_order: 1,
          },
          {
            spec_key: "Inverter Technology",
            value_text: "Yes",
            unit: "",
            source_note: "Manufacturer Sheet",
            verification_status: "verified",
            display_order: 2,
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug from brand and model if slug is empty
  const handleAutoSlug = () => {
    if (brand && modelNumber && !initialData) {
      const generated = `${brand}-${modelNumber}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  };

  const handleAddSpecRow = () => {
    setSpecifications([
      ...specifications,
      {
        spec_key: "",
        value_text: "",
        unit: "",
        source_note: "Manufacturer Documentation",
        verification_status: "verified",
        display_order: specifications.length + 1,
      },
    ]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!brand.trim() || !modelNumber.trim()) {
      setErrorMessage("Brand and Model Number are required.");
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("Permanent Slug is required for the QR code URL.");
      setSaving(false);
      return;
    }

    if (!nameEn.trim()) {
      setErrorMessage("English product name is required.");
      setSaving(false);
      return;
    }

    const payload: SaveProductInput = {
      id: initialData?.id,
      slug: slug.trim(),
      brand: brand.trim(),
      model_number: modelNumber.trim(),
      category_id: categoryId,
      origin_country: originCountry.trim() || null,
      release_year: typeof releaseYear === "number" ? releaseYear : null,
      price: typeof price === "number" ? price : null,
      currency,
      show_price: showPrice,
      status,
      translations: {
        en: {
          name: nameEn.trim(),
          description: descEn.trim(),
          warranty_text: warrantyEn.trim() || null,
        },
        km: {
          name: nameKm.trim() || nameEn.trim(), // fallback to EN name if KM is empty
          description: descKm.trim() || descEn.trim(),
          warranty_text: warrantyKm.trim() || warrantyEn.trim() || null,
        },
      },
      specifications: specifications
        .filter((s) => s.spec_key.trim() !== "")
        .map((s, idx) => ({
          id: s.id,
          spec_key: s.spec_key.trim(),
          value_text: s.value_text.trim() || null,
          unit: s.unit.trim() || null,
          display_order: idx + 1,
          source_note: s.source_note.trim() || null,
          verification_status: s.verification_status,
        })),
      image_url: imageUrl.trim() || null,
    };

    const res = await saveProduct(payload);

    if (!res.success) {
      setErrorMessage(res.error || "Failed to save product.");
      setSaving(false);
    } else {
      setSuccessMessage("Product and specifications saved successfully!");
      setSaving(false);
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#0066cc] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
            {initialData ? `Edit: ${initialData.brand} ${initialData.model_number}` : "Add New Appliance"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-full border border-[#e0e0e0] bg-white px-5 py-2 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] active-press"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-6 py-2 text-[14px] font-medium text-white active-press transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save Product"}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-[12px] bg-[#ffebee] border border-[#ffcdd2] p-4 text-[14px] text-[#c62828]">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2.5 rounded-[12px] bg-[#e8f5e9] border border-[#c8e6c9] p-4 text-[14px] text-[#2e7d32]">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
            1. Basic Information
          </h2>
          <p className="text-[13px] text-[#7a7a7a]">
            Manufacturer model attributes and permanent URL identifier
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Brand / Manufacturer *
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              onBlur={handleAutoSlug}
              placeholder="e.g., LG, Panasonic, Daikin, Sony"
              className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Model Number *
            </label>
            <input
              type="text"
              required
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              onBlur={handleAutoSlug}
              placeholder="e.g., FV1410S4W, FTKF35XVM"
              className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5 flex items-center justify-between">
              <span>Permanent URL Slug (QR Destination) *</span>
              <span className="text-[12px] text-[#7a7a7a]">Permanent for printed QR labels</span>
            </label>
            <div className="flex items-center">
              <span className="rounded-l-[10px] border border-r-0 border-[#e0e0e0] bg-[#f5f5f7] px-3.5 py-2.5 text-[13px] text-[#7a7a7a] select-none font-mono">
                /products/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="lg-ai-dd-inverter-10-5kg-fv1410s4w"
                className="h-[42px] flex-1 rounded-r-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none font-mono"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#7a7a7a]">
              Do not modify this slug after printing physical showroom QR labels to prevent broken QR links.
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_en} ({cat.name_km})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Country of Origin
            </label>
            <input
              type="text"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              placeholder="e.g., Vietnam, Japan, Thailand, Malaysia"
              className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Model Release Year
            </label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) =>
                setReleaseYear(e.target.value ? parseInt(e.target.value) : "")
              }
              placeholder="2024"
              className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Appliance Photography */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
            2. Appliance Photography
          </h2>
          <p className="text-[13px] text-[#7a7a7a]">
            Upload an appliance photo from your phone/computer or enter an image URL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Upload and URL input (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
                Upload Photo from Device (Phone or Computer)
              </label>
              <label className="flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#e0e0e0] bg-[#fafafc] hover:bg-[#f5f5f7] p-6 cursor-pointer transition-colors">
                <Upload className="h-8 w-8 text-[#0066cc] mb-2" />
                <span className="text-[14px] font-medium text-[#1d1d1f]">
                  {uploadingImage
                    ? "Uploading to storage..."
                    : "Choose photo or take picture"}
                </span>
                <span className="text-[12px] text-[#7a7a7a] mt-1">
                  JPG, PNG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="mt-2 text-[12px] text-[#d32f2f] flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#f0f0f0]"></div>
              <span className="flex-shrink mx-4 text-[12px] text-[#7a7a7a] uppercase font-mono">
                or enter image URL
              </span>
              <div className="flex-grow border-t border-[#f0f0f0]"></div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                External Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/appliance.jpg"
                className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none font-mono text-[13px]"
              />
            </div>
          </div>

          {/* Pedestal Preview (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <span className="text-[12px] font-medium text-[#7a7a7a] mb-2">
              Museum Pedestal Preview
            </span>
            <div className="relative flex h-52 w-52 items-center justify-center rounded-[16px] bg-[#f5f5f7] p-4 border border-[#e0e0e0]">
              {imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imageUrl}
                  alt="Appliance Preview"
                  className="h-40 w-40 object-contain product-shadow"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-[#7a7a7a]">
                  <ImageIcon className="h-10 w-10 text-[#c7c7cc] mb-2" />
                  <span className="text-[12px]">No photo uploaded yet</span>
                  <span className="text-[10px] mt-0.5">
                    Category icon will be used
                  </span>
                </div>
              )}
            </div>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="mt-2 text-[12px] text-[#d32f2f] hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Bilingual Translations */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
              3. Bilingual Translations
            </h2>
            <p className="text-[13px] text-[#7a7a7a]">
              Customer-facing information in English and Khmer
            </p>
          </div>

          {/* Lang Tabs */}
          <div className="flex items-center gap-1 rounded-full bg-[#f5f5f7] p-1 border border-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setActiveLangTab("en")}
              className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
                activeLangTab === "en"
                  ? "bg-[#0066cc] text-white"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab("km")}
              className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
                activeLangTab === "km"
                  ? "bg-[#0066cc] text-white shadow-sm"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              ភាសាខ្មែរ (Khmer)
            </button>
          </div>
        </div>

        {/* English Inputs */}
        {activeLangTab === "en" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g., LG AI DD™ Front Load Washer 10.5kg Inverter"
                className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                Overview / Description (English)
              </label>
              <textarea
                rows={4}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Detailed features, intelligent technology, and performance highlights..."
                className="w-full rounded-[10px] border border-[#e0e0e0] bg-white p-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                Warranty Terms (English)
              </label>
              <input
                type="text"
                value={warrantyEn}
                onChange={(e) => setWarrantyEn(e.target.value)}
                placeholder="e.g., 10 Years on Motor, 1 Year on Machine Body"
                className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
              />
            </div>
          </div>
        ) : (
          /* Khmer Inputs */
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                ឈ្មោះផលិតផល (ភាសាខ្មែរ)
              </label>
              <input
                type="text"
                value={nameKm}
                onChange={(e) => setNameKm(e.target.value)}
                placeholder="ឧទាហរណ៍៖ ម៉ាស៊ីនបោកគក់ទ្វារមុខ LG AI DD™ ទម្ងន់ 10.5គីឡូ អាំងវែរទ័រ"
                className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                ការពិពណ៌នាអំពីផលិតផល (ភាសាខ្មែរ)
              </label>
              <textarea
                rows={4}
                value={descKm}
                onChange={(e) => setDescKm(e.target.value)}
                placeholder="ពិពណ៌នាអំពីមុខងារសំខាន់ៗ ការសន្សំសំចៃភ្លើង និងបច្ចេកវិទ្យា..."
                className="w-full rounded-[10px] border border-[#e0e0e0] bg-white p-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                ព័ត៌មានលម្អិតអំពីការធានា (ភាសាខ្មែរ)
              </label>
              <input
                type="text"
                value={warrantyKm}
                onChange={(e) => setWarrantyKm(e.target.value)}
                placeholder="ឧទាហរណ៍៖ ធានា ១០ ឆ្នាំលើម៉ូទ័រ Inverter និង ១ ឆ្នាំលើតួម៉ាស៊ីន"
                className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[14px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Technical Specifications Builder */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
              4. Technical Specifications
            </h2>
            <p className="text-[13px] text-[#7a7a7a]">
              Flexible category-specific parameters with units and source notes
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSpecRow}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0066cc] bg-white px-4 py-1.5 text-[13px] font-medium text-[#0066cc] hover:bg-[#e3f2fd] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Spec</span>
          </button>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-[12px] bg-[#fafafc] border border-[#f0f0f0] p-3.5"
            >
              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  value={spec.spec_key}
                  onChange={(e) => handleSpecChange(index, "spec_key", e.target.value)}
                  placeholder="Specification Name (e.g., Capacity)"
                  className="h-[38px] w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 text-[13px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  value={spec.value_text}
                  onChange={(e) => handleSpecChange(index, "value_text", e.target.value)}
                  placeholder="Value (e.g., 10.5 kg, 1400 RPM)"
                  className="h-[38px] w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 text-[13px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none font-medium"
                />
              </div>

              <div className="w-full sm:w-1/4">
                <select
                  value={spec.verification_status}
                  onChange={(e) =>
                    handleSpecChange(index, "verification_status", e.target.value)
                  }
                  className="h-[38px] w-full rounded-[8px] border border-[#e0e0e0] bg-white px-2.5 text-[12px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
                >
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="not_provided">Not Provided</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSpecRow(index)}
                className="p-2 text-[#7a7a7a] hover:text-[#d32f2f] hover:bg-[#ffebee] rounded-[6px] transition-colors self-end sm:self-center"
                title="Remove spec"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Price & Visibility Controls */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
            5. Price & Visibility
          </h2>
          <p className="text-[13px] text-[#7a7a7a]">
            Optional pricing display configured per model
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-center">
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Price (USD)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[14px] text-[#7a7a7a]">$</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? parseFloat(e.target.value) : "")
                }
                placeholder="529.00"
                className="h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-white pl-8 pr-3.5 text-[15px] font-semibold text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#7a7a7a]">
              Leave empty if price varies or is negotiated directly.
            </p>
          </div>

          {/* Visibility Toggle Switch */}
          <div className="rounded-[12px] border border-[#e0e0e0] bg-[#fafafc] p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[14px] font-semibold text-[#1d1d1f] block">
                  Show Price on Public Showroom
                </span>
                <span className="text-[12px] text-[#7a7a7a]">
                  {showPrice
                    ? "Visible on product card and QR landing page"
                    : "Hidden. Replaced by inquiry button."}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPrice(!showPrice)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showPrice ? "bg-[#0066cc]" : "bg-[#d1d1d6]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    showPrice ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Publication Status */}
      <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1d1d1f]">
            6. Publication Status
          </h2>
          <p className="text-[13px] text-[#7a7a7a]">
            Control whether this appliance appears on the public website and QR scans
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            className={`flex flex-col p-4 rounded-[12px] border cursor-pointer transition-colors ${
              status === "published"
                ? "border-[#0066cc] bg-[#e3f2fd]/40 text-[#0066cc]"
                : "border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-[#0066cc]"
              />
              <span className="font-semibold text-[14px]">Published</span>
            </div>
            <span className="mt-1 text-[12px] text-[#7a7a7a]">
              Active in catalog and readable by physical QR scans.
            </span>
          </label>

          <label
            className={`flex flex-col p-4 rounded-[12px] border cursor-pointer transition-colors ${
              status === "draft"
                ? "border-[#f57c00] bg-[#fff3e0]/40 text-[#f57c00]"
                : "border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="text-[#f57c00]"
              />
              <span className="font-semibold text-[14px]">Draft</span>
            </div>
            <span className="mt-1 text-[12px] text-[#7a7a7a]">
              Saved internally. Hidden from customers.
            </span>
          </label>

          <label
            className={`flex flex-col p-4 rounded-[12px] border cursor-pointer transition-colors ${
              status === "archived"
                ? "border-[#7a7a7a] bg-[#f5f5f7] text-[#7a7a7a]"
                : "border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="archived"
                checked={status === "archived"}
                onChange={() => setStatus("archived")}
                className="text-[#7a7a7a]"
              />
              <span className="font-semibold text-[14px]">Archived</span>
            </div>
            <span className="mt-1 text-[12px] text-[#7a7a7a]">
              Discontinued. QR code displays an archived notice.
            </span>
          </label>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="rounded-full border border-[#e0e0e0] bg-white px-6 py-2.5 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] active-press"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] px-7 py-2.5 text-[14px] font-medium text-white active-press transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving Changes..." : "Save Product"}</span>
        </button>
      </div>
    </form>
  );
}
