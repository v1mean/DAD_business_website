import QRCode from "qrcode";

/**
 * Get permanent public destination URL for a product slug.
 * Slugs never change so printed physical showroom stickers remain permanently valid.
 */
export function getProductDestinationUrl(slug: string): string {
  const baseUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return `${baseUrl.replace(/\/$/, "")}/products/${slug}`;
}

/**
 * Generate a clean, vector SVG string of the QR code.
 */
export async function generateQrSvg(
  url: string,
  options?: {
    color?: string;
    bgColor?: string;
    margin?: number;
  }
): Promise<string> {
  return await QRCode.toString(url, {
    type: "svg",
    margin: options?.margin ?? 1,
    color: {
      dark: options?.color ?? "#1d1d1f",
      light: options?.bgColor ?? "#ffffff",
    },
  });
}

/**
 * Generate a high-resolution base64 PNG data URL of the QR code.
 */
export async function generateQrDataUrl(
  url: string,
  options?: {
    width?: number;
    color?: string;
    bgColor?: string;
    margin?: number;
  }
): Promise<string> {
  return await QRCode.toDataURL(url, {
    width: options?.width ?? 1024,
    margin: options?.margin ?? 1,
    color: {
      dark: options?.color ?? "#1d1d1f",
      light: options?.bgColor ?? "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}

/**
 * Trigger immediate browser download of an SVG file.
 */
export function downloadSvgFile(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".svg") ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger immediate browser download of a PNG data URL.
 */
export function downloadPngFile(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
