-- ==============================================================================
-- DAD Electronics — Complete Database Setup (Schema + Seed)
-- Run this ONCE in Supabase SQL Editor
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

-- 2. CORE TABLES
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

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text_en TEXT,
  alt_text_km TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role staff_role_enum NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES
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

-- 4. AUTO-UPDATE TIMESTAMPS
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

-- 5. STAFF ROLE HELPER FUNCTIONS
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

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6.1 Categories Policies
DROP POLICY IF EXISTS "Public users can view active categories" ON public.categories;
CREATE POLICY "Public users can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_staff());

DROP POLICY IF EXISTS "Staff can manage categories" ON public.categories;
CREATE POLICY "Staff can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.2 Products Policies
DROP POLICY IF EXISTS "Public users can view published products" ON public.products;
CREATE POLICY "Public users can view published products"
  ON public.products FOR SELECT
  USING (status = 'published' OR public.is_staff());

DROP POLICY IF EXISTS "Staff can manage products" ON public.products;
CREATE POLICY "Staff can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.3 Product Translations Policies
DROP POLICY IF EXISTS "Public users can view translations for published products" ON public.product_translations;
CREATE POLICY "Public users can view translations for published products"
  ON public.product_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_translations.product_id
        AND (products.status = 'published' OR public.is_staff())
    )
  );

DROP POLICY IF EXISTS "Staff can manage translations" ON public.product_translations;
CREATE POLICY "Staff can manage translations"
  ON public.product_translations FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.4 Product Specifications Policies
DROP POLICY IF EXISTS "Public users can view specs for published products" ON public.product_specifications;
CREATE POLICY "Public users can view specs for published products"
  ON public.product_specifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_specifications.product_id
        AND (products.status = 'published' OR public.is_staff())
    )
  );

DROP POLICY IF EXISTS "Staff can manage specifications" ON public.product_specifications;
CREATE POLICY "Staff can manage specifications"
  ON public.product_specifications FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.5 Product Images Policies
DROP POLICY IF EXISTS "Public users can view images for published products" ON public.product_images;
CREATE POLICY "Public users can view images for published products"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_images.product_id
        AND (products.status = 'published' OR public.is_staff())
    )
  );

DROP POLICY IF EXISTS "Staff can manage images" ON public.product_images;
CREATE POLICY "Staff can manage images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 6.6 Profiles Policies
DROP POLICY IF EXISTS "Staff can read profiles" ON public.profiles;
CREATE POLICY "Staff can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS "Admins can manage staff profiles" ON public.profiles;
CREATE POLICY "Admins can manage staff profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. STORAGE BUCKET CONFIGURATION (product-images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Staff can manage product images" ON storage.objects;
CREATE POLICY "Staff can manage product images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_staff())
  WITH CHECK (bucket_id = 'product-images' AND public.is_staff());

-- ==============================================================================
-- 8. INITIAL SEED DATA (CATEGORIES & VERIFIED PRODUCTS)
-- ==============================================================================

-- 8.1 Categories
INSERT INTO public.categories (id, slug, name_en, name_km, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'air-conditioners', 'Air Conditioners', 'ម៉ាស៊ីនត្រជាក់', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'refrigerators', 'Refrigerators', 'ទូរទឹកកក', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'washing-machines', 'Washing Machines', 'ម៉ាស៊ីនបោកគក់', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'televisions', 'Televisions', 'ទូរទស្សន៍', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'kitchen-appliances', 'Kitchen Appliances', 'ឧបករណ៍ផ្ទះបាយ', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'dryers', 'Dryers', 'ម៉ាស៊ីនសម្ងួត', 6, true)
ON CONFLICT (slug) DO UPDATE
SET
  name_en = EXCLUDED.name_en,
  name_km = EXCLUDED.name_km,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 8.2 Products
