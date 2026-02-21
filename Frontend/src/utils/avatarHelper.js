import { Avatar1, Avatar2, Avatar3, Avatar4, Avatar5 } from '../assets/Avatars/index';

const localAvatarMap = {
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
};

/**
 * Resolves an avatar string to a valid image source URL.
 * It checks if the string is a direct URL (like Cloudinary) or a reference to a local asset.
 *
 * @param {string} avatarString - The avatar value from the user object (e.g., "http...", "Avatar1", null)
 * @returns {string|null} - The resolved image URL, or null if invalid
 */
export const resolveAvatar = (avatarString) => {
    if (!avatarString) return null;

    // If it's a full URL (Cloudinary, external, etc), return it directly
    if (avatarString.startsWith('http://') || avatarString.startsWith('https://')) {
        return avatarString;
    }

    // Otherwise, assume it's a local avatar key (e.g., "Avatar1")
    return localAvatarMap[avatarString] || null;
};
