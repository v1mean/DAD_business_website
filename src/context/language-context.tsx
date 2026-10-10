"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import type { Locale } from "@/lib/constants";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
  isKhmer: boolean;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.categories": "Categories",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.telegram": "Telegram",
    "nav.tagline": "Electronics QR Product Catalog",
    "nav.search_placeholder": "Search appliances (model, brand, spec)...",
    
    // Homepage
    "hero.badge": "Official Electronics Showroom",
    "hero.title": "Engineered for Comfort. Built to Last.",
    "hero.subtitle": "Scan physical QR stickers in our showroom or browse our verified appliance catalog below.",
    "hero.cta_catalog": "Explore Catalog",
    "hero.cta_contact": "Contact on Telegram",
    "categories.title": "Browse by Category",
    "categories.subtitle": "Select a category to view high-performance home appliances",
    "featured.title": "Featured Appliances",
    "featured.subtitle": "Hand-picked energy-efficient models with verified manufacturer specifications",
    "showroom.badge": "Showroom Experience",
    "showroom.title": "Scan Any Product QR in Store",
    "showroom.desc": "Every physical appliance in our showroom features a unique QR label. Scan it with your smartphone camera to immediately inspect full technical specifications, energy ratings, warranty coverage, and current pricing.",
    
    // Catalog & Filters
    "catalog.title": "Product Catalog",
    "catalog.subtitle": "Browse verified home and commercial appliances with authentic specifications",
    "filter.all_categories": "All Categories",
    "filter.brand": "Brand",
    "filter.all_brands": "All Brands",
    "filter.availability": "Availability",
    "filter.all_status": "All Status",
    "filter.in_stock": "In Stock Only",
    "filter.sort": "Sort By",
    "filter.sort_newest": "Newest Models",
    "filter.sort_price_asc": "Price: Low to High",
    "filter.sort_price_desc": "Price: High to Low",
    "filter.clear": "Reset Filters",
    "filter.results_count": "Showing {count} appliances",
    "filter.empty_title": "No matching appliances found",
    "filter.empty_desc": "Try adjusting your search query, selecting another category, or resetting your filters.",

    // Product Card
    "card.view_details": "View Details",
    "card.inquire_telegram": "Inquire via Telegram",
    "card.model": "Model",
    "card.brand": "Brand",
    "card.in_stock": "In Stock",
    "card.available_order": "Available to Order",
    "card.contact_for_price": "Contact for Price",
    "card.verified_specs": "Verified Specs",
    "card.warranty": "Warranty",

    // Product Detail
    "detail.back": "Back to Catalog",
    "detail.model_number": "Model Number",
    "detail.brand": "Manufacturer",
    "detail.category": "Category",
    "detail.origin": "Country of Origin",
    "detail.release_year": "Release Year",
    "detail.warranty_coverage": "Warranty Coverage",
    "detail.specifications": "Technical Specifications",
    "detail.verified": "Verified Specification",
    "detail.spec_source": "Source: Manufacturer Sheet",
    "detail.unverified": "Pending Verification",
    "detail.price": "Price",
    "detail.price_hidden_title": "Pricing Upon Inquiry",
    "detail.price_hidden_desc": "For today's competitive promotion price or delivery quotation, contact our sales desk directly.",
    "detail.cta_telegram": "Ask About This Product",
    "detail.cta_qr": "Show QR Label",
    "detail.qr_modal_title": "Showroom QR Code",
    "detail.qr_modal_desc": "Scan this code with any phone camera to reopen this exact product specification page.",
    "detail.related_title": "Similar Appliances in Category",
    "detail.related_subtitle": "Compare specifications with alternative models",

    // Telegram Pre-fill message
    "telegram.inquiry_prefix": "Hello DAD Electronics, I would like to inquire about",
    "telegram.model_label": "Model",

    // Footer
    "footer.desc": "Your trusted electronics destination in Phnom Penh, Cambodia. Providing authenticated home appliances, verified specifications, and direct customer support.",
    "footer.quick_links": "Quick Links",
    "footer.categories": "Categories",
    "footer.contact": "Store & Contact",
    "footer.address": "Phnom Penh, Kingdom of Cambodia",
    "footer.hours": "Mon - Sun: 8:00 AM - 7:00 PM",
    "footer.rights": "All rights reserved. DAD Electronics QR Catalog.",
    "footer.legal": "Specifications are verified against official manufacturer documentation.",
  },
  km: {
    // Navigation
    "nav.home": "ទំព័រដើម",
    "nav.products": "ផលិតផល",
    "nav.categories": "ប្រភេទ",
    "nav.about": "អំពីយើង",
    "nav.contact": "ទំនាក់ទំនង",
    "nav.admin": "គ្រប់គ្រង",
    "nav.telegram": "តេឡេក្រាម",
    "nav.tagline": "កាតាឡុកអេឡិចត្រូនិក QR",
    "nav.search_placeholder": "ស្វែងរកឧបករណ៍អេឡិចត្រូនិក (ម៉ូដែល ម៉ាក លក្ខណៈ)...",

    // Homepage
    "hero.badge": "បន្ទប់តាំងបង្ហាញផ្លូវការ",
    "hero.title": "រចនាឡើងដើម្បីផាសុកភាព គុណភាពជាប់បានយូរ",
    "hero.subtitle": "ស្កេនស្លាក QR នៅលើផលិតផលជាក់ស្តែងក្នុងហាង ឬស្វែងរកក្នុងកាតាឡុករបស់យើងខាងក្រោម។",
    "hero.cta_catalog": "មើលកាតាឡុកទាំងអស់",
    "hero.cta_contact": "ទំនាក់ទំនងតាម Telegram",
    "categories.title": "ស្វែងរកតាមប្រភេទ",
    "categories.subtitle": "ជ្រើសរើសប្រភេទឧបករណ៍ប្រើប្រាស់ក្នុងផ្ទះគុណភាពខ្ពស់",
    "featured.title": "ផលិតផលពិសេស",
    "featured.subtitle": "ម៉ូដែលសន្សំសំចៃថាមពល និងមានលក្ខណៈបច្ចេកទេសបញ្ជាក់ច្បាស់លាស់ពីរោងចក្រ",
    "showroom.badge": "បទពិសោធន៍ក្នុងហាង",
    "showroom.title": "ស្កេនកូដ QR លើគ្រប់ផលិតផលក្នុងហាង",
    "showroom.desc": "គ្រប់ឧបករណ៍ក្នុងហាងតាំងបង្ហាញរបស់យើងមានបិទស្លាក QR ផ្ទាល់ខ្លួន។ គ្រាន់តែស្កេនដោយកាមេរ៉ាទូរស័ព្ទ ដើម្បីពិនិត្យមើលលក្ខណៈបច្ចេកទេស ការសន្សំសំចៃភ្លើង ការធានា និងតម្លៃទាន់សម័យភ្លាមៗ។",

    // Catalog & Filters
    "catalog.title": "កាតាឡុកផលិតផល",
    "catalog.subtitle": "ស្វែងរកឧបករណ៍អេឡិចត្រូនិកដែលមានលក្ខណៈបច្ចេកទេសពិតប្រាកដ",
    "filter.all_categories": "គ្រប់ប្រភេទទាំងអស់",
    "filter.brand": "ម៉ាកផលិតផល",
    "filter.all_brands": "គ្រប់ម៉ាកទាំងអស់",
    "filter.availability": "ស្ថានភាពស្តុក",
    "filter.all_status": "គ្រប់ស្ថានភាព",
    "filter.in_stock": "មានក្នុងស្តុកតែប៉ុណ្ណោះ",
    "filter.sort": "តម្រៀបតាម",
    "filter.sort_newest": "ម៉ូដែលថ្មីៗ",
    "filter.sort_price_asc": "តម្លៃ៖ ទាបទៅខ្ពស់",
    "filter.sort_price_desc": "តម្លៃ៖ ខ្ពស់ទៅទាប",
    "filter.clear": "កំណត់ឡើងវិញ",
    "filter.results_count": "បង្ហាញចំនួន {count} ផលិតផល",
    "filter.empty_title": "រកមិនឃើញផលិតផលដែលត្រូវគ្នាទេ",
    "filter.empty_desc": "សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬកំណត់តម្រងឡើងវិញ។",

    // Product Card
    "card.view_details": "មើលព័ត៌មានលម្អិត",
    "card.inquire_telegram": "សាកសួរតាម Telegram",
    "card.model": "ម៉ូដែល",
    "card.brand": "ម៉ាក",
    "card.in_stock": "មានក្នុងស្តុក",
    "card.available_order": "អាចកុម្ម៉ង់ទុកមុន",
    "card.contact_for_price": "សូមទាក់ទងតម្លៃ",
    "card.verified_specs": "ព័ត៌មានផ្ទៀងផ្ទាត់រួច",
    "card.warranty": "ការធានា",

    // Product Detail
    "detail.back": "ត្រឡប់ទៅកាតាឡុក",
    "detail.model_number": "លេខម៉ូដែល",
    "detail.brand": "ក្រុមហ៊ុនផលិត",
    "detail.category": "ប្រភេទ",
    "detail.origin": "ប្រទេសផលិត",
    "detail.release_year": "ឆ្នាំចេញលក់",
    "detail.warranty_coverage": "រយៈពេលធានា",
    "detail.specifications": "លក្ខណៈបច្ចេកទេសលម្អិត",
    "detail.verified": "លក្ខណៈផ្ទៀងផ្ទាត់ផ្លូវការ",
    "detail.spec_source": "ប្រភព៖ ឯកសារបច្ចេកទេសរោងចក្រ",
    "detail.unverified": "រង់ចាំការផ្ទៀងផ្ទាត់",
    "detail.price": "តម្លៃ",
    "detail.price_hidden_title": "សូមទាក់ទងសម្រាប់តម្លៃ",
    "detail.price_hidden_desc": "ដើម្បីទទួលបានតម្លៃប្រូម៉ូសិនពិសេសថ្ងៃនេះ ឬតម្លៃដឹកជញ្ជូន សូមទាក់ទងមកកាន់យើងផ្ទាល់។",
    "detail.cta_telegram": "សាកសួរអំពីផលិតផលនេះ",
    "detail.cta_qr": "បង្ហាញកូដ QR",
    "detail.qr_modal_title": "កូដ QR សម្រាប់ផលិតផល",
    "detail.qr_modal_desc": "ស្កេនកូដនេះដោយទូរស័ព្ទដៃ ដើម្បីបើកមើលទំព័រលក្ខណៈបច្ចេកទេសនេះឡើងវិញ។",
    "detail.related_title": "ផលិតផលស្រដៀងគ្នាក្នុងប្រភេទនេះ",
    "detail.related_subtitle": "ប្រៀបធៀបលក្ខណៈបច្ចេកទេសជាមួយម៉ូដែលផ្សេងៗ",

    // Telegram Pre-fill message
    "telegram.inquiry_prefix": "សួស្តី DAD Electronics ខ្ញុំចង់សាកសួរព័ត៌មានបន្ថែមអំពី",
    "telegram.model_label": "ម៉ូដែល",

    // Footer
    "footer.desc": "ទីតាំងឧបករណ៍អេឡិចត្រូនិកទំនើប និងគួរឱ្យទុកចិត្តនៅរាជធានីភ្នំពេញ។ ផ្តល់ជូនផលិតផលសុទ្ធ លក្ខណៈបច្ចេកទេសពិត និងសេវាបំរើអតិថិជនរហ័ស។",
    "footer.quick_links": "តំណភ្ជាប់រហ័ស",
    "footer.categories": "ប្រភេទផលិតផល",
    "footer.contact": "ទំនាក់ទំនង និងហាង",
    "footer.address": "រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា",
    "footer.hours": "ចន្ទ - អាទិត្យ៖ ៨:០០ ព្រឹក - ៧:០០ យប់",
    "footer.rights": "រក្សាសិទ្ធិគ្រប់យ៉ាង។ កាតាឡុកអេឡិចត្រូនិក DAD Electronics។",
    "footer.legal": "លក្ខណៈបច្ចេកទេសទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់ជាមួយឯកសារផ្លូវការរបស់រោងចក្រ។",
  },
};

const LOCALE_STORAGE_KEY = "dad_locale";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("local-storage-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("local-storage-change", callback);
  };
}

function getSnapshot(): Locale {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  return saved === "km" ? "km" : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      window.dispatchEvent(new Event("local-storage-change"));
      document.documentElement.lang = newLocale;
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "km" : "en");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: string): string => {
      const current = translations[locale]?.[key];
      if (current) return current;
      return translations.en?.[key] || key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        isKhmer: locale === "km",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