INSERT INTO public.products (
  id, slug, brand, model_number, category_id, origin_country, release_year, price, currency, show_price, status
) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'lg-ai-dd-inverter-10-5kg-fv1410s4w', 'LG', 'FV1410S4W', 'c1000000-0000-0000-0000-000000000003', 'Vietnam', 2024, 529.00, 'USD', true, 'published'),
  ('a1000000-0000-0000-0000-000000000002', 'panasonic-prime-fresh-inverter-420l-nr-cw530xmm', 'Panasonic', 'NR-CW530XMM', 'c1000000-0000-0000-0000-000000000002', 'Japan', 2024, NULL, 'USD', false, 'published'),
  ('a1000000-0000-0000-0000-000000000003', 'daikin-inverter-1-5hp-r32-ftkf35xvm', 'Daikin', 'FTKF35XVM', 'c1000000-0000-0000-0000-000000000001', 'Thailand', 2024, 439.00, 'USD', true, 'published'),
  ('a1000000-0000-0000-0000-000000000004', 'sony-bravia-4k-hdr-google-tv-65-inch-kd-65x80l', 'Sony', 'KD-65X80L', 'c1000000-0000-0000-0000-000000000004', 'Malaysia', 2024, 849.00, 'USD', true, 'published')
ON CONFLICT (slug) DO NOTHING;

-- 8.3 Product Translations
INSERT INTO public.product_translations (product_id, locale, name, description, warranty_text)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'en', 'LG AI DD™ Front Load Washer 10.5kg Inverter', 'Intelligent fabric care with AI Direct Drive™ technology. Automatically senses fabric weight and softness to deliver optimal wash motions.', '10 Years on Inverter Direct Drive Motor, 1 Year on Machine Body'),
  ('a1000000-0000-0000-0000-000000000001', 'km', 'ម៉ាស៊ីនបោកគក់ទ្វារមុខ LG AI DD™ ទម្ងន់ 10.5គីឡូ អាំងវែរទ័រ', 'បច្ចេកវិទ្យាឆ្លាតវៃ AI Direct Drive™ ការពារសាច់ក្រណាត់បានល្អបំផុតដោយស្គាល់ទម្ងន់ និងប្រភេទក្រណាត់ស្វ័យប្រវត្តិ។', 'ធានា ១០ ឆ្នាំលើម៉ូទ័រ Inverter Direct Drive និង ១ ឆ្នាំលើតួម៉ាស៊ីន'),
  ('a1000000-0000-0000-0000-000000000002', 'en', 'Panasonic Prime Fresh 3-Door Inverter Refrigerator 420L', 'Premium Japanese multi-door refrigerator featuring Prime Fresh soft freezing at -3°C to maintain freshness and nutrients without defrosting.', '12 Years on Inverter Compressor, 1 Year on Full Unit'),
  ('a1000000-0000-0000-0000-000000000002', 'km', 'ទូរទឹកកក Panasonic Prime Fresh ទ្វារ ៣ អាំងវែរទ័រ ចំណុះ 420លីត្រ', 'ទូរទឹកកកប្រណិតស្តង់ដារជប៉ុន មានមុខងារ Prime Fresh ក្លាស្សេត្រជាក់ -3°C រក្សាភាពស្រស់ដោយមិនចាំបាច់រំលាយទឹកកក។', 'ធានា ១២ ឆ្នាំលើកុំប្រេស័រ Inverter និង ១ ឆ្នាំលើតួទូ'),
  ('a1000000-0000-0000-0000-000000000003', 'en', 'Daikin Streamer Inverter Air Conditioner 1.5 HP (R32)', 'Advanced climate control powered by Daikin Streamer Air Purification that decomposes viruses, bacteria, and allergens.', '5 Years on Compressor, 1 Year on Internal Components'),
  ('a1000000-0000-0000-0000-000000000003', 'km', 'ម៉ាស៊ីនត្រជាក់ Daikin Streamer អាំងវែរទ័រ កម្លាំង 1.5សេះ (R32)', 'ម៉ាស៊ីនត្រជាក់បច្ចេកវិទ្យា Streamer សម្លាប់មេរោគ បាក់តេរី និងក្លិនមិនល្អនៅក្នុងបន្ទប់។ ម៉ូទ័រ Swing Inverter សន្សំសំចៃភ្លើង។', 'ធានា ៥ ឆ្នាំលើកុំប្រេស័រ និង ១ ឆ្នាំលើគ្រឿងបន្លាស់ទូទៅ'),
  ('a1000000-0000-0000-0000-000000000004', 'en', 'Sony BRAVIA 4K HDR Google TV 65-inch (X80L)', 'Billion colors brought to life with 4K HDR Processor X1™ and TRILUMINOS PRO™. Dolby Vision and Dolby Atmos deliver cinema-quality picture.', '2 Years Full Official Sony Warranty'),
  ('a1000000-0000-0000-0000-000000000004', 'km', 'ទូរទស្សន៍ឆ្លាតវៃ Sony BRAVIA 4K HDR Google TV 65អ៊ីញ (X80L)', 'រូបភាពច្បាស់ត្រជាក់ភ្នែកជាមួយឈីប 4K HDR Processor X1™ និងបច្ចេកវិទ្យាពណ៌ TRILUMINOS PRO™។ ប្រព័ន្ធសំឡេង Dolby Atmos។', 'ធានាផ្លូវការរយៈពេល ២ ឆ្នាំពេញពីក្រុមហ៊ុន Sony')
