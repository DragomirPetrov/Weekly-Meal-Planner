import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mealPlanService } from '../services/mealPlan.service';
import { historyService } from '../services/history.service';
import { getCurrentMonday, addWeeks, formatISODate } from '../utils/dateUtils';

const MealPlanContext = createContext(null);

/**
 * MealPlanContext Provider
 * Manages weekly meal plan state and provides CRUD methods
 */
export function MealPlanProvider({ children }) {
  // Current week's Monday date
  const [currentWeekStart, setCurrentWeekStart] = useState(getCurrentMonday());

  // Array of 7 meals for current week
  const [meals, setMeals] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  /**
   * Fetch meals for the current week
   * Creates empty week if it doesn't exist
   * Restores missing rows if some are deleted
   */
  const fetchWeekMeals = useCallback(async (weekStart) => {
    try {
      setLoading(true);
      setError(null);

      const weekStartISO = formatISODate(weekStart);
      let { data: weekMeals, error: fetchError } = await mealPlanService.getWeekMeals(weekStartISO);

      if (fetchError) {
        throw fetchError;
      }

      // If no meals exist for this week, create empty week
      if (!weekMeals || weekMeals.length === 0) {
        const { error: createError } = await mealPlanService.createEmptyWeek(weekStartISO);
        if (createError) {
          throw createError;
        }

        const { data: newWeekMeals, error: refetchError } = await mealPlanService.getWeekMeals(weekStartISO);
        if (refetchError) {
          throw refetchError;
        }
        weekMeals = newWeekMeals;
      }
      // If some meals exist but not all 7, restore missing rows
      else if (weekMeals.length < 7) {
        console.warn(`Only ${weekMeals.length} meals found, restoring missing rows...`);
        const { error: restoreError } = await mealPlanService.restoreMissingRows(weekStartISO);
        if (restoreError) {
          console.error('Error restoring missing rows:', restoreError);
        } else {
          // Refetch to get the complete week
          const { data: restoredMeals, error: refetchError } = await mealPlanService.getWeekMeals(weekStartISO);
          if (!refetchError) {
            weekMeals = restoredMeals;
          }
        }
      }

      // Sort by day_number to ensure correct order (1-7)
      weekMeals.sort((a, b) => a.day_number - b.day_number);

      setMeals(weekMeals);
    } catch (err) {
      console.error('Error fetching week meals:', err);
      setError('Failed to load meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load meals when currentWeekStart changes
   */
  useEffect(() => {
    fetchWeekMeals(currentWeekStart);
  }, [currentWeekStart, fetchWeekMeals]);

  /**
   * Update a meal's name or cooked status
   * Optimistically updates UI, then syncs with backend
   *
   * @param {number} dayNumber - Day number (1-7)
   * @param {Object} updates - Fields to update (meal_name, is_cooked)
   */
  const updateMeal = async (dayNumber, updates) => {
    try {
      setSaving(true);

      // Optimistic update: Update UI immediately
      setMeals(prevMeals =>
        prevMeals.map(meal =>
          meal.day_number === dayNumber
            ? { ...meal, ...updates }
            : meal
        )
      );

      // Update database
      const weekStartISO = formatISODate(currentWeekStart);
      await mealPlanService.updateMeal(weekStartISO, dayNumber, updates);

      // If meal name was updated, add to history for autocomplete
      if (updates.meal_name && updates.meal_name.trim()) {
        await historyService.upsertMealHistory(updates.meal_name.trim());
      }

    } catch (err) {
      console.error('Error updating meal:', err);
      setError('Failed to save meal. Please try again.');

      // Revert optimistic update by refetching
      fetchWeekMeals(currentWeekStart);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Navigate to previous week
   */
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prevWeek => addWeeks(prevWeek, -1));
  };

  /**
   * Navigate to next week
   */
  const goToNextWeek = () => {
    setCurrentWeekStart(prevWeek => addWeeks(prevWeek, 1));
  };

  /**
   * Jump to current week (today)
   */
  const goToToday = () => {
    setCurrentWeekStart(getCurrentMonday());
  };

  /**
   * Check if currently viewing the current week
   * @returns {boolean}
   */
  const isCurrentWeek = () => {
    const today = getCurrentMonday();
    return formatISODate(currentWeekStart) === formatISODate(today);
  };

  /**
   * Swap two meals by swapping their content (meal_name and is_cooked)
   * day_number stays the same, only the content moves
   * is_cooked state moves with the meal content
   *
   * Example: Drag day 1 to day 3's position
   * - Before: [day1: "Pizza", day2: "Pasta", day3: "Salad"]
   * - After:  [day1: "Salad", day2: "Pasta", day3: "Pizza"]
   * - The content swaps, day_numbers stay in their positions
   *
   * @param {number} day1 - First day number (1-7)
   * @param {number} day2 - Second day number (1-7)
   */
  const swapMeals = async (day1, day2) => {
    if (day1 === day2) return; // No swap needed

    try {
      setSaving(true);

      // Capture the current content before swap for optimistic update
      const meal1Content = meals.find(m => m.day_number === day1);
      const meal2Content = meals.find(m => m.day_number === day2);

      if (!meal1Content || !meal2Content) return;

      // Optimistic update: Swap the content between the two days
      setMeals(prevMeals =>
        prevMeals.map(meal => {
          if (meal.day_number === day1) {
            // Day 1 gets day 2's content
            return {
              ...meal,
              meal_name: meal2Content.meal_name,
              is_cooked: meal2Content.is_cooked,
            };
          }
          if (meal.day_number === day2) {
            // Day 2 gets day 1's content
            return {
              ...meal,
              meal_name: meal1Content.meal_name,
              is_cooked: meal1Content.is_cooked,
            };
          }
          return meal;
        })
      );

      // Update database (swaps content, not day_number)
      const weekStartISO = formatISODate(currentWeekStart);
      const { error: swapError } = await mealPlanService.swapMeals(weekStartISO, day1, day2);

      if (swapError) {
        throw swapError;
      }

    } catch (err) {
      console.error('Error swapping meals:', err);
      setError('Failed to reorder meals. Please try again.');

      // Revert optimistic update by refetching
      fetchWeekMeals(currentWeekStart);
    } finally {
      setSaving(false);
    }
  };

  const value = {
    // State
    currentWeekStart,
    meals,
    loading,
    saving,
    error,

    // Methods
    updateMeal,
    swapMeals,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    isCurrentWeek,
    refreshMeals: () => fetchWeekMeals(currentWeekStart),
  };

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
}

/**
 * Hook to use meal plan context
 * @returns {Object} Meal plan context value
 */
export function useMealPlan() {
  const context = useContext(MealPlanContext);

  if (!context) {
    throw new Error('useMealPlan must be used within MealPlanProvider');
  }

  return context;
}
