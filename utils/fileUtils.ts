
export const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        // The canvas method is more robust than FileReader on mobile devices,
        // especially on Android where files are accessed via content URIs which
        // can cause issues with direct reading.
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

            // Get the data URL from the canvas. Using file.type preserves the original format.
            // A quality parameter of 0.95 is used for JPEG/WEBP formats.
            const dataUrl = canvas.toDataURL(file.type, 0.95);

            // Clean up the temporary object URL.
            URL.revokeObjectURL(imageUrl);

            const base64Data = dataUrl.split(',')[1];
            const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));

            if (!base64Data || !mimeType) {
                return reject(new Error(`Failed to process the file '${file.name}'. The resulting data was invalid.`));
            }

            resolve({ base64Data, mimeType });
        };

        img.onerror = () => {
            // This error triggers if the file selected cannot be loaded as an image.
            URL.revokeObjectURL(imageUrl);
            reject(new Error(`Failed to load the image file '${file.name}'. It may be corrupted or an unsupported format.`));
        };

        img.src = imageUrl;
    });
};
