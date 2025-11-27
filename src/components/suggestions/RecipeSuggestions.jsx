import { useState, useEffect } from 'react';
import { suggestionsService } from '../../services/suggestions.service';
import RecipeCard from './RecipeCard';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';

/**
 * RecipeSuggestions Component
 * Displays 6 weekly recipe suggestions below the meal planning table
 *
 * Features:
 * - Fetches 6 recipes (2 Italian, 2 Asian, 2 Bulgarian)
 * - Generates new suggestions for each week
 * - Same suggestions shared between both users
 * - Loading state with spinner
 * - Error handling with retry
 * - Responsive grid layout (mobile: 1 col, tablet: 2 cols, desktop: 3 cols)
 *
 * @param {Object} props
 * @param {Date} props.currentWeekStart - Monday of the current week
 */
export default function RecipeSuggestions({ currentWeekStart }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch weekly recipe suggestions whenever the week changes
   */
  useEffect(() => {
    fetchSuggestions();
  }, [currentWeekStart]);

  /**
   * Fetch recipe suggestions for the current week
   */
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await suggestionsService.getWeeklySuggestions(currentWeekStart);

      if (fetchError) {
        throw fetchError;
      }

      setRecipes(data || []);
    } catch (err) {
      console.error('Error fetching recipe suggestions:', err);
      setError('Failed to load recipe suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="mt-12 bg-neutral-900 rounded-lg border border-neutral-800 p-8">
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">
          Weekly Recipe Suggestions
        </h2>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="large" />
          <p className="text-neutral-400 text-sm">Loading recipe suggestions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-12 bg-neutral-900 rounded-lg border border-neutral-800 p-8">
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">
          Weekly Recipe Suggestions
        </h2>
        <ErrorMessage
          message={error}
          onDismiss={fetchSuggestions}
          dismissText="Retry"
        />
      </div>
    );
  }

  // No recipes state (shouldn't happen, but handle gracefully)
  if (recipes.length === 0) {
    return (
      <div className="mt-12 bg-neutral-900 rounded-lg border border-neutral-800 p-8">
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">
          Weekly Recipe Suggestions
        </h2>
        <div className="text-center py-12">
          <p className="text-neutral-400">No recipe suggestions available.</p>
          <button
            onClick={fetchSuggestions}
            className="mt-4 text-red-600 hover:text-red-500 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-neutral-900 rounded-lg border border-neutral-800 p-6 sm:p-8">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">
          Weekly Recipe Suggestions
        </h2>
        <p className="text-sm text-neutral-400">
          Discover new pescatarian recipes for this week
        </p>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Helpful Info */}
      <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
        <p className="text-xs text-neutral-600">
          New suggestions generated weekly " Click any recipe to view full details
        </p>
      </div>
    </div>
  );
}
