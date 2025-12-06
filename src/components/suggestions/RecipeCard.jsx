/**
 * RecipeCard Component
 * Displays a single recipe suggestion with cuisine badge and action buttons
 *
 * Features:
 * - Cuisine type badge with unified styling
 * - Add to meal plan button
 * - Recipe link button (opens in new tab)
 * - Compact layout matching MealRow design
 * - Smooth hover animations
 *
 * @param {Object} props
 * @param {Object} props.recipe - Recipe object from database
 * @param {string} props.recipe.name - Recipe name
 * @param {string} props.recipe.cuisine_type - 'italian' | 'asian' | 'bulgarian'
 * @param {string} props.recipe.recipe_url - External recipe URL
 * @param {Function} props.onAdd - Callback function when add button is clicked
 */
export default function RecipeCard({ recipe, onAdd }) {
  /**
   * Capitalize cuisine name for display
   * @returns {string} Capitalized cuisine name
   */
  const getCuisineName = () => {
    return recipe.cuisine_type.charAt(0).toUpperCase() + recipe.cuisine_type.slice(1);
  };

  return (
    <div className="bg-bg-card rounded-lg border border-border pl-3.5 pr-4 py-3.5 transition-all duration-300 ease-out hover:border-border-secondary hover:bg-bg-hover/70 shadow-card hover:shadow-card-hover">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Recipe Name and Cuisine Badge */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h3 className="text-base font-normal text-text-primary">
            {recipe.name}
          </h3>
          {/* Cuisine Badge */}
          <span className="px-2.5 py-1 text-xs font-medium rounded bg-bg-elevated text-white w-fit">
            {getCuisineName()}
          </span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Add Button */}
          <button
            onClick={() => onAdd && onAdd(recipe)}
            className="p-2 rounded hover:bg-bg-elevated transition-colors"
            aria-label="Add to meal plan"
            title="Add to meal plan"
          >
            <svg className="w-5 h-5 text-text-tertiary hover:text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* View Recipe Button */}
          <a
            href={recipe.recipe_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded hover:bg-bg-elevated transition-colors"
            aria-label="View recipe"
            title="View recipe"
          >
            <svg className="w-5 h-5 text-primary hover:text-primary-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
