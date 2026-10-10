-- ==============================================================================
-- DAD Electronics Product Catalog — Supabase Seed Data
-- Seed file: supabase/seed.sql
-- Populates initial categories and verified seed electronics appliances
-- ==============================================================================

-- 1. Insert Initial 5 Categories
INSERT INTO public.categories (id, slug, name_en, name_km, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'air-conditioners', 'Air Conditioners', 'ម៉ាស៊ីនត្រជាក់', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'refrigerators', 'Refrigerators', 'ទូរទឹកកក', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'washing-machines', 'Washing Machines', 'ម៉ាស៊ីនបោកគក់', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'televisions', 'Televisions', 'ទូរទស្សន៍', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'kitchen-appliances', 'Kitchen Appliances', 'ឧបករណ៍ផ្ទះបាយ', 5, true)
ON CONFLICT (slug) DO UPDATE
SET
  name_en = EXCLUDED.name_en,
  name_km = EXCLUDED.name_km,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. Insert Seed Products

-- Product 1: LG AI DD Front Load Washer (Visible Price)
INSERT INTO public.products (
  id, slug, brand, model_number, category_id, origin_country, release_year, price, currency, show_price, status
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'lg-ai-dd-inverter-10-5kg-fv1410s4w',
  'LG',
  'FV1410S4W',
  'c1000000-0000-0000-0000-000000000003',
  'Vietnam',
  2024,
  529.00,
  'USD',
  true,
  'published'
) ON CONFLICT (slug) DO NOTHING;

-- Product 2: Panasonic Prime Fresh Refrigerator (Price Hidden / Inquire)
INSERT INTO public.products (
  id, slug, brand, model_number, category_id, origin_country, release_year, price, currency, show_price, status
) VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'panasonic-prime-fresh-inverter-420l-nr-cw530xmm',
  'Panasonic',
  'NR-CW530XMM',
  'c1000000-0000-0000-0000-000000000002',
  'Japan',
  2024,
  NULL,
  'USD',
  false,
  'published'
) ON CONFLICT (slug) DO NOTHING;

-- Product 3: Daikin Inverter AC (Visible Price)
INSERT INTO public.products (
  id, slug, brand, model_number, category_id, origin_country, release_year, price, currency, show_price, status
) VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'daikin-inverter-1-5hp-r32-ftkf35xvm',
  'Daikin',
  'FTKF35XVM',
  'c1000000-0000-0000-0000-000000000001',
  'Thailand',
  2024,
  439.00,
  'USD',
  true,
  'published'
) ON CONFLICT (slug) DO NOTHING;

-- Product 4: Sony BRAVIA 4K 65" (Visible Price)
INSERT INTO public.products (
  id, slug, brand, model_number, category_id, origin_country, release_year, price, currency, show_price, status
) VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'sony-bravia-4k-hdr-google-tv-65-inch-kd-65x80l',
  'Sony',
  'KD-65X80L',
  'c1000000-0000-0000-0000-000000000004',
  'Malaysia',
  2024,
  849.00,
  'USD',
  true,
  'published'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Product Translations
