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
   */
  const fetchWeekMeals = useCallback(async (weekStart) => {
    try {
      setLoading(true);
      setError(null);

      const weekStartISO = formatISODate(weekStart);
      let weekMeals = await mealPlanService.getWeekMeals(weekStartISO);

      // If no meals exist for this week, create empty week
      if (weekMeals.length === 0) {
        await mealPlanService.createEmptyWeek(weekStartISO);
        weekMeals = await mealPlanService.getWeekMeals(weekStartISO);
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

  const value = {
    // State
    currentWeekStart,
    meals,
    loading,
    saving,
    error,

    // Methods
    updateMeal,
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
