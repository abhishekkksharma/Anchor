/**
 * Cloudinary Image Upload Utility
 * Handles uploading images to Cloudinary and returns the URLs
 */

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

/**
 * Upload a single image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file, folderName = 'social_media_posts') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folderName); // Optional: organize uploads in folders

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files to upload
 * @param {Function} onProgress - Optional callback for upload progress (current, total)
 * @returns {Promise<string[]>} - Array of secure URLs of uploaded images
 */
export const uploadMultipleImagesToCloudinary = async (files, onProgress) => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadImageToCloudinary(file).then((url) => {
        if (onProgress) {
          onProgress(index + 1, files.length);
        }
        return url;
      })
    );

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Validate image file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

/**
 * Upload images with validation
 * @param {File[]} files - Array of image files
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} - { urls: string[], errors: Object[] }
 */
export const uploadImagesWithValidation = async (files, onProgress) => {
  const validFiles = [];
  const errors = [];

  // Validate all files first
  files.forEach((file, index) => {
    const validation = validateImageFile(file);
    if (validation.valid) {
      validFiles.push(file);
    } else {
      errors.push({
        file: file.name,
        error: validation.error,
        index,
      });
    }
  });

  if (validFiles.length === 0) {
    throw new Error('No valid files to upload');
  }

  try {
    const urls = await uploadMultipleImagesToCloudinary(
      validFiles,
      onProgress
    );
    return { urls, errors };
  } catch (error) {
    throw error;
  }
};

export default {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  validateImageFile,
  uploadImagesWithValidation,
};