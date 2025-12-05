import { supabase } from './supabase';
import { formatISODate } from '../utils/dateUtils';

/**
 * Meal Plan service for CRUD operations
 * All data is shared between authenticated users
 */
export const mealPlanService = {
  /**
   * Get all meals for a specific week
   * @param {Date} weekStartDate - Monday of the week
   * @returns {Promise<{data: MealPlan[]|null, error: Error|null}>}
   */
  async getWeekMeals(weekStartDate) {
    const weekStr = formatISODate(weekStartDate);

    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('week_start_date', weekStr)
      .order('day_number', { ascending: true });

    return { data: data || [], error };
  },

  /**
   * Create empty meal plan for a week (7 days)
   * @param {Date} weekStartDate - Monday of the week
   * @returns {Promise<{error: Error|null}>}
   */
  async createEmptyWeek(weekStartDate) {
    const weekStr = formatISODate(weekStartDate);

    // Create 7 empty meal entries (Monday-Sunday)
    const meals = Array.from({ length: 7 }, (_, i) => ({
      week_start_date: weekStr,
      day_number: i + 1,
      meal_name: null,
      is_cooked: false,
      recipe_url: null,
    }));

    const { error } = await supabase
      .from('meal_plans')
      .insert(meals);

    return { error };
  },

  /**
   * Restore missing meal rows for a week
   * Checks which day_numbers are missing (1-7) and creates them
   * @param {Date} weekStartDate - Monday of the week
   * @returns {Promise<{error: Error|null}>}
   */
  async restoreMissingRows(weekStartDate) {
    const weekStr = formatISODate(weekStartDate);

    try {
      // Get existing meals
      const { data: existingMeals, error: fetchError } = await supabase
        .from('meal_plans')
        .select('day_number')
        .eq('week_start_date', weekStr);

      if (fetchError) {
        throw fetchError;
      }

      const existingDays = existingMeals.map(m => m.day_number);
      const missingDays = [1, 2, 3, 4, 5, 6, 7].filter(day => !existingDays.includes(day));

      if (missingDays.length === 0) {
        return { error: null }; // Nothing to restore
      }

      // Create missing rows
      const missingMeals = missingDays.map(day => ({
        week_start_date: weekStr,
        day_number: day,
        meal_name: null,
        is_cooked: false,
        recipe_url: null,
      }));

      const { error: insertError } = await supabase
        .from('meal_plans')
        .insert(missingMeals);

      if (insertError) {
        throw insertError;
      }

      return { error: null };
    } catch (error) {
      console.error('Error restoring missing rows:', error);
      return { error };
    }
  },

  /**
   * Update a meal entry
   * @param {Date} weekStartDate - Monday of the week
   * @param {number} dayNumber - 1-7 (Monday-Sunday)
   * @param {Object} updates - Fields to update (meal_name, is_cooked)
   * @returns {Promise<{error: Error|null}>}
   */
  async updateMeal(weekStartDate, dayNumber, updates) {
    const weekStr = formatISODate(weekStartDate);

    // Sanitize meal_name if provided
    const sanitized = { ...updates };
    if (sanitized.meal_name !== undefined) {
      sanitized.meal_name = sanitized.meal_name?.trim() || null;
    }

    const { error } = await supabase
      .from('meal_plans')
      .update(sanitized)
      .eq('week_start_date', weekStr)
      .eq('day_number', dayNumber);

    return { error };
  },

  /**
   * Swap two meals by swapping their content (not day_number)
   * Updates meal_name and is_cooked between two days
   * This avoids UNIQUE constraint and CHECK constraint violations
   * @param {Date} weekStartDate - Monday of the week
   * @param {number} day1 - First day number
   * @param {number} day2 - Second day number
   * @returns {Promise<{error: Error|null}>}
   */
  async swapMeals(weekStartDate, day1, day2) {
    const weekStr = formatISODate(weekStartDate);

    try {
      // Step 1: Fetch both meal records
      const { data: meals, error: fetchError } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('week_start_date', weekStr)
        .in('day_number', [day1, day2]);

      if (fetchError) {
        console.error('Error fetching meals for swap:', fetchError);
        throw fetchError;
      }

      if (!meals || meals.length !== 2) {
        throw new Error('Could not find both meals to swap');
      }

      const meal1 = meals.find(m => m.day_number === day1);
      const meal2 = meals.find(m => m.day_number === day2);

      // Step 2: Swap content of day1 with content of day2
      // Update day1 with day2's content
      const { error: error1 } = await supabase
        .from('meal_plans')
        .update({
          meal_name: meal2.meal_name,
          is_cooked: meal2.is_cooked,
          recipe_url: meal2.recipe_url,
        })
        .eq('week_start_date', weekStr)
        .eq('day_number', day1);

      if (error1) {
        console.error('Error updating meal 1:', error1);
        throw error1;
      }

      // Step 3: Update day2 with day1's content
      const { error: error2 } = await supabase
        .from('meal_plans')
        .update({
          meal_name: meal1.meal_name,
          is_cooked: meal1.is_cooked,
          recipe_url: meal1.recipe_url,
        })
        .eq('week_start_date', weekStr)
        .eq('day_number', day2);

      if (error2) {
        console.error('Error updating meal 2:', error2);
        throw error2;
      }

      return { error: null };
    } catch (error) {
      console.error('Swap meals failed:', error);
      return { error };
    }
  },
};
