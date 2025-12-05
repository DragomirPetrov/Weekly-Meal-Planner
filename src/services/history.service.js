import { supabase } from './supabase';

/**
 * Meal History service for autocomplete
 * All history is shared between authenticated users
 */
export const historyService = {
  /**
   * Search meal history for autocomplete suggestions
   * @param {string} query - Search query (min 3 chars)
   * @returns {Promise<{data: Array<{meal_name: string, recipe_url: string|null}>|null, error: Error|null}>}
   */
  async searchHistory(query) {
    const trimmed = query?.trim();
    if (!trimmed || trimmed.length < 3) {
      return { data: [], error: null };
    }

    const sanitized = trimmed.replace(/[%_]/g, '');

    const { data, error } = await supabase
      .from('meal_history')
      .select('meal_name, recipe_url')
      .ilike('meal_name', `%${sanitized}%`)  // Case-insensitive match anywhere
      .order('last_used', { ascending: false })
      .limit(10);

    if (error) {
      return { data: null, error };
    }

    // Return array of objects with meal_name and recipe_url
    return {
      data: data.map(row => ({
        meal_name: row.meal_name,
        recipe_url: row.recipe_url
      })),
      error: null
    };
  },

  /**
   * Add or update meal in history
   * Uses database function for upsert logic
   * @param {string} mealName - Name of meal
   * @param {string|null} recipeUrl - Recipe URL (optional)
   * @returns {Promise<{error: Error|null}>}
   */
  async upsertMealHistory(mealName, recipeUrl = null) {
    const trimmed = mealName?.trim();
    if (!trimmed || trimmed.length === 0 || trimmed.length > 100) {
      return { error: new Error('Invalid meal name') };
    }

    // Validate recipe_url length if provided
    if (recipeUrl && recipeUrl.length > 2000) {
      return { error: new Error('Recipe URL too long (max 2000 characters)') };
    }

    const { error } = await supabase.rpc('upsert_meal_history', {
      meal_name_input: trimmed,
      recipe_url_input: recipeUrl || null,
    });

    return { error };
  },
};
