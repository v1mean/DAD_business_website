// Application-wide constants
// Business and configuration values used across the application.

export const SUPPORTED_LOCALES = ["en", "km"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const VERIFICATION_STATUSES = [
  "verified",
  "unverified",
  "not_provided",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const STAFF_ROLES = ["administrator", "editor"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
