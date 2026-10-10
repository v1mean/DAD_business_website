// Telegram utility functions
// Creates standardized direct Telegram inquiry links with prefilled messages.

export function getTelegramUsername(): string {
  const envUser = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME;
  if (envUser && envUser !== "your_telegram_username") {
    return envUser.replace(/^@/, "");
  }
  return "dadelectronics"; // fallback store username
}

export function buildTelegramInquiryUrl({
  modelNumber,
  productName,
  locale = "en",
}: {
  modelNumber: string;
  productName: string;
  locale?: "en" | "km";
}): string {
  const username = getTelegramUsername();
  
  const text =
    locale === "km"
      ? `សួស្តី DAD Electronics! ខ្ញុំចង់សាកសួរព័ត៌មានបន្ថែម និងតម្លៃអំពីផលិតផល:\n📦 ម៉ូដែល: ${modelNumber}\n🏷️ ឈ្មោះ: ${productName}`
      : `Hello DAD Electronics! I would like to inquire about this appliance:\n📦 Model: ${modelNumber}\n🏷️ Name: ${productName}`;

  return `https://t.me/${username}?text=${encodeURIComponent(text)}`;
}
