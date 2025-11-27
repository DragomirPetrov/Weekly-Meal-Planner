import { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { historyService } from '../../services/history.service';
import { DAYS_OF_WEEK } from '../../utils/constants';
import MealAutocomplete from './MealAutocomplete';

/**
 * MealRow Component
 * Single row representing one day's meal in the weekly plan
 *
 * Features:
 * - Day number display (1-7)
 * - Inline editable meal name field
 * - Auto-save on blur or Enter key
 * - Character limit (100 chars per PRD)
 * - Touch-friendly for mobile (16px minimum font size)
 * - Intelligent autocomplete (triggers after 3 characters)
 * - Keyboard navigation for autocomplete
 *
 * @param {Object} props
 * @param {Object} props.meal - Meal object from database
 * @param {number} props.meal.day_number - Day number (1-7)
 * @param {string} props.meal.meal_name - Name of the meal
 * @param {boolean} props.meal.is_cooked - Completion status
 */
export default function MealRow({ meal }) {
  const { updateMeal, saving } = useMealPlan();

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
    transition: transition || 'transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isDragging ? 0.5 : 1,
  };

  // Local state for controlled input
  const [mealName, setMealName] = useState(meal.meal_name || '');
  const [isFocused, setIsFocused] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
      await updateMeal(meal.day_number, { meal_name: trimmedName });
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
   */
  const handleSelectSuggestion = (suggestion) => {
    setMealName(suggestion);
    setShowAutocomplete(false);
    setSelectedIndex(-1);

    // Save immediately after selection
    setTimeout(async () => {
      if (suggestion.trim() !== (meal.meal_name || '')) {
        await updateMeal(meal.day_number, { meal_name: suggestion.trim() });
      }
      inputRef.current?.blur();
    }, 0);
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
    if (!hasMealName) return; // Don't allow toggle if no meal name

    const newCookedState = !isCooked;
    await updateMeal(meal.day_number, { is_cooked: newCookedState });
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className={`
          flex items-center gap-3 p-3 rounded-lg
          border border-neutral-800
          hover:border-neutral-700
          transition-all duration-300 ease-out
          ${isFocused ? 'border-red-600 ring-1 ring-red-600/50' : ''}
          ${isCooked ? 'bg-bg-cooked' : 'bg-neutral-900'}
          ${isDragging ? 'shadow-lg ring-2 ring-red-600/30' : ''}
        `}
      >
        {/* Drag Handle */}
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 flex items-center justify-center"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${dayName} meal`}
          role="button"
          tabIndex={0}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
        </div>

        {/* Checkbox for Meal Completion */}
        <button
          type="button"
          onClick={handleToggleCooked}
          disabled={!hasMealName || saving}
          className={`
            flex-shrink-0 w-6 h-6 rounded
            border-2
            flex items-center justify-center
            transition-all duration-300 ease-out
            ${
              hasMealName && !saving
                ? 'border-neutral-600 hover:border-red-600 hover:scale-110 cursor-pointer'
                : 'border-neutral-800 cursor-not-allowed opacity-40'
            }
            ${isCooked ? 'bg-red-600 border-red-600 scale-100' : 'bg-transparent scale-100'}
          `}
          aria-label={`Mark ${dayName} meal as ${isCooked ? 'not cooked' : 'cooked'}`}
          aria-checked={isCooked}
          role="checkbox"
        >
          {isCooked && (
            <svg
              className="w-4 h-4 text-white animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Day Number */}
        <div
          className={`
            flex-shrink-0 w-8 h-8
            flex items-center justify-center
            rounded
            font-semibold text-sm
            transition-all duration-300 ease-out
            ${isCooked ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-800 text-neutral-400'}
          `}
          aria-label={`Day ${meal.day_number}, ${dayName}`}
        >
          {meal.day_number}
        </div>

        {/* Editable Meal Name Input */}
        <input
          ref={inputRef}
          type="text"
          value={mealName}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add meal name..."
          disabled={saving}
          className={`
            flex-1 bg-transparent border-none outline-none
            placeholder-neutral-600
            text-base min-h-[44px]
            transition-all duration-300 ease-out
            ${isCooked ? 'text-text-cooked' : 'text-neutral-100'}
            ${saving ? 'opacity-50 cursor-wait' : 'cursor-text'}
          `}
          maxLength={100}
          aria-label={`Meal name for ${dayName}`}
          autoComplete="off"
        />

        {/* Character Count (shown when focused and approaching limit) */}
        {isFocused && mealName.length > 80 && (
          <div className="flex-shrink-0 text-xs text-neutral-500">
            {mealName.length}/100
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && (
        <MealAutocomplete
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSelectSuggestion}
          onClose={handleCloseAutocomplete}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}
