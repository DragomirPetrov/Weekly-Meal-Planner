import { useEffect, useRef } from 'react';

/**
 * MealAutocomplete Component
 * Dropdown list of autocomplete suggestions for meal names
 *
 * Features:
 * - Dark theme with red accents (per PRD color palette)
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Touch-friendly tap targets (44px height per PRD)
 * - Smooth fade-in animation (200ms per PRD)
 * - Click outside to dismiss
 * - Shows link icon for meals with recipe URLs
 *
 * @param {Object} props
 * @param {Array<{meal_name: string, recipe_url: string|null}>} props.suggestions - Array of meal suggestions with URLs
 * @param {number} props.selectedIndex - Currently highlighted suggestion index
 * @param {Function} props.onSelect - Callback when suggestion is selected
 * @param {Function} props.onClose - Callback to close dropdown
 * @param {Object} props.inputRef - Ref to the input element (for positioning)
 */
export default function MealAutocomplete({
  suggestions,
  selectedIndex,
  onSelect,
  onClose,
  inputRef,
}) {
  const dropdownRef = useRef(null);

  /**
   * Handle click outside dropdown to close
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose, inputRef]);

  /**
   * Scroll selected item into view when selectedIndex changes
   */
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  // Don't render if no suggestions
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="
        absolute top-full left-0 right-0 mt-1 z-50
        bg-bg-elevated border border-border-secondary
        rounded-lg shadow-lg overflow-hidden
        animate-fade-in max-h-[280px] overflow-y-auto
      "
      role="listbox"
      aria-label="Meal suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent blur event from firing
            onSelect(suggestion);
          }}
          className={`
            w-full px-4 py-3 text-left text-base
            transition-colors cursor-pointer
            min-h-[44px] flex items-center justify-between
            ${
              index === selectedIndex
                ? 'bg-primary text-white'
                : 'text-text-primary hover:bg-bg-elevated/70'
            }
            ${index !== suggestions.length - 1 ? 'border-b border-border' : ''}
          `}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <span>{suggestion.meal_name}</span>

          {/* Show link icon if recipe URL exists */}
          {suggestion.recipe_url && (
            <svg
              className="w-4 h-4 text-text-tertiary flex-shrink-0 ml-2"
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
          )}
        </button>
      ))}
    </div>
  );
}
