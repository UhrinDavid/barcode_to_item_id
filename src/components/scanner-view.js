import React, { useEffect, useState, useRef } from 'react';
import BarcodeScanner from '../scanner/barcode-scanner';
import { fetchProductDetails } from '../api/product-lookup';
import ProductDisplay from './product-display';

const ScannerView = () => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const scannerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Initialize scanner instance
        scannerRef.current = new BarcodeScanner();

        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stopScanning();
            }
        };
    }, []);

    const handleScan = async (barcode) => {
        setLoading(true);
        setError(null);

        try {
            const productDetails = await fetchProductDetails(barcode);
            setProduct(productDetails);
        } catch (err) {
            setError('Failed to fetch product details: ' + err.message);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const startScanning = async () => {
        if (!scannerRef.current) return;

        setError(null);
        setScanning(true);

        try {
            await scannerRef.current.startScanning(
                (barcode) => {
                    // Stop scanning after successful scan
                    stopScanning();
                    handleScan(barcode);
                },
                'scanner-container'
            );
        } catch (err) {
            setError('Failed to start camera: ' + err.message);
            setScanning(false);
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            await scannerRef.current.stopScanning();
        }
        setScanning(false);
    };

    // Alternative: Use Frappe's built-in dialog scanner
    const openFrappeScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.openScannerDialog((barcode) => {
                handleScan(barcode);
            });
        }
    };

    return (
        <div className="scanner-view">
            <div
                id="scanner-container"
                ref={containerRef}
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: scanning ? '400px' : '0',
                    margin: '20px auto',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    background: '#000'
                }}
            />

            {loading && <div className="loading-indicator">Searching...</div>}
            {error && <div className="error-message">{error}</div>}
            {product && <ProductDisplay product={product} />}

            <div className="scanner-controls" style={{ textAlign: 'center', margin: '20px 0' }}>
                {!scanning ? (
                    <>
                        <button
                            onClick={startScanning}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            📷 Start Camera Scanner
                        </button>
                        <button
                            onClick={openFrappeScanner}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            📱 Quick Scan Dialog
                        </button>
                    </>
                ) : (
                    <button
                        onClick={stopScanning}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        ⏹ Stop Scanner
                    </button>
                )}
            </div>
        </div>
    );
};

export default ScannerView;
