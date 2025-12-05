class CameraHandler {
    constructor() {
        this.videoElement = null;
        this.stream = null;
    }

    async initializeCamera(videoElement) {
        this.videoElement = videoElement;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoElement.srcObject = this.stream;
            await this.videoElement.play();
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    }

    releaseCamera() {
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }
}

export default CameraHandler;