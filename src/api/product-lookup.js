import axios from 'axios';
import { ERPNextConfig } from '../config/erpnext-config';

export const fetchProductDetails = async (barcode) => {
    try {
        const response = await axios.get(`${ERPNextConfig.apiUrl}/products?barcode=${barcode}`, {
            headers: {
                'Authorization': `Bearer ${ERPNextConfig.apiKey}`
            }
        });
        if (response.data && response.data.length > 0) {
            const product = response.data[0];
            return {
                productId: product.id,
                productText: product.description
            };
        } else {
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};