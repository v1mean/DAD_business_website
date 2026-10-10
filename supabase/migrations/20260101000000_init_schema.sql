-- ==============================================================================
-- DAD Electronics Product Catalog — Supabase PostgreSQL Database Schema
-- Migration: 20260101000000_init_schema.sql
-- Conforms to Section 2 (Database Design) and Section 7 (Roadmap Phase 3)
-- ==============================================================================

-- 1. EXTENSIONS & CUSTOM ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE product_status_enum AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('verified', 'unverified', 'not_provided');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE staff_role_enum AS ENUM ('administrator', 'editor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- 2.1 Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_km TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model_number TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  origin_country TEXT,
  release_year INTEGER,
  price NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  show_price BOOLEAN NOT NULL DEFAULT true,
  status product_status_enum NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Product Translations Table
CREATE TABLE IF NOT EXISTS public.product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'km')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  warranty_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_product_locale UNIQUE (product_id, locale)
);

-- 2.4 Product Specifications Table
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  value_text TEXT,
  value_numeric NUMERIC(12, 3),
  unit TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  source_note TEXT,
  verification_status verification_status_enum NOT NULL DEFAULT 'not_provided',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text_en TEXT,
  alt_text_km TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Staff Profiles Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role staff_role_enum NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories (is_active);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);

CREATE INDEX IF NOT EXISTS idx_translations_product_id ON public.product_translations (product_id);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON public.product_translations (locale);

CREATE INDEX IF NOT EXISTS idx_specifications_product_id ON public.product_specifications (product_id);
CREATE INDEX IF NOT EXISTS idx_specifications_order ON public.product_specifications (product_id, display_order);

CREATE INDEX IF NOT EXISTS idx_images_product_id ON public.product_images (product_id);

-- ==============================================================================
-- 4. AUTO-UPDATE TIMESTAMPS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_translations_updated_at ON public.product_translations;
CREATE TRIGGER trigger_translations_updated_at
  BEFORE UPDATE ON public.product_translations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_specifications_updated_at ON public.product_specifications;
CREATE TRIGGER trigger_specifications_updated_at
  BEFORE UPDATE ON public.product_specifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. STAFF ROLE HELPER FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('administrator', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'administrator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create staff profile upon auth signup
CREATE OR REPLACE FUNCTION public.handle_new_staff_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::staff_role_enum, 'editor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_staff_user();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6.1 Categories Policies
-- Public can view active categories
CREATE POLICY "Public users can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_staff());

-- Staff can insert, update, delete categories
CREATE POLICY "Staff can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.2 Products Policies
-- Public can only view published products
CREATE POLICY "Public users can view published products"
  ON public.products FOR SELECT
  USING (status = 'published' OR public.is_staff());

-- Staff can insert, update, delete products
CREATE POLICY "Staff can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.3 Product Translations Policies
-- Public can view translations for published products
CREATE POLICY "Public users can view translations for published products"
  ON public.product_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_translations.product_id
        AND (products.status = 'published' OR public.is_staff())
    )
  );

-- Staff can manage translations
CREATE POLICY "Staff can manage translations"
  ON public.product_translations FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.4 Product Specifications Policies
-- Public can view specifications for published products
CREATE POLICY "Public users can view specs for published products"
  ON public.product_specifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_specifications.product_id
        AND (products.status = 'published' OR public.is_staff())
    )
  );

-- Staff can manage specifications
CREATE POLICY "Staff can manage specifications"
  ON public.product_specifications FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.5 Product Images Policies
-- Public can view images for published products
CREATE POLICY "Public users can view images for published products"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_images.product_id
        AND (products.status = 'published' OR public.is_staff())
    )
  );

-- Staff can manage images
CREATE POLICY "Staff can manage images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.6 Profiles Policies
-- Staff can read their own profile or all profiles if staff
CREATE POLICY "Staff can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Only administrators can modify roles
CREATE POLICY "Admins can manage staff profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET CONFIGURATION (product-images)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read images from product-images bucket
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Authenticated staff can upload and manage images
CREATE POLICY "Staff can manage product images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_staff())
  WITH CHECK (bucket_id = 'product-images' AND public.is_staff());
