import { useState, useEffect, useRef } from 'react';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { DAYS_OF_WEEK } from '../../utils/constants';

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
 *
 * @param {Object} props
 * @param {Object} props.meal - Meal object from database
 * @param {number} props.meal.day_number - Day number (1-7)
 * @param {string} props.meal.meal_name - Name of the meal
 * @param {boolean} props.meal.is_cooked - Completion status
 */
export default function MealRow({ meal }) {
  const { updateMeal, saving } = useMealPlan();

  // Local state for controlled input
  const [mealName, setMealName] = useState(meal.meal_name || '');
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  // Sync local state when meal prop changes (e.g., week navigation)
  useEffect(() => {
    setMealName(meal.meal_name || '');
  }, [meal.meal_name]);

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
   */
  const handleBlur = () => {
    setIsFocused(false);
    saveMeal();
  };

  /**
   * Handle Enter key press
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur(); // Trigger blur to save
    }
  };

  /**
   * Handle input change with character limit
   */
  const handleChange = (e) => {
    const value = e.target.value;

    // Enforce 100 character limit per PRD
    if (value.length <= 100) {
      setMealName(value);
    }
  };

  // Get day name for accessibility
  const dayName = DAYS_OF_WEEK[meal.day_number - 1];

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        bg-neutral-900 border border-neutral-800
        hover:border-neutral-700 transition-colors
        ${isFocused ? 'border-red-600 ring-1 ring-red-600/50' : ''}
      `}
    >
      {/* Day Number */}
      <div
        className="
          flex-shrink-0 w-8 h-8
          flex items-center justify-center
          rounded bg-neutral-800
          text-neutral-400 font-semibold text-sm
        "
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
          text-neutral-100 placeholder-neutral-600
          text-base min-h-[44px]
          ${saving ? 'opacity-50 cursor-wait' : 'cursor-text'}
        `}
        maxLength={100}
        aria-label={`Meal name for ${dayName}`}
      />

      {/* Character Count (shown when focused and approaching limit) */}
      {isFocused && mealName.length > 80 && (
        <div className="flex-shrink-0 text-xs text-neutral-500">
          {mealName.length}/100
        </div>
      )}
    </div>
  );
}
