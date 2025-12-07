/**
 * Fetch product details from ERPNext using barcode
 * Uses Frappe's API if available, otherwise falls back to fetch
 */
export const fetchProductDetails = async (barcode) => {
    // Use Frappe's call method if available (when running in Frappe context)
    if (typeof frappe !== 'undefined' && frappe.call) {
        return new Promise((resolve, reject) => {
            frappe.call({
                method: 'barcode_to_item_id.api.scan_barcode_and_get_item',
                args: { barcode: barcode },
                callback: function(r) {
                    if (r.message && r.message.success) {
                        resolve({
                            productId: r.message.item_code,
                            productName: r.message.item_name,
                            productText: r.message.description,
                            itemGroup: r.message.item_group,
                            supplier: r.message.supplier,
                            valuationRate: r.message.valuation_rate,
                            image: r.message.image,
                            barcode: r.message.barcode
                        });
                    } else {
                        reject(new Error(r.message?.error || 'Product not found'));
                    }
                },
                error: function(r) {
                    reject(new Error('API error: ' + (r.message || 'Unknown error')));
                }
            });
        });
    }

    // Fallback: Use fetch API for standalone usage
    try {
        const response = await fetch('/api/method/barcode_to_item_id.api.scan_barcode_and_get_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Frappe-CSRF-Token': window.csrf_token || ''
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
                productName: data.message.item_name,
                productText: data.message.description,
                itemGroup: data.message.item_group,
                supplier: data.message.supplier,
                valuationRate: data.message.valuation_rate,
                image: data.message.image,
                barcode: data.message.barcode
            };
        } else {
            throw new Error(data.message?.error || 'Product not found');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

/**
 * Alternative: Use ERPNext's native scan_barcode API
 * This searches Item Barcode, Serial No, Batch, and Warehouse
 */
export const scanBarcodeNative = async (barcode) => {
    if (typeof frappe !== 'undefined' && frappe.call) {
        return new Promise((resolve, reject) => {
            frappe.call({
                method: 'erpnext.stock.utils.scan_barcode',
                args: { search_value: barcode },
                callback: function(r) {
                    if (r.message && Object.keys(r.message).length > 0) {
                        resolve(r.message);
                    } else {
                        reject(new Error('Barcode not found'));
                    }
                },
                error: function(r) {
                    reject(new Error('API error'));
                }
            });
        });
    }

    throw new Error('Frappe not available');
};