INSERT INTO public.product_translations (product_id, locale, name, description, warranty_text)
VALUES
  -- LG Washer EN/KM
  (
    'a1000000-0000-0000-0000-000000000001',
    'en',
    'LG AI DD™ Front Load Washer 10.5kg Inverter',
    'Intelligent fabric care with AI Direct Drive™ technology. Automatically senses fabric weight and softness to deliver optimal wash motions.',
    '10 Years on Inverter Direct Drive Motor, 1 Year on Machine Body'
  ),
  (
    'a1000000-0000-0000-0000-000000000001',
    'km',
    'ម៉ាស៊ីនបោកគក់ទ្វារមុខ LG AI DD™ ទម្ងន់ 10.5គីឡូ អាំងវែរទ័រ',
    'បច្ចេកវិទ្យាឆ្លាតវៃ AI Direct Drive™ ការពារសាច់ក្រណាត់បានល្អបំផុតដោយស្គាល់ទម្ងន់ និងប្រភេទក្រណាត់ស្វ័យប្រវត្តិ។',
    'ធានា ១០ ឆ្នាំលើម៉ូទ័រ Inverter Direct Drive និង ១ ឆ្នាំលើតួម៉ាស៊ីន'
  ),
  -- Panasonic Refrigerator EN/KM
  (
    'a1000000-0000-0000-0000-000000000002',
    'en',
    'Panasonic Prime Fresh 3-Door Inverter Refrigerator 420L',
    'Premium Japanese multi-door refrigerator featuring Prime Fresh soft freezing at -3°C to maintain freshness and nutrients without defrosting.',
    '12 Years on Inverter Compressor, 1 Year on Full Unit'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'km',
    'ទូរទឹកកក Panasonic Prime Fresh ទ្វារ ៣ អាំងវែរទ័រ ចំណុះ 420លីត្រ',
    'ទូរទឹកកកប្រណិតស្តង់ដារជប៉ុន មានមុខងារ Prime Fresh ក្លាស្សេត្រជាក់ -3°C រក្សាភាពស្រស់ដោយមិនចាំបាច់រំលាយទឹកកក។',
    'ធានា ១២ ឆ្នាំលើកុំប្រេស័រ Inverter និង ១ ឆ្នាំលើតួទូ'
  ),
  -- Daikin AC EN/KM
  (
    'a1000000-0000-0000-0000-000000000003',
    'en',
    'Daikin Streamer Inverter Air Conditioner 1.5 HP (R32)',
    'Advanced climate control powered by Daikin Streamer Air Purification that decomposes viruses, bacteria, and allergens.',
    '5 Years on Compressor, 1 Year on Internal Components'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'km',
    'ម៉ាស៊ីនត្រជាក់ Daikin Streamer អាំងវែរទ័រ កម្លាំង 1.5សេះ (R32)',
    'ម៉ាស៊ីនត្រជាក់បច្ចេកវិទ្យា Streamer សម្លាប់មេរោគ បាក់តេរី និងក្លិនមិនល្អនៅក្នុងបន្ទប់។ ម៉ូទ័រ Swing Inverter សន្សំសំចៃភ្លើង។',
    'ធានា ៥ ឆ្នាំលើកុំប្រេស័រ និង ១ ឆ្នាំលើគ្រឿងបន្លាស់ទូទៅ'
  ),
  -- Sony TV EN/KM
  (
    'a1000000-0000-0000-0000-000000000004',
    'en',
    'Sony BRAVIA 4K HDR Google TV 65-inch (X80L)',
    'Billion colors brought to life with 4K HDR Processor X1™ and TRILUMINOS PRO™. Dolby Vision and Dolby Atmos deliver cinema-quality picture.',
    '2 Years Full Official Sony Warranty'
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'km',
    'ទូរទស្សន៍ឆ្លាតវៃ Sony BRAVIA 4K HDR Google TV 65អ៊ីញ (X80L)',
    'រូបភាពច្បាស់ត្រជាក់ភ្នែកជាមួយឈីប 4K HDR Processor X1™ និងបច្ចេកវិទ្យាពណ៌ TRILUMINOS PRO™។ ប្រព័ន្ធសំឡេង Dolby Atmos។',
    'ធានាផ្លូវការរយៈពេល ២ ឆ្នាំពេញពីក្រុមហ៊ុន Sony'
  )
ON CONFLICT (product_id, locale) DO NOTHING;

-- 4. Insert Verified Product Specifications
INSERT INTO public.product_specifications (
  product_id, spec_key, value_text, value_numeric, unit, display_order, source_note, verification_status
) VALUES
  -- LG Washer Specs
  ('a1000000-0000-0000-0000-000000000001', 'Washing Capacity', '10.5 kg', 10.5, 'kg', 1, 'LG Official Specification Sheet', 'verified'),
  ('a1000000-0000-0000-0000-000000000001', 'Max Spin Speed', '1400 RPM', 1400, 'RPM', 2, 'LG Official Specification Sheet', 'verified'),
  ('a1000000-0000-0000-0000-000000000001', 'Motor Type', 'Inverter Direct Drive™', NULL, NULL, 3, 'LG Official Specification Sheet', 'verified'),
  ('a1000000-0000-0000-0000-000000000001', 'Energy Rating', '5-Star Energy Efficiency', NULL, NULL, 4, 'National Energy Label', 'verified'),

  -- Panasonic Refrigerator Specs
  ('a1000000-0000-0000-0000-000000000002', 'Total Capacity', '420 Liters', 420, 'L', 1, 'Panasonic Global Catalog', 'verified'),
  ('a1000000-0000-0000-0000-000000000002', 'Cooling Technology', 'Prime Fresh Soft Freezing (-3°C)', -3, '°C', 2, 'Panasonic Global Catalog', 'verified'),
  ('a1000000-0000-0000-0000-000000000002', 'Hygiene System', 'nanoe™ X Antibacterial', NULL, NULL, 3, 'Panasonic Lab Report', 'verified'),

  -- Daikin AC Specs
  ('a1000000-0000-0000-0000-000000000003', 'Cooling Capacity', '12,300 BTU/h (1.5 HP)', 12300, 'BTU/h', 1, 'Daikin Technical Data Book', 'verified'),
  ('a1000000-0000-0000-0000-000000000003', 'Power Consumption', '990 Watts', 990, 'W', 2, 'Daikin Technical Data Book', 'verified'),
  ('a1000000-0000-0000-0000-000000000003', 'Refrigerant Type', 'R32 Eco-Friendly', NULL, NULL, 3, 'Manufacturer Plate', 'verified'),

  -- Sony TV Specs
  ('a1000000-0000-0000-0000-000000000004', 'Screen Size', '65" Diagonal (3840 x 2160 pixels)', 65, 'inch', 1, 'Sony Official Specifications', 'verified'),
  ('a1000000-0000-0000-0000-000000000004', 'Picture Processor', '4K HDR Processor X1™', NULL, NULL, 2, 'Sony Official Specifications', 'verified'),
  ('a1000000-0000-0000-0000-000000000004', 'Operating System', 'Google TV Built-in', NULL, NULL, 3, 'Sony Official Specifications', 'verified');
