import React, { useEffect, useState } from 'react';
import { BarcodeScanner } from '../scanner/barcode-scanner';
import { CameraHandler } from '../scanner/camera-handler';
import { fetchProductDetails } from '../api/product-lookup';
import ProductDisplay from './product-display';

const ScannerView = () => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const barcodeScanner = new BarcodeScanner();
    const cameraHandler = new CameraHandler();

    useEffect(() => {
        const handleScan = async (barcode) => {
            try {
                const productDetails = await fetchProductDetails(barcode);
                setProduct(productDetails);
            } catch (err) {
                setError('Failed to fetch product details');
            }
        };

        const startScanning = () => {
            setScanning(true);
            cameraHandler.initializeCamera();
            barcodeScanner.startScanning(handleScan);
        };

        const stopScanning = () => {
            setScanning(false);
            barcodeScanner.stopScanning();
            cameraHandler.releaseCamera();
        };

        if (scanning) {
            return () => stopScanning();
        }

        startScanning();
    }, [scanning]);

    return (
        <div className="scanner-view">
            {scanning && <div className="scanner-overlay">Scanning...</div>}
            {error && <div className="error-message">{error}</div>}
            {product && <ProductDisplay product={product} />}
            <button onClick={() => setScanning(!scanning)}>
                {scanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>
        </div>
    );
};

export default ScannerView;