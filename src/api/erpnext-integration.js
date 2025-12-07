/**
 * ERPNext Integration - Barcode scanning using Frappe's API
 *
 * This module provides functions to interact with ERPNext's barcode
 * scanning capabilities using Frappe's built-in methods.
 */

/**
 * Get product from ERPNext using the custom barcode_to_item_id API
 * @param {string} barcode - The barcode to search for
 * @returns {Promise<Object>} Product details
 */
export async function getProductFromERPNext(barcode) {
    // Use Frappe's call if available
    if (typeof frappe !== 'undefined' && frappe.call) {
        return new Promise((resolve, reject) => {
            frappe.call({
                method: 'barcode_to_item_id.api.scan_barcode_and_get_item',
                args: { barcode: barcode },
                callback: function(r) {
                    if (r.message && r.message.success) {
                        resolve({
                            productId: r.message.item_code,
                            productName: r.message.item_name
                        });
                    } else {
                        reject(new Error(r.message?.error || 'Product not found'));
                    }
                },
                error: function(r) {
                    reject(new Error('Network error'));
                }
            });
        });
    }

    // Fallback to fetch API
    const response = await fetch('/api/method/barcode_to_item_id.api.scan_barcode_and_get_item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ barcode: barcode })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.message && data.message.success) {
        return {
            productId: data.message.item_code,
            productName: data.message.item_name
        };
    } else {
        throw new Error(data.message?.error || 'Product not found');
    }
}

/**
 * Use ERPNext's native scan_barcode function
 * This is the same API used by ERPNext's POS and Stock transactions
 * @param {string} searchValue - Barcode, serial no, batch no, or warehouse
 * @returns {Promise<Object>} Scan result with item_code, barcode, batch_no, serial_no, etc.
 */
export async function useNativeScanBarcode(searchValue) {
    if (typeof frappe !== 'undefined' && frappe.call) {
        return new Promise((resolve, reject) => {
            frappe.call({
                method: 'erpnext.stock.utils.scan_barcode',
                args: { search_value: searchValue },
                callback: function(r) {
                    if (r.message && Object.keys(r.message).length > 0) {
                        resolve(r.message);
                    } else {
                        reject(new Error('Not found'));
                    }
                },
                error: reject
            });
        });
    }

    throw new Error('Frappe context not available');
}
