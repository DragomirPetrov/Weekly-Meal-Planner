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
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Weekly Suggestions
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="large" />
          <p className="text-text-secondary text-sm">Loading recipe suggestions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
          <button
            onClick={fetchSuggestions}
            className="mt-4 text-primary hover:text-primary-hover text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          Weekly Suggestions
        </h2>
      </div>

      {/* Recipe Cards - Vertical List */}
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