ON CONFLICT (product_id, locale) DO NOTHING;

-- 8.4 Product Specifications
INSERT INTO public.product_specifications (
  product_id, spec_key, value_text, value_numeric, unit, display_order, source_note, verification_status
) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Washing Capacity', '10.5 kg', 10.5, 'kg', 1, 'LG Official Specification Sheet', 'verified'),
  ('a1000000-0000-0000-0000-000000000001', 'Max Spin Speed', '1400 RPM', 1400, 'RPM', 2, 'LG Official Specification Sheet', 'verified'),
  ('a1000000-0000-0000-0000-000000000001', 'Motor Type', 'Inverter Direct Drive™', NULL, NULL, 3, 'LG Official Specification Sheet', 'verified'),
  ('a1000000-0000-0000-0000-000000000001', 'Energy Rating', '5-Star Energy Efficiency', NULL, NULL, 4, 'National Energy Label', 'verified'),

  ('a1000000-0000-0000-0000-000000000002', 'Total Capacity', '420 Liters', 420, 'L', 1, 'Panasonic Global Catalog', 'verified'),
  ('a1000000-0000-0000-0000-000000000002', 'Cooling Technology', 'Prime Fresh Soft Freezing (-3°C)', -3, '°C', 2, 'Panasonic Global Catalog', 'verified'),
  ('a1000000-0000-0000-0000-000000000002', 'Hygiene System', 'nanoe™ X Antibacterial', NULL, NULL, 3, 'Panasonic Lab Report', 'verified'),

  ('a1000000-0000-0000-0000-000000000003', 'Cooling Capacity', '12,300 BTU/h (1.5 HP)', 12300, 'BTU/h', 1, 'Daikin Technical Data Book', 'verified'),
  ('a1000000-0000-0000-0000-000000000003', 'Power Consumption', '990 Watts', 990, 'W', 2, 'Daikin Technical Data Book', 'verified'),
  ('a1000000-0000-0000-0000-000000000003', 'Refrigerant Type', 'R32 Eco-Friendly', NULL, NULL, 3, 'Manufacturer Plate', 'verified'),

  ('a1000000-0000-0000-0000-000000000004', 'Screen Size', '65" Diagonal (3840 x 2160 pixels)', 65, 'inch', 1, 'Sony Official Specifications', 'verified'),
  ('a1000000-0000-0000-0000-000000000004', 'Picture Processor', '4K HDR Processor X1™', NULL, NULL, 2, 'Sony Official Specifications', 'verified'),
  ('a1000000-0000-0000-0000-000000000004', 'Operating System', 'Google TV Built-in', NULL, NULL, 3, 'Sony Official Specifications', 'verified');
