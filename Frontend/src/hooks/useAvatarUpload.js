import { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

/**
 * A custom hook for uploading avatar images to Cloudinary.
 * Used across the application anywhere to allow users to update their profile picture.
 * @returns {Object} { uploadAvatar, isUploading, error }
 */
const useAvatarUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Uploads the given file to the 'profile_images' folder in Cloudinary
     * @param {File} file - The image file to upload
     * @returns {Promise<string>} - The secure URL of the uploaded image
     */
    const uploadAvatar = async (file) => {
        setIsUploading(true);
        setError(null);
        try {
            // Pass 'profile_images' specifically as the target folder
            const url = await uploadImageToCloudinary(file, 'profile_images');
            setIsUploading(false);
            return url;
        } catch (err) {
            setError(err.message || 'Failed to upload avatar');
            setIsUploading(false);
            throw err;
        }
    };

    return { uploadAvatar, isUploading, error };
};

export default useAvatarUpload;
