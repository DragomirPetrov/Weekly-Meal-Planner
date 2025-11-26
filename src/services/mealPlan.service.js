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
    }));

    const { error } = await supabase
      .from('meal_plans')
      .insert(meals);

    return { error };
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
   * Swap two meals by swapping their day_number values
   * Uses 3-step process to avoid UNIQUE constraint violation
   * @param {Date} weekStartDate - Monday of the week
   * @param {number} day1 - First day number
   * @param {number} day2 - Second day number
   * @returns {Promise<{error: Error|null}>}
   */
  async swapMeals(weekStartDate, day1, day2) {
    const weekStr = formatISODate(weekStartDate);
    const tempDay = 100; // Temporary value outside 1-7 range

    try {
      // Step 1: day1 → temp
      await supabase
        .from('meal_plans')
        .update({ day_number: tempDay })
        .eq('week_start_date', weekStr)
        .eq('day_number', day1);

      // Step 2: day2 → day1
      await supabase
        .from('meal_plans')
        .update({ day_number: day1 })
        .eq('week_start_date', weekStr)
        .eq('day_number', day2);

      // Step 3: temp → day2
      await supabase
        .from('meal_plans')
        .update({ day_number: day2 })
        .eq('week_start_date', weekStr)
        .eq('day_number', tempDay);

      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};
