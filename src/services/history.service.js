import { supabase } from './supabase';

/**
 * Meal History service for autocomplete
 * All history is shared between authenticated users
 */
export const historyService = {
  /**
   * Search meal history for autocomplete suggestions
   * @param {string} query - Search query (min 3 chars)
   * @returns {Promise<{data: string[]|null, error: Error|null}>}
   */
  async searchHistory(query) {
    if (query.length < 3) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('meal_history')
      .select('meal_name')
      .ilike('meal_name', `%${query}%`)  // Case-insensitive match anywhere
      .order('last_used', { ascending: false })
      .limit(10);

    if (error) {
      return { data: null, error };
    }

    // Return array of meal names
    return { data: data.map(row => row.meal_name), error: null };
  },

  /**
   * Add or update meal in history
   * Uses database function for upsert logic
   * @param {string} mealName - Name of meal
   * @returns {Promise<{error: Error|null}>}
   */
  async upsertMealHistory(mealName) {
    const trimmed = mealName?.trim();
    if (!trimmed) {
      return { error: null };
    }

    const { error } = await supabase.rpc('upsert_meal_history', {
      meal_name_input: trimmed,
    });

    return { error };
  },
};
