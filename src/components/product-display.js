import React from 'react';

export function ProductDisplay({ product }) {
    if (!product) {
        return <div>No product information available.</div>;
    }

    return (
        <div className="product-display">
            <h2>Product Details</h2>
            <p><strong>Product ID:</strong> {product.id}</p>
            <p><strong>Product Name:</strong> {product.name}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
        </div>
    );
}