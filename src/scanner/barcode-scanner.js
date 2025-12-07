/**
 * BarcodeScanner - Uses Frappe's built-in html5-qrcode scanner
 * This provides camera-based barcode scanning using the same library as ERPNext
 */
class BarcodeScanner {
    constructor() {
        this.scanner = null;
        this.scanning = false;
        this.containerId = 'barcode-scanner-container';
    }

    /**
     * Load the html5-qrcode library from Frappe's assets
     */
    async loadLibrary() {
        if (typeof Html5Qrcode !== 'undefined') {
            return Promise.resolve();
        }

        // Use Frappe's require if available, otherwise load directly
        if (typeof frappe !== 'undefined' && frappe.require) {
            return frappe.require("/assets/frappe/node_modules/html5-qrcode/html5-qrcode.min.js");
        }

        // Fallback: load script directly
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/assets/frappe/node_modules/html5-qrcode/html5-qrcode.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Start scanning with camera
     * @param {Function} callback - Called with scanned barcode text
     * @param {string} containerId - Optional custom container ID
     */
    async startScanning(callback, containerId = null) {
        if (this.scanning) {
            console.warn('Scanner is already running');
            return;
        }

        try {
            await this.loadLibrary();

            const targetId = containerId || this.containerId;

            // Ensure container exists
            let container = document.getElementById(targetId);
            if (!container) {
                container = document.createElement('div');
                container.id = targetId;
                document.body.appendChild(container);
            }

            this.scanner = new Html5Qrcode(targetId);
            this.scanning = true;

            await this.scanner.start(
                { facingMode: "environment" }, // Use back camera
                {
                    fps: 10,
                    qrbox: { width: 250, height: 150 },
                    aspectRatio: 1.5
                },
                (decodedText, decodedResult) => {
                    console.log('Barcode scanned:', decodedText);
                    if (callback) {
                        callback(decodedText, decodedResult);
                    }
                },
                (errorMessage) => {
                    // Ignore parse errors - they happen when no barcode is visible
                }
            );

            console.log('Scanner started successfully');

        } catch (error) {
            console.error('Error starting scanner:', error);
            this.scanning = false;
            throw error;
        }
    }

    /**
     * Stop the scanner and release camera
     */
    async stopScanning() {
        if (!this.scanning || !this.scanner) {
            return;
        }

        try {
            await this.scanner.stop();
            this.scanning = false;
            console.log('Scanner stopped');
        } catch (error) {
            console.error('Error stopping scanner:', error);
        }
    }

    /**
     * Check if scanner is currently active
     */
    isScanning() {
        return this.scanning;
    }

    /**
     * Open Frappe's built-in scanner dialog (if in Frappe environment)
     * This is the easiest way to use barcode scanning in Frappe apps
     * @param {Function} callback - Called with scan result
     */
    openScannerDialog(callback) {
        if (typeof frappe === 'undefined' || !frappe.ui || !frappe.ui.Scanner) {
            console.error('Frappe Scanner not available. Use startScanning() instead.');
            return;
        }

        new frappe.ui.Scanner({
            dialog: true,
            multiple: false,
            on_scan: (data) => {
                if (data && data.result && data.result.text) {
                    callback(data.result.text);
                }
            }
        });
    }
}

export default BarcodeScanner;
