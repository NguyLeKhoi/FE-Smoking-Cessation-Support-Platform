/**
 * Generates a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} The generated slug
 */
export const generateSlug = (text) => {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/&/g, '-and-')       // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')     // Remove all non-word characters
        .replace(/\-\-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+/, '')           // Trim hyphens from start
        .replace(/-+$/, '');          // Trim hyphens from end
};

/**
 * Ensures a slug is unique among existing slugs
 * @param {string} baseSlug - The initial slug
 * @param {Array} existingSlugs - Array of existing slugs
 * @returns {string} A unique slug
 */
export const ensureUniqueSlug = (baseSlug, existingSlugs) => {
    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};