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
 * - "Today" button to jump to current week
 */
export default function WeekNavigation() {
  const {
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    isCurrentWeek,
  } = useMealPlan();

  const weekDisplay = formatWeekRange(currentWeekStart);
  const isThisWeek = isCurrentWeek();

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Previous Week Button */}
      <Button
        variant="secondary"
        onClick={goToPreviousWeek}
        className="px-4 py-2"
        aria-label="Previous week"
      >
        <span className="text-lg">←</span>
        <span className="ml-2 hidden sm:inline">Previous</span>
      </Button>

      {/* Week Display & Today Button */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-neutral-100 text-center">
            {weekDisplay}
          </h2>

          {/* Show "This Week" badge when viewing current week */}
          {isThisWeek && (
            <span className="px-2 py-1 text-xs font-medium bg-red-600/20 text-red-400 rounded">
              This Week
            </span>
          )}
        </div>

        {/* Show "Today" button only when not viewing current week */}
        {!isThisWeek && (
          <Button
            variant="secondary"
            onClick={goToToday}
            className="px-3 py-1 text-sm"
          >
            Today
          </Button>
        )}
      </div>

      {/* Next Week Button */}
      <Button
        variant="secondary"
        onClick={goToNextWeek}
        className="px-4 py-2"
        aria-label="Next week"
      >
        <span className="hidden sm:inline mr-2">Next</span>
        <span className="text-lg">→</span>
      </Button>
    </div>
  );
}
