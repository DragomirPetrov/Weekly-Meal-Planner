import { useMealPlan } from '../../contexts/MealPlanContext';
import { formatWeekRange } from '../../utils/dateUtils';
import Button from '../ui/Button';

/**
 * WeekNavigation Component
 * Navigation controls for browsing weekly meal plans
 *
 * Features:
 * - Previous week button
 * - Current week display (e.g., "Nov 25 - Dec 1")
 * - Next week button
 */
export default function WeekNavigation() {
  const {
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    isCurrentWeek,
  } = useMealPlan();

  const weekDisplay = formatWeekRange(currentWeekStart);
  const isThisWeek = isCurrentWeek();

  return (
    <div className={`
      bg-bg-card rounded-lg p-5 mb-6 shadow-card border border-primary
      transition-all duration-300
      ${isThisWeek ? 'ring-2 ring-primary/20' : ''}
    `}>
      <div className="flex items-center justify-between">
        {/* Previous Week Button */}
        <button
          onClick={goToPreviousWeek}
          className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Previous week"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Week Display */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-base font-normal text-text-secondary text-center">
            {weekDisplay}
          </h2>

          {/* "Current week" text in red to match the border */}
          {isThisWeek && (
            <span className="text-xs text-primary">
              Current week
            </span>
          )}
        </div>

        {/* Next Week Button */}
        <button
          onClick={goToNextWeek}
          className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Next week"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
