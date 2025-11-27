/**
 * RecipeCard Component
 * Displays a single recipe suggestion with cuisine badge, rating, and link
 *
 * Features:
 * - Cuisine type badge with color coding
 * - Star rating display (4.2-5.0)
 * - Recipe link button (opens in new tab)
 * - Mobile-friendly card layout
 * - Smooth hover animations
 *
 * @param {Object} props
 * @param {Object} props.recipe - Recipe object from database
 * @param {string} props.recipe.name - Recipe name
 * @param {string} props.recipe.cuisine_type - 'italian' | 'asian' | 'bulgarian'
 * @param {number} props.recipe.rating - Rating from 4.0 to 5.0
 * @param {string} props.recipe.recipe_url - External recipe URL
 */
export default function RecipeCard({ recipe }) {
  /**
   * Get cuisine badge color based on type
   * @returns {string} Tailwind CSS classes for badge
   */
  const getCuisineBadgeClass = () => {
    switch (recipe.cuisine_type) {
      case 'italian':
        return 'bg-cuisine-italian/20 text-cuisine-italian border-cuisine-italian/30';
      case 'asian':
        return 'bg-cuisine-asian/20 text-cuisine-asian border-cuisine-asian/30';
      case 'bulgarian':
        return 'bg-cuisine-bulgarian/20 text-cuisine-bulgarian border-cuisine-bulgarian/30';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  /**
   * Capitalize cuisine name for display
   * @returns {string} Capitalized cuisine name
   */
  const getCuisineName = () => {
    return recipe.cuisine_type.charAt(0).toUpperCase() + recipe.cuisine_type.slice(1);
  };

  /**
   * Render star rating (filled and empty stars)
   * @returns {JSX.Element[]} Array of star icons
   */
  const renderStars = () => {
    const fullStars = Math.floor(recipe.rating);
    const hasHalfStar = recipe.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-4 h-4 text-cuisine-asian"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <svg
            key="half"
            className="w-4 h-4 text-cuisine-asian"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`half-star-${recipe.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-star-${recipe.id})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-4 h-4 text-neutral-700"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {/* Rating text */}
        <span className="ml-1.5 text-sm text-neutral-400">{recipe.rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 transition-all duration-300 ease-out hover:border-neutral-700 hover:shadow-lg flex flex-col gap-3">
      {/* Recipe Name */}
      <h3 className="text-base font-semibold text-neutral-100 line-clamp-2 min-h-[3rem]">
        {recipe.name}
      </h3>

      {/* Cuisine Badge & Rating Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Cuisine Badge */}
        <span
          className={`
            px-2.5 py-1 text-xs font-medium rounded border
            ${getCuisineBadgeClass()}
          `}
        >
          {getCuisineName()}
        </span>

        {/* Star Rating */}
        {renderStars()}
      </div>

      {/* View Recipe Button */}
      <a
        href={recipe.recipe_url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-2 w-full px-4 py-2 rounded
          bg-primary text-white text-sm font-medium
          hover:bg-primary-hover active:bg-primary-active
          transition-all duration-300 ease-out
          flex items-center justify-center gap-2
        "
      >
        View Recipe
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
