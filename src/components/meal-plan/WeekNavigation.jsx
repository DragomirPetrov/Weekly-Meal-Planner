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
    <div className="bg-bg-card rounded-lg border border-neutral-800/50 p-5 mb-6 shadow-card">
      <div className="flex items-center justify-between">
        {/* Previous Week Button */}
        <button
          onClick={goToPreviousWeek}
          className="p-2 text-neutral-400 hover:text-neutral-100 transition-colors"
          aria-label="Previous week"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Week Display */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-bold text-neutral-100 text-center tracking-tight">
            {weekDisplay}
          </h2>

          {/* Show "Current week" label when viewing current week */}
          {isThisWeek && (
            <span className="text-xs text-amber-500">
              Current week
            </span>
          )}
        </div>

        {/* Next Week Button */}
        <button
          onClick={goToNextWeek}
          className="p-2 text-neutral-400 hover:text-neutral-100 transition-colors"
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
