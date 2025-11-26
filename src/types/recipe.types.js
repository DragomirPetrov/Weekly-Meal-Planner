/**
 * Recipe type
 * @typedef {Object} Recipe
 * @property {string} id - UUID
 * @property {string} name - Recipe name
 * @property {string} cuisine_type - 'italian' | 'asian' | 'bulgarian'
 * @property {number} rating - 4.0-5.0
 * @property {string} recipe_url - External link to recipe
 * @property {string} created_at - Creation timestamp
 */

/**
 * Weekly Suggestions type
 * @typedef {Object} WeeklySuggestions
 * @property {string} id - UUID
 * @property {string} week_start_date - ISO date string (Monday)
 * @property {string[]} recipe_ids - Array of 6 recipe UUIDs
 * @property {string} created_at - Creation timestamp
 */

export const RecipeTypes = {};
