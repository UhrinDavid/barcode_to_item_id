export function formatProductText(productText) {
    return productText.trim().toUpperCase();
}

export function validateBarcode(barcode) {
    const barcodeRegex = /^[0-9]{12,13}$/; // Example regex for 12 or 13 digit barcodes
    return barcodeRegex.test(barcode);
}