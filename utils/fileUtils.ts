
export const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        // Pre-emptively check for supported MIME types.
        const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!supportedTypes.includes(file.type)) {
            return reject(new Error(
                `Unsupported file type for '${file.name}'. Please upload a JPG, PNG, or WEBP image.`
            ));
        }

        const imageUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                URL.revokeObjectURL(imageUrl);
                return reject(new Error('Failed to get canvas context for image processing.'));
            }

            ctx.drawImage(img, 0, 0);

            const dataUrl = canvas.toDataURL(file.type, 0.95);
            URL.revokeObjectURL(imageUrl);

            const base64Data = dataUrl.split(',')[1];
            const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));

            if (!base64Data || !mimeType) {
                return reject(new Error(`Failed to process the file '${file.name}'. The resulting data was invalid.`));
            }

            resolve({ base64Data, mimeType });
        };

        img.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            
            // The browser's onerror event for images is generic and doesn't specify the cause.
            // We can enhance the message based on the user's environment.
            const isAndroid = /android/i.test(navigator.userAgent);
            let errorMessage = `Failed to load the image file '${file.name}'. It may be corrupted or in an unsupported format.`;
            
            if (isAndroid) {
                errorMessage += "\n\nOn Android, this can happen if the file is from a cloud service (like Google Photos) or a secure folder. Please try saving the image to your device's local 'Downloads' or 'Pictures' folder and select it from there.";
            }

            reject(new Error(errorMessage));
        };

        img.src = imageUrl;
    });
};
