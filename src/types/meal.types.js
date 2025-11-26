/**
 * Meal Plan entry type
 * @typedef {Object} MealPlan
 * @property {string} id - UUID
 * @property {string} week_start_date - ISO date string (Monday)
 * @property {number} day_number - 1-7 (Monday-Sunday)
 * @property {string|null} meal_name - Name of meal (max 100 chars)
 * @property {boolean} is_cooked - Completion status
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * Meal History entry type (for autocomplete)
 * @typedef {Object} MealHistory
 * @property {string} id - UUID
 * @property {string} meal_name - Name of meal (unique)
 * @property {number} usage_count - Number of times used
 * @property {string} last_used - Last usage timestamp
 * @property {string} created_at - Creation timestamp
 */

export const MealTypes = {};
