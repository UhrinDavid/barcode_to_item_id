/**
 * CameraHandler - Manages camera access for barcode scanning
 * Note: When using BarcodeScanner with html5-qrcode, camera management
 * is handled automatically. This class is kept for backward compatibility
 * and manual camera control if needed.
 */
class CameraHandler {
    constructor() {
        this.videoElement = null;
        this.stream = null;
    }

    /**
     * Initialize camera and attach to video element
     * @param {HTMLVideoElement} videoElement - Optional video element to attach stream
     */
    async initializeCamera(videoElement = null) {
        this.videoElement = videoElement;

        try {
            // Request camera with preference for back camera
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment", // Prefer back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                await this.videoElement.play();
            }

            console.log('Camera initialized successfully');
            return this.stream;

        } catch (error) {
            console.error("Error accessing the camera:", error);
            throw error;
        }
    }

    /**
     * Release camera and stop all tracks
     */
    releaseCamera() {
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => {
                track.stop();
                console.log('Camera track stopped:', track.kind);
            });
            this.stream = null;
        }

        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }

        console.log('Camera released');
    }

    /**
     * Check if camera is currently active
     */
    isActive() {
        return this.stream !== null && this.stream.active;
    }

    /**
     * Get available cameras
     */
    async getAvailableCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === 'videoinput');
        } catch (error) {
            console.error('Error enumerating devices:', error);
            return [];
        }
    }

    /**
     * Switch to a different camera
     * @param {string} deviceId - The device ID of the camera to switch to
     */
    async switchCamera(deviceId) {
        this.releaseCamera();

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: deviceId },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                await this.videoElement.play();
            }

            return this.stream;
        } catch (error) {
            console.error('Error switching camera:', error);
            throw error;
        }
    }
}

export default CameraHandler;
