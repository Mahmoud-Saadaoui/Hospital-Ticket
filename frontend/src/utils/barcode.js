const PNG_DATA_URI_PREFIX = "data:image/png;base64,";

export const isBarcodeText = (value) =>
  typeof value === "string" && /^HOSP-[A-Z0-9-]+$/.test(value);

export const isBarcodeImage = (value) =>
  typeof value === "string" && value.startsWith(PNG_DATA_URI_PREFIX);

export const getBarcodeImageSource = (barcodeImage) =>
  isBarcodeImage(barcodeImage) ? barcodeImage : null;

export { PNG_DATA_URI_PREFIX };
