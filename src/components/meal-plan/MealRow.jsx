import { useState, useEffect, useRef, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { historyService } from '../../services/history.service';
import { DAYS_OF_WEEK } from '../../utils/constants';
import MealAutocomplete from './MealAutocomplete';
import AutocompletePortal from './AutocompletePortal';
import RecipeUrlModal from './RecipeUrlModal';

/**
 * MealRow Component
 * Single row representing one day's meal in the weekly plan
 *
 * Features:
 * - Inline editable meal name field
 * - Recipe URL link icon (with modal for editing)
 * - Auto-save on blur or Enter key
 * - Character limit (100 chars per PRD)
 * - Touch-friendly for mobile (16px minimum font size)
 * - Intelligent autocomplete (triggers after 3 characters)
 * - Keyboard navigation for autocomplete
 * - Optimized with React.memo to prevent unnecessary re-renders
 *
 * @param {Object} props
 * @param {Object} props.meal - Meal object from database
 * @param {number} props.meal.day_number - Day number (1-7)
 * @param {string} props.meal.meal_name - Name of the meal
 * @param {boolean} props.meal.is_cooked - Completion status
 */
function MealRow({ meal }) {
  const { updateMeal } = useMealPlan();

  // Drag and drop setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.day_number });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.5 : 1,
    willChange: isDragging ? 'transform' : 'auto',
  };

  // Local state for controlled input
  const [mealName, setMealName] = useState(meal.meal_name || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]); // Array of {meal_name, recipe_url} objects
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Recipe URL modal state
  const [showUrlModal, setShowUrlModal] = useState(false);

  // iOS autofill prevention
  const [isReadOnly, setIsReadOnly] = useState(true);

  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync local state when meal prop changes (e.g., week navigation)
  useEffect(() => {
    setMealName(meal.meal_name || '');
  }, [meal.meal_name]);

  /**
   * Cleanup debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Debounced search for autocomplete suggestions
   * Triggers 200ms after user stops typing (per PRD)
   */
  const searchSuggestions = async (query) => {
    // Only search if 3+ characters (per PRD)
    if (query.length < 3) {
      setSuggestions([]);
      setShowAutocomplete(false);
      return;
    }

    try {
      const { data, error } = await historyService.searchHistory(query);

      if (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        return;
      }

      if (data && data.length > 0) {
        setSuggestions(data);
        setShowAutocomplete(true);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowAutocomplete(false);
      }
    } catch (err) {
      console.error('Autocomplete search failed:', err);
    }
  };

  /**
   * Save meal name to database
   * Trims whitespace and validates length
   */
  const saveMeal = async () => {
    const trimmedName = mealName.trim();

    // Only save if value changed
    if (trimmedName !== (meal.meal_name || '')) {
      try {
        setIsSaving(true);
        await updateMeal(meal.day_number, { meal_name: trimmedName });
      } finally {
        setIsSaving(false);
      }
    }
  };

  /**
   * Handle input blur (user clicks away)
   * Delayed to allow autocomplete click to register
   */
  const handleBlur = () => {
    // Delay to allow autocomplete selection to complete
    setTimeout(() => {
      setIsFocused(false);
      setShowAutocomplete(false);
      saveMeal();
    }, 200);
  };

  /**
   * Handle autocomplete selection
   * suggestion is now an object: { meal_name, recipe_url }
   */
  const handleSelectSuggestion = async (suggestion) => {
    setMealName(suggestion.meal_name);
    setShowAutocomplete(false);
    setSelectedIndex(-1);

    // Prepare updates object
    const updates = { meal_name: suggestion.meal_name.trim() };

    // Add recipe_url if it exists in history
    if (suggestion.recipe_url) {
      updates.recipe_url = suggestion.recipe_url;
    }

    // Always save when selecting from autocomplete (meal name OR URL might have changed)
    try {
      setIsSaving(true);
      await updateMeal(meal.day_number, updates);
    } finally {
      setIsSaving(false);
    }

    // Blur input to complete the interaction
    inputRef.current?.blur();
  };

  /**
   * Close autocomplete dropdown
   */
  const handleCloseAutocomplete = () => {
    setShowAutocomplete(false);
    setSelectedIndex(-1);
  };

  /**
   * Handle keyboard navigation for autocomplete
   * Arrow Up/Down: Navigate suggestions
   * Enter: Select highlighted suggestion or save
   * Escape: Close dropdown
   * Tab: Close dropdown and move to next field
   */
  const handleKeyDown = (e) => {
    // Handle autocomplete navigation when dropdown is open
    if (showAutocomplete && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            // Select highlighted suggestion
            handleSelectSuggestion(suggestions[selectedIndex]);
          } else {
            // No suggestion selected, just save and close
            setShowAutocomplete(false);
            inputRef.current?.blur();
          }
          break;

        case 'Escape':
          e.preventDefault();
          setShowAutocomplete(false);
          setSelectedIndex(-1);
          break;

        case 'Tab':
          // Let Tab work normally, but close autocomplete
          setShowAutocomplete(false);
          setSelectedIndex(-1);
          break;

        default:
          break;
      }
    } else {
      // Normal behavior when autocomplete is closed
      if (e.key === 'Enter') {
        e.preventDefault();
        inputRef.current?.blur(); // Trigger blur to save
      }
    }
  };

  /**
   * Handle input change with character limit and debounced search
   */
  const handleChange = (e) => {
    const value = e.target.value;

    // Enforce 100 character limit per PRD
    if (value.length <= 100) {
      setMealName(value);

      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce search by 200ms (per PRD)
      debounceTimerRef.current = setTimeout(() => {
        searchSuggestions(value);
      }, 200);
    }
  };

  // Get day name for accessibility
  const dayName = DAYS_OF_WEEK[meal.day_number - 1];

  // Check if meal has a name (for enabling/disabling checkbox)
  const hasMealName = meal.meal_name && meal.meal_name.trim().length > 0;
  const isCooked = meal.is_cooked || false;

  /**
   * Handle checkbox toggle for meal completion
   */
  const handleToggleCooked = async () => {
    if (!hasMealName || isSaving) return; // Don't allow toggle if no meal name or already saving

    try {
      setIsSaving(true);
      const newCookedState = !isCooked;
      await updateMeal(meal.day_number, { is_cooked: newCookedState });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle recipe URL save from modal
   */
  const handleSaveRecipeUrl = async (url) => {
    try {
      setIsSaving(true);
      await updateMeal(meal.day_number, { recipe_url: url });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle recipe URL icon click
   * If URL exists, open in new tab
   * If no URL, open modal to add one
   */
  const handleRecipeUrlClick = (e) => {
    e.stopPropagation(); // Prevent input focus

    if (meal.recipe_url) {
      // If URL exists, open it
      window.open(meal.recipe_url, '_blank', 'noopener,noreferrer');
    } else {
      // If no URL, open modal to add one
      setShowUrlModal(true);
    }
  };

  /**
   * Handle edit URL action (from secondary button)
   */
  const handleEditUrl = (e) => {
    e.stopPropagation();
    setShowUrlModal(true);
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group drag-optimize">
      <div
        className={`
          flex items-center gap-1 sm:gap-2.5 px-1.5 sm:px-3.5 py-3.5 rounded-lg
          border shadow-card hover:shadow-card-hover
          transition-colors duration-200 ease-out
          ${isFocused ? 'border-primary ring-1 ring-primary/50 shadow-elevated' : ''}
          ${isCooked ? 'bg-bg-card opacity-60' : 'bg-bg-card opacity-100'}
          ${isDragging ? 'shadow-elevated ring-2 ring-primary/30' : 'border-border hover:border-border-secondary'}
        `}
      >
        {/* Drag Handle - 6 Dots Icon */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none p-0.5 select-none"
        >
          <svg
            className="w-5 h-5 text-text-secondary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <circle cx="7" cy="5" r="1.5" />
            <circle cx="13" cy="5" r="1.5" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="13" cy="10" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
          </svg>
        </div>

        {/* Checkbox for Meal Completion */}
        <button
          type="button"
          onClick={handleToggleCooked}
          disabled={!hasMealName || isSaving}
          className={`
            flex-shrink-0 w-5 h-5 rounded
            border-2 flex items-center justify-center
            transition-colors duration-200 ease-out self-center
            ${
              hasMealName && !isSaving
                ? 'border-border-checkbox hover:border-primary hover:scale-110 cursor-pointer'
                : 'border-border/50 cursor-not-allowed opacity-40'
            }
            ${isCooked ? 'bg-primary border-primary scale-100' : 'bg-transparent scale-100'}
          `}
          aria-label={`Mark ${dayName} meal as ${isCooked ? 'not cooked' : 'cooked'}`}
          aria-checked={isCooked}
          role="checkbox"
        >
          {isCooked && (
            <svg
              className="w-3.5 h-3.5 text-white animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Editable Meal Name Input */}
        <input
          ref={inputRef}
          type="text"
          value={mealName}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            if (isReadOnly) {
              setIsReadOnly(false);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add meal name..."
          disabled={isSaving}
          readOnly={isReadOnly}
          className={`
            flex-1 max-w-[210px] sm:max-w-none bg-transparent outline-none
            placeholder-text-placeholder
            text-base min-h-[44px] font-medium
            transition-all duration-300 ease-out
            border rounded px-1 py-1
            focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0
            border-transparent
            ${isCooked ? 'text-text-secondary line-through decoration-text-tertiary/[0.99]' : 'text-text-primary'}
            ${isSaving ? 'opacity-50 cursor-wait' : 'cursor-text'}
          `}
          maxLength={100}
          aria-label={`Meal name for ${dayName}`}
          id={`meal-input-${meal.day_number}`}
          name="meal-name-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-lpignore="true"
          data-form-type="other"
        />

        {/* Recipe URL Icon */}
        {hasMealName && (
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={handleRecipeUrlClick}
              className={`
                p-2 rounded transition-all duration-200
                ${meal.recipe_url
                  ? 'text-primary hover:text-primary-hover hover:bg-primary/10'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-elevated'
                }
              `}
              aria-label={meal.recipe_url ? 'Open recipe link' : 'Add recipe link'}
              title={meal.recipe_url ? 'Click to open recipe' : 'Add recipe link'}
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        )}

        {/* Character Count (shown when focused and approaching limit) */}
        {isFocused && mealName.length > 80 && (
          <div className="flex-shrink-0 text-xs text-text-tertiary">
            {mealName.length}/100
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AutocompletePortal
        anchorRef={inputRef}
        isOpen={showAutocomplete}
      >
        <MealAutocomplete
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSelectSuggestion}
          onClose={handleCloseAutocomplete}
          inputRef={inputRef}
        />
      </AutocompletePortal>

      {/* Recipe URL Modal */}
      <RecipeUrlModal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onSave={handleSaveRecipeUrl}
        currentUrl={meal.recipe_url}
        mealName={mealName}
      />
    </div>
  );
}

/**
 * Custom comparison function for React.memo
 * Only re-render if the meal data actually changed
 */
function areEqual(prevProps, nextProps) {
  return (
    prevProps.meal.day_number === nextProps.meal.day_number &&
    prevProps.meal.meal_name === nextProps.meal.meal_name &&
    prevProps.meal.is_cooked === nextProps.meal.is_cooked &&
    prevProps.meal.recipe_url === nextProps.meal.recipe_url
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(MealRow, areEqual);
