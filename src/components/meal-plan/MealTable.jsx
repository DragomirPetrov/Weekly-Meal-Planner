import { useMealPlan } from '../../contexts/MealPlanContext';
import MealRow from './MealRow';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';

/**
 * MealTable Component
 * Displays 7 meal rows for the current week (Monday-Sunday)
 *
 * Features:
 * - Loading state during data fetch
 * - Error handling with retry
 * - 7 editable meal rows
 * - Auto-save functionality (handled by MealRow)
 */
export default function MealTable() {
  const { meals, loading, error, refreshMeals } = useMealPlan();

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="large" />
        <p className="text-neutral-400 text-sm">Loading meal plan...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onDismiss={refreshMeals}
        dismissText="Retry"
      />
    );
  }

  // No meals (shouldn't happen due to createEmptyWeek, but handle gracefully)
  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">No meal plan found.</p>
        <button
          onClick={refreshMeals}
          className="mt-4 text-red-600 hover:text-red-500 text-sm"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table Header (optional, for context) */}
      <div className="sr-only">
        <h3>Weekly Meal Plan</h3>
        <p>7 days, Monday through Sunday</p>
      </div>

      {/* Meal Rows */}
      {meals.map((meal) => (
        <MealRow key={meal.id} meal={meal} />
      ))}

      {/* Save indicator (optional, subtle feedback) */}
      <div className="text-xs text-neutral-600 text-center mt-4">
        Changes save automatically
      </div>
    </div>
  );
}
