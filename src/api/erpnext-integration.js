export async function getProductFromERPNext(barcode) {
    const apiUrl = 'https://your-erpnext-instance/api/resource/Product';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'token your_api_key:your_api_secret'
    };

    try {
        const response = await fetch(`${apiUrl}?filters=[["barcode", "=", "${barcode}"]]`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
            return {
                productId: data.data[0].name,
                productText: data.data[0].product_name
            };
        } else {
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product from ERPNext:', error);
        throw error;
    }
}