import { useState } from 'react';
import { useMealPlan } from '../../contexts/MealPlanContext';
import RecipeCard from './RecipeCard';
import Spinner from '../ui/Spinner';

/**
 * RecipeSuggestions Component
 * Displays 6 weekly recipe suggestions below the meal planning table
 *
 * Features:
 * - Shows 6 recipes (2 Italian, 2 Asian, 2 Bulgarian) from context
 * - Generates new suggestions for each week
 * - Same suggestions shared between both users
 * - Loading state synchronized with meal table
 * - Responsive grid layout (mobile: 1 col, tablet: 2 cols, desktop: 3 cols)
 */
export default function RecipeSuggestions() {
  const { meals, suggestions, loading, updateMeal } = useMealPlan();
  const [addError, setAddError] = useState(null);

  /**
   * Handle adding a recipe to the meal plan
   * Finds first empty slot and adds the recipe there
   * Shows error if all slots are full
   */
  const handleAddRecipe = async (recipe) => {
    // Clear any previous add error
    setAddError(null);

    // Find first empty meal slot
    const emptyMeal = meals.find(meal => !meal.meal_name || meal.meal_name.trim() === '');

    if (emptyMeal) {
      // Add recipe to first empty slot
      await updateMeal(emptyMeal.day_number, {
        meal_name: recipe.name,
        recipe_url: recipe.recipe_url
      });
    } else {
      // All slots are full - show error
      setAddError('It looks like everything for the week is planned and there is no free slot');
    }
  };

  // Loading state - don't show anything during loading to prevent flash
  if (loading) {
    return null;
  }

  // No suggestions state (shouldn't happen, but handle gracefully)
  if (suggestions.length === 0 && !loading) {
    return (
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Weekly Suggestions
          </h2>
        </div>
        <div className="text-center py-12">
          <p className="text-text-secondary">No recipe suggestions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[52px]">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          Weekly Suggestions
        </h2>
      </div>

      {/* Add Error Message */}
      {addError && (
        <div className="mb-4">
          <div className="bg-error-bg border border-error-border text-error-text px-4 py-3 rounded-lg flex items-start justify-between">
            <p className="text-sm">{addError}</p>
            <button
              onClick={() => setAddError(null)}
              className="text-error-text hover:text-error-text-hover ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Recipe Cards - Vertical List */}
      <div className="space-y-2.5">
        {suggestions.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onAdd={handleAddRecipe} />
        ))}
      </div>
    </div>
  );
}
