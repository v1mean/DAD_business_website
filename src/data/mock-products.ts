// Realistic Mock Products Data
// Complies with ProductWithDetails schema and Section 2 & 5 of the technical spec.
// Used for the initial responsive catalog UI before live database hydration.

import type { Category, ProductWithDetails } from "@/types/database";

export interface MockProductWithDetails extends ProductWithDetails {
  in_stock: boolean;
  featured?: boolean;
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    slug: "air-conditioners",
    name_en: "Air Conditioners",
    name_km: "ម៉ាស៊ីនត្រជាក់",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    slug: "refrigerators",
    name_en: "Refrigerators",
    name_km: "ទូរទឹកកក",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    slug: "washing-machines",
    name_en: "Washing Machines",
    name_km: "ម៉ាស៊ីនបោកគក់",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000004",
    slug: "televisions",
    name_en: "Televisions",
    name_km: "ទូរទស្សន៍",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000005",
    slug: "kitchen-appliances",
    name_en: "Kitchen Appliances",
    name_km: "ឧបករណ៍ផ្ទះបាយ",
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// SVG appliance graphic generators for crisp, self-contained presentation
export const APPLIANCE_ICONS = {
  washer: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-zinc-800">
    <rect x="35" y="20" width="130" height="160" rx="14" fill="#F4F4F6" stroke="#D1D1D6" stroke-width="4"/>
    <rect x="45" y="32" width="110" height="28" rx="6" fill="#E5E5EA"/>
    <circle cx="65" cy="46" r="8" fill="#0066CC"/>
    <rect x="90" y="42" width="55" height="8" rx="4" fill="#8E8E93"/>
    <circle cx="100" cy="115" r="48" fill="#E5E5EA" stroke="#C7C7CC" stroke-width="4"/>
    <circle cx="100" cy="115" r="36" fill="#1C1C1E" stroke="#0066CC" stroke-width="3"/>
    <circle cx="100" cy="115" r="28" fill="#2C2C2E"/>
    <path d="M85 105C90 100 110 100 115 105C120 115 110 125 100 128" stroke="#0071E3" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  fridge: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-zinc-800">
    <rect x="45" y="15" width="110" height="170" rx="12" fill="#EBEBF0" stroke="#C7C7CC" stroke-width="4"/>
    <line x1="45" y1="78" x2="155" y2="78" stroke="#AEAEB2" stroke-width="3"/>
    <rect x="55" y="40" width="6" height="24" rx="3" fill="#8E8E93"/>
    <rect x="55" y="95" width="6" height="40" rx="3" fill="#8E8E93"/>
    <rect x="115" y="30" width="28" height="16" rx="4" fill="#0066CC" opacity="0.85"/>
    <circle cx="100" cy="165" r="3" fill="#AEAEB2"/>
  </svg>`,
  ac: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-zinc-800">
    <rect x="20" y="65" width="160" height="70" rx="10" fill="#F2F2F7" stroke="#C7C7CC" stroke-width="4"/>
    <rect x="35" y="112" width="130" height="12" rx="4" fill="#E5E5EA" stroke="#AEAEB2" stroke-width="2"/>
    <circle cx="155" cy="85" r="4" fill="#34C759"/>
    <rect x="135" y="82" width="12" height="6" rx="2" fill="#0066CC"/>
    <path d="M40 142C60 152 80 155 100 152C120 155 140 152 160 142" stroke="#0071E3" stroke-width="2.5" stroke-dasharray="4 4" stroke-linecap="round"/>
    <path d="M50 155C70 165 90 168 100 165C110 168 130 165 150 155" stroke="#0071E3" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"/>
  </svg>`,
  tv: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-zinc-800">
    <rect x="25" y="35" width="150" height="100" rx="6" fill="#1C1C1E" stroke="#3A3A3C" stroke-width="4"/>
    <rect x="30" y="40" width="140" height="90" rx="3" fill="#000000"/>
    <path d="M40 50L160 120M40 120L160 50" stroke="#0066CC" stroke-width="1.5" stroke-opacity="0.3"/>
    <circle cx="100" cy="85" r="24" fill="#0071E3" fill-opacity="0.15" stroke="#0071E3" stroke-width="2"/>
    <polygon points="95,73 112,85 95,97" fill="#0066CC"/>
    <path d="M85 135L80 165M115 135L120 165" stroke="#636366" stroke-width="4" stroke-linecap="round"/>
    <line x1="70" y1="165" x2="130" y2="165" stroke="#8E8E93" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  kitchen: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-zinc-800">
    <rect x="30" y="50" width="140" height="95" rx="10" fill="#E5E5EA" stroke="#AEAEB2" stroke-width="4"/>
    <rect x="42" y="65" width="85" height="65" rx="6" fill="#1C1C1E" stroke="#8E8E93" stroke-width="2"/>
    <circle cx="150" cy="75" r="10" fill="#D1D1D6" stroke="#8E8E93" stroke-width="2"/>
    <circle cx="150" cy="105" r="10" fill="#D1D1D6" stroke="#8E8E93" stroke-width="2"/>
    <line x1="150" y1="75" x2="150" y2="70" stroke="#0066CC" stroke-width="2" stroke-linecap="round"/>
    <rect x="52" y="75" width="65" height="45" rx="3" fill="#0071E3" fill-opacity="0.2"/>
  </svg>`,
};

export const MOCK_PRODUCTS: MockProductWithDetails[] = [
  // 1. LG AI DD Front Load Washer
  {
    id: "prod-lg-washer-1",
    slug: "lg-ai-dd-inverter-10-5kg-fv1410s4w",
    brand: "LG",
    model_number: "FV1410S4W",
    category_id: "cat-washer",
    origin_country: "Vietnam",
    release_year: 2024,
    price: 529,
    currency: "USD",
    show_price: true,
    status: "published",
    in_stock: true,
    featured: true,
    category: MOCK_CATEGORIES[2],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        id: "trans-1-en",
        product_id: "prod-lg-washer-1",
        locale: "en",
        name: "LG AI DD™ Front Load Washer 10.5kg Inverter",
        description:
          "Intelligent fabric care with AI Direct Drive™ technology. Automatically senses fabric weight and softness to deliver optimal wash motions. Features Steam™ allergy care that eliminates 99.9% of dust mites and allergens.",
        warranty_text: "10 Years on Inverter Direct Drive Motor, 1 Year on Machine Body",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "trans-1-km",
        product_id: "prod-lg-washer-1",
        locale: "km",
        name: "ម៉ាស៊ីនបោកគក់ទ្វារមុខ LG AI DD™ ទម្ងន់ 10.5គីឡូ អាំងវែរទ័រ",
        description:
          "បច្ចេកវិទ្យាឆ្លាតវៃ AI Direct Drive™ ការពារសាច់ក្រណាត់បានល្អបំផុតដោយស្គាល់ទម្ងន់ និងប្រភេទក្រណាត់ស្វ័យប្រវត្តិ។ មានមុខងារចំហាយទឹកកម្ដៅ Steam™ កម្ចាត់បាក់តេរី និងធូលីបាន 99.9%។",
        warranty_text: "ធានា ១០ ឆ្នាំលើម៉ូទ័រ Inverter Direct Drive និង ១ ឆ្នាំលើតួម៉ាស៊ីន",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    specifications: [
      {
        id: "spec-1-1",
        product_id: "prod-lg-washer-1",
        spec_key: "Washing Capacity",
        value_text: "10.5 kg",
        value_numeric: 10.5,
        unit: "kg",
        display_order: 1,
        source_note: "LG Official Specification Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-1-2",
        product_id: "prod-lg-washer-1",
        spec_key: "Max Spin Speed",
        value_text: "1400 RPM",
        value_numeric: 1400,
        unit: "RPM",
        display_order: 2,
        source_note: "LG Official Specification Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-1-3",
        product_id: "prod-lg-washer-1",
        spec_key: "Motor Type",
        value_text: "Inverter Direct Drive™",
        value_numeric: null,
        unit: null,
        display_order: 3,
        source_note: "LG Official Specification Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-1-4",
        product_id: "prod-lg-washer-1",
        spec_key: "Dimensions (W x D x H)",
        value_text: "600 x 565 x 850 mm",
        value_numeric: null,
        unit: "mm",
        display_order: 4,
        source_note: "LG Technical Manual",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-1-5",
        product_id: "prod-lg-washer-1",
        spec_key: "Energy Rating",
        value_text: "5-Star Energy Efficiency (A+++)",
        value_numeric: null,
        unit: null,
        display_order: 5,
        source_note: "National Energy Efficiency Label",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    images: [
      {
        id: "img-1-1",
        product_id: "prod-lg-washer-1",
        storage_path: "washer",
        alt_text_en: "LG Front Load Washer FV1410S4W Front Angle",
        alt_text_km: "រូបភាពម៉ាស៊ីនបោកគក់ LG FV1410S4W ផ្នែកខាងមុខ",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },

  // 2. Panasonic Prime Fresh Refrigerator (Price Hidden / Inquire)
  {
    id: "prod-panasonic-fridge-1",
    slug: "panasonic-prime-fresh-inverter-420l-nr-cw530xmm",
    brand: "Panasonic",
    model_number: "NR-CW530XMM",
    category_id: "cat-fridge",
    origin_country: "Japan",
    release_year: 2024,
    price: null, // Price hidden to showcase optional price display
    currency: "USD",
    show_price: false,
    status: "published",
    in_stock: true,
    featured: true,
    category: MOCK_CATEGORIES[1],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        id: "trans-2-en",
        product_id: "prod-panasonic-fridge-1",
        locale: "en",
        name: "Panasonic Prime Fresh 3-Door Inverter Refrigerator 420L",
        description:
          "Premium Japanese multi-door refrigerator featuring Prime Fresh soft freezing at -3°C to maintain freshness and nutrients without defrosting. Equipped with nanoe™ X antibacterial protection and ECONAVI intelligent sensors.",
        warranty_text: "12 Years on Inverter Compressor, 1 Year on Full Unit",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "trans-2-km",
        product_id: "prod-panasonic-fridge-1",
        locale: "km",
        name: "ទូរទឹកកក Panasonic Prime Fresh ទ្វារ ៣ អាំងវែរទ័រ ចំណុះ 420លីត្រ",
        description:
          "ទូរទឹកកកប្រណិតស្តង់ដារជប៉ុន មានមុខងារ Prime Fresh ក្លាស្សេត្រជាក់ -3°C រក្សាភាពស្រស់ដោយមិនចាំបាច់រំលាយទឹកកក។ បំពាក់បច្ចេកវិទ្យា nanoe™ X កម្ចាត់បាក់តេរី និងក្លិនអាក្រក់ រួមជាមួយសេនស័រ ECONAVI សន្សំសំចៃភ្លើង។",
        warranty_text: "ធានា ១២ ឆ្នាំលើកុំប្រេស័រ Inverter និង ១ ឆ្នាំលើតួទូ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    specifications: [
      {
        id: "spec-2-1",
        product_id: "prod-panasonic-fridge-1",
        spec_key: "Total Capacity",
        value_text: "420 Liters",
        value_numeric: 420,
        unit: "L",
        display_order: 1,
        source_note: "Panasonic Global Catalog",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-2-2",
        product_id: "prod-panasonic-fridge-1",
        spec_key: "Cooling Technology",
        value_text: "Prime Fresh Soft Freezing (-3°C)",
        value_numeric: -3,
        unit: "°C",
        display_order: 2,
        source_note: "Panasonic Global Catalog",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-2-3",
        product_id: "prod-panasonic-fridge-1",
        spec_key: "Hygiene System",
        value_text: "nanoe™ X Antibacterial & Deodorizer",
        value_numeric: null,
        unit: null,
        display_order: 3,
        source_note: "Panasonic Laboratory Test",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-2-4",
        product_id: "prod-panasonic-fridge-1",
        spec_key: "Refrigerant",
        value_text: "R600a Eco-Friendly",
        value_numeric: null,
        unit: null,
        display_order: 4,
        source_note: "Manufacturer Plate",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    images: [
      {
        id: "img-2-1",
        product_id: "prod-panasonic-fridge-1",
        storage_path: "fridge",
        alt_text_en: "Panasonic NR-CW530XMM Refrigerator",
        alt_text_km: "រូបភាពទូរទឹកកក Panasonic NR-CW530XMM",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },

  // 3. Daikin Inverter Air Conditioner 1.5 HP
  {
    id: "prod-daikin-ac-1",
    slug: "daikin-inverter-1-5hp-r32-ftkf35xvm",
    brand: "Daikin",
    model_number: "FTKF35XVM",
    category_id: "cat-ac",
    origin_country: "Thailand",
    release_year: 2024,
    price: 439,
    currency: "USD",
    show_price: true,
    status: "published",
    in_stock: true,
    featured: true,
    category: MOCK_CATEGORIES[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        id: "trans-3-en",
        product_id: "prod-daikin-ac-1",
        locale: "en",
        name: "Daikin Streamer Inverter Air Conditioner 1.5 HP (R32)",
        description:
          "Advanced climate control powered by Daikin Streamer Air Purification that decomposes viruses, bacteria, and allergens. Gin-ION blue filter provides continuous mold prevention. High-efficiency swing compressor saves up to 60% energy.",
        warranty_text: "5 Years on Compressor, 1 Year on Internal Components",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "trans-3-km",
        product_id: "prod-daikin-ac-1",
        locale: "km",
        name: "ម៉ាស៊ីនត្រជាក់ Daikin Streamer អាំងវែរទ័រ កម្លាំង 1.5សេះ (R32)",
        description:
          "ម៉ាស៊ីនត្រជាក់បច្ចេកវិទ្យា Streamer សម្លាប់មេរោគ បាក់តេរី និងក្លិនមិនល្អនៅក្នុងបន្ទប់។ តម្រង Gin-ION ការពារផ្សិត និងមេរោគបានយ៉ាងមានប្រសិទ្ធភាព។ ម៉ូទ័រ Swing Inverter សន្សំសំចៃភ្លើងរហូតដល់ 60%។",
        warranty_text: "ធានា ៥ ឆ្នាំលើកុំប្រេស័រ និង ១ ឆ្នាំលើគ្រឿងបន្លាស់ទូទៅ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    specifications: [
      {
        id: "spec-3-1",
        product_id: "prod-daikin-ac-1",
        spec_key: "Cooling Capacity",
        value_text: "12,300 BTU/h (1.5 HP)",
        value_numeric: 12300,
        unit: "BTU/h",
        display_order: 1,
        source_note: "Daikin Technical Data Book",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-3-2",
        product_id: "prod-daikin-ac-1",
        spec_key: "Power Consumption",
        value_text: "990 Watts",
        value_numeric: 990,
        unit: "W",
        display_order: 2,
        source_note: "Daikin Technical Data Book",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-3-3",
        product_id: "prod-daikin-ac-1",
        spec_key: "Refrigerant Type",
        value_text: "R32 Zero Ozone Depletion",
        value_numeric: null,
        unit: null,
        display_order: 3,
        source_note: "Manufacturer Plate",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-3-4",
        product_id: "prod-daikin-ac-1",
        spec_key: "Indoor Noise Level",
        value_text: "19 dB(A) Quiet Operation",
        value_numeric: 19,
        unit: "dB",
        display_order: 4,
        source_note: "Daikin Acoustic Spec Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    images: [
      {
        id: "img-3-1",
        product_id: "prod-daikin-ac-1",
        storage_path: "ac",
        alt_text_en: "Daikin Inverter FTKF35XVM Unit",
        alt_text_km: "រូបភាពម៉ាស៊ីនត្រជាក់ Daikin FTKF35XVM",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },

  // 4. Sony BRAVIA 4K HDR Google TV 65"
  {
    id: "prod-sony-tv-1",
    slug: "sony-bravia-4k-hdr-google-tv-65-inch-kd-65x80l",
    brand: "Sony",
    model_number: "KD-65X80L",
    category_id: "cat-tv",
    origin_country: "Malaysia",
    release_year: 2024,
    price: 849,
    currency: "USD",
    show_price: true,
    status: "published",
    in_stock: true,
    featured: true,
    category: MOCK_CATEGORIES[3],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        id: "trans-4-en",
        product_id: "prod-sony-tv-1",
        locale: "en",
        name: "Sony BRAVIA 4K HDR Google TV 65-inch (X80L)",
        description:
          "Billion colors brought to life with 4K HDR Processor X1™ and TRILUMINOS PRO™. Dolby Vision and Dolby Atmos deliver cinema-quality picture and surround sound. Powered by Google TV with built-in voice search.",
        warranty_text: "2 Years Full Official Sony Warranty",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "trans-4-km",
        product_id: "prod-sony-tv-1",
        locale: "km",
        name: "ទូរទស្សន៍ឆ្លាតវៃ Sony BRAVIA 4K HDR Google TV 65អ៊ីញ (X80L)",
        description:
          "រូបភាពច្បាស់ត្រជាក់ភ្នែកជាមួយឈីប 4K HDR Processor X1™ និងបច្ចេកវិទ្យាពណ៌ TRILUMINOS PRO™។ ប្រព័ន្ធសំឡេង និងរូបភាពកម្រិតរោងភាពយន្ត Dolby Vision / Dolby Atmos។ ដំណើរការដោយ Google TV ងាយស្រួលបញ្ជាដោយសំឡេង។",
        warranty_text: "ធានាផ្លូវការរយៈពេល ២ ឆ្នាំពេញពីក្រុមហ៊ុន Sony",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    specifications: [
      {
        id: "spec-4-1",
        product_id: "prod-sony-tv-1",
        spec_key: "Screen Size & Resolution",
        value_text: '65" Diagonal (3840 x 2160 pixels)',
        value_numeric: 65,
        unit: "inch",
        display_order: 1,
        source_note: "Sony Official Specifications",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-4-2",
        product_id: "prod-sony-tv-1",
        spec_key: "Picture Processor",
        value_text: "4K HDR Processor X1™",
        value_numeric: null,
        unit: null,
        display_order: 2,
        source_note: "Sony Official Specifications",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-4-3",
        product_id: "prod-sony-tv-1",
        spec_key: "Operating System",
        value_text: "Google TV with Chromecast Built-in",
        value_numeric: null,
        unit: null,
        display_order: 3,
        source_note: "Sony Official Specifications",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-4-4",
        product_id: "prod-sony-tv-1",
        spec_key: "Audio Output",
        value_text: "20W (X-Balanced Speaker) with Dolby Atmos",
        value_numeric: 20,
        unit: "W",
        display_order: 4,
        source_note: "Sony Official Specifications",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    images: [
      {
        id: "img-4-1",
        product_id: "prod-sony-tv-1",
        storage_path: "tv",
        alt_text_en: "Sony BRAVIA 65 Inch TV Front View",
        alt_text_km: "រូបភាពទូរទស្សន៍ Sony BRAVIA 65 អ៊ីញ",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },

  // 5. Panasonic Inverter Convection Microwave Oven
  {
    id: "prod-panasonic-microwave-1",
    slug: "panasonic-inverter-convection-microwave-oven-34l-nn-cd87ks",
    brand: "Panasonic",
    model_number: "NN-CD87KS",
    category_id: "cat-kitchen",
    origin_country: "Japan",
    release_year: 2024,
    price: 369,
    currency: "USD",
    show_price: true,
    status: "published",
    in_stock: false, // Available to order
    featured: false,
    category: MOCK_CATEGORIES[4],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        id: "trans-5-en",
        product_id: "prod-panasonic-microwave-1",
        locale: "en",
        name: "Panasonic 4-in-1 Inverter Convection Microwave Oven 34L",
        description:
          "Combines Microwave, Convection Bake, Grill, and Combination cooking in one stainless steel appliance. Panasonic Inverter technology delivers precise continuous heat to avoid uneven cooking and cold spots.",
        warranty_text: "1 Year Official Warranty",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "trans-5-km",
        product_id: "prod-panasonic-microwave-1",
        locale: "km",
        name: "ម៉ាស៊ីនមីក្រូវ៉េវ និងដុតនំ Panasonic 4-in-1 អាំងវែរទ័រ 34លីត្រ",
        description:
          "ម៉ាស៊ីនពហុមុខងារ ៤ ក្នុង ១ អាចកម្ដៅ ដុត អាំង និងចម្អិនអាហារបានរហ័ស។ បច្ចេកវិទ្យា Inverter ផ្តល់កម្ដៅស្មើល្អ មិនឆ្អិនក្រៅឆៅក្នុង។ តួផលិតពីដែកអ៊ីណុក Stainless Steel ងាយសម្អាត។",
        warranty_text: "ធានាផ្លូវការរយៈពេល ១ ឆ្នាំ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    specifications: [
      {
        id: "spec-5-1",
        product_id: "prod-panasonic-microwave-1",
        spec_key: "Cavity Capacity",
        value_text: "34 Liters",
        value_numeric: 34,
        unit: "L",
        display_order: 1,
        source_note: "Panasonic Specification Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-5-2",
        product_id: "prod-panasonic-microwave-1",
        spec_key: "Microwave Power",
        value_text: "1000 W",
        value_numeric: 1000,
        unit: "W",
        display_order: 2,
        source_note: "Panasonic Specification Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-5-3",
        product_id: "prod-panasonic-microwave-1",
        spec_key: "Grill & Convection",
        value_text: "1300 W Quartz Grill / 40-220°C Bake",
        value_numeric: 1300,
        unit: "W",
        display_order: 3,
        source_note: "Panasonic Specification Sheet",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    images: [
      {
        id: "img-5-1",
        product_id: "prod-panasonic-microwave-1",
        storage_path: "kitchen",
        alt_text_en: "Panasonic Microwave Oven",
        alt_text_km: "រូបភាពម៉ាស៊ីនមីក្រូវ៉េវ Panasonic",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },

  // 6. Samsung AI Ecobubble Front Load Washer
  {
    id: "prod-samsung-washer-1",
    slug: "samsung-ai-ecobubble-inverter-9kg-ww90t504dax",
    brand: "Samsung",
    model_number: "WW90T504DAX",
    category_id: "cat-washer",
    origin_country: "Vietnam",
    release_year: 2024,
    price: 479,
    currency: "USD",
    show_price: true,
    status: "published",
    in_stock: true,
    featured: false,
    category: MOCK_CATEGORIES[2],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        id: "trans-6-en",
        product_id: "prod-samsung-washer-1",
        locale: "en",
        name: "Samsung AI EcoBubble™ Front Load Washer 9kg Inverter",
        description:
          "Deep clean at low temperatures with EcoBubble™ technology that turns detergent into bubbles to penetrate fabric fast. AI Control personalizes washing cycles by remembering your habits.",
        warranty_text: "20 Years on Digital Inverter Motor, 1 Year on Machine",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "trans-6-km",
        product_id: "prod-samsung-washer-1",
        locale: "km",
        name: "ម៉ាស៊ីនបោកគក់ទ្វារមុខ Samsung AI EcoBubble™ 9គីឡូ អាំងវែរទ័រ",
        description:
          "បច្ចេកវិទ្យាពពុះសាប៊ូ EcoBubble™ ជ្រាបចូលសរសៃក្រណាត់បានលឿន សម្អាតស្នាមប្រឡាក់បានស្អាតល្អទោះបោកទឹកត្រជាក់។ ប្រព័ន្ធ AI Control ចងចាំទម្លាប់ប្រើប្រាស់ និងណែនាំកម្មវិធីបោកគក់សមស្រប។",
        warranty_text: "ធានា ២០ ឆ្នាំលើម៉ូទ័រ Digital Inverter និង ១ ឆ្នាំលើតួម៉ាស៊ីន",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    specifications: [
      {
        id: "spec-6-1",
        product_id: "prod-samsung-washer-1",
        spec_key: "Washing Capacity",
        value_text: "9.0 kg",
        value_numeric: 9.0,
        unit: "kg",
        display_order: 1,
        source_note: "Samsung Technical Specification",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-6-2",
        product_id: "prod-samsung-washer-1",
        spec_key: "Spin Speed",
        value_text: "1400 RPM",
        value_numeric: 1400,
        unit: "RPM",
        display_order: 2,
        source_note: "Samsung Technical Specification",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "spec-6-3",
        product_id: "prod-samsung-washer-1",
        spec_key: "Motor Guarantee",
        value_text: "Digital Inverter with 20-Year Warranty",
        value_numeric: 20,
        unit: "years",
        display_order: 3,
        source_note: "Samsung Warranty Certificate",
        verification_status: "verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    images: [
      {
        id: "img-6-1",
        product_id: "prod-samsung-washer-1",
        storage_path: "washer",
        alt_text_en: "Samsung Front Load Washer",
        alt_text_km: "រូបភាពម៉ាស៊ីនបោកគក់ Samsung",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

// Helper functions for catalog queries
export function getAllProducts(): MockProductWithDetails[] {
  return MOCK_PRODUCTS;
}

export function getProductBySlug(slug: string): MockProductWithDetails | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): MockProductWithDetails[] {
  if (!categorySlug || categorySlug === "all") return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category?.slug === categorySlug);
}

export function getFeaturedProducts(): MockProductWithDetails[] {
  return MOCK_PRODUCTS.filter((p) => p.featured);
}
