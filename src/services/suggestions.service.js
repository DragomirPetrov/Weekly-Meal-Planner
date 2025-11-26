import { supabase } from './supabase';
import { formatISODate } from '../utils/dateUtils';
import { CUISINE_TYPES, SUGGESTIONS_PER_CUISINE } from '../utils/constants';

/**
 * Recipe Suggestions service
 * All suggestions are shared between authenticated users
 */
export const suggestionsService = {
  /**
   * Get weekly recipe suggestions (6 recipes: 2 Italian, 2 Asian, 2 Bulgarian)
   * @param {Date} weekStartDate - Monday of the week
   * @returns {Promise<{data: Recipe[]|null, error: Error|null}>}
   */
  async getWeeklySuggestions(weekStartDate) {
    const weekStr = formatISODate(weekStartDate);

    // Check if suggestions exist for this week
    const { data: existingSuggestions, error: fetchError } = await supabase
      .from('weekly_suggestions')
      .select('recipe_ids')
      .eq('week_start_date', weekStr)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error other than "not found"
      return { data: null, error: fetchError };
    }

    if (existingSuggestions) {
      // Fetch recipes by IDs
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', existingSuggestions.recipe_ids);

      return { data: recipes, error: recipesError };
    }

    // Generate new suggestions
    return await this.generateWeeklySuggestions(weekStartDate);
  },

  /**
   * Generate new weekly suggestions
   * @param {Date} weekStartDate - Monday of the week
   * @returns {Promise<{data: Recipe[]|null, error: Error|null}>}
   */
  async generateWeeklySuggestions(weekStartDate) {
    const weekStr = formatISODate(weekStartDate);
    const cuisineTypes = [CUISINE_TYPES.ITALIAN, CUISINE_TYPES.ASIAN, CUISINE_TYPES.BULGARIAN];
    const selectedRecipes = [];

    try {
      // For each cuisine type, select 2 random recipes
      for (const cuisineType of cuisineTypes) {
        const { data: pool, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('cuisine_type', cuisineType)
          .gte('rating', 4.2)
          .limit(50);  // Get top 50 to randomize from

        if (error) throw error;
        if (!pool || pool.length < SUGGESTIONS_PER_CUISINE) {
          throw new Error(`Not enough ${cuisineType} recipes in database`);
        }

        // Shuffle and pick 2
        const shuffled = pool.sort(() => Math.random() - 0.5);
        selectedRecipes.push(shuffled[0], shuffled[1]);
      }

      // Store in weekly_suggestions table
      const recipeIds = selectedRecipes.map(r => r.id);
      const { error: insertError } = await supabase
        .from('weekly_suggestions')
        .insert({
          week_start_date: weekStr,
          recipe_ids: recipeIds,
        });

      if (insertError) throw insertError;

      return { data: selectedRecipes, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
