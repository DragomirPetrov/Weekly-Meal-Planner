import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMealPlan } from '../../contexts/MealPlanContext';
import MealRow from './MealRow';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';

/**
 * MealTable Component
 * Displays 7 meal rows for the current week (Monday-Sunday)
 *
 * Features:
 * - Loading state during data fetch
 * - Error handling with retry
 * - 7 editable meal rows
 * - Auto-save functionality (handled by MealRow)
 * - Drag & drop reordering (Phase 5)
 */
export default function MealTable() {
  const { meals, loading, error, refreshMeals, swapMeals } = useMealPlan();

  // Configure sensors for drag and drop
  // PointerSensor: Mouse/trackpad dragging
  // TouchSensor: Touch screen dragging (mobile)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum 8px drag distance to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8, // 8px drag distance - prevents conflict with scrolling and enables browser simulation
        tolerance: 5, // 5px tolerance for touch precision
      },
    })
  );

  /**
   * Handle drag end event
   * Swap the two meals when drag completes
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log('Drag end:', { active: active?.id, over: over?.id });

    if (!over || active.id === over.id) {
      console.log('Drag cancelled: same position or no target');
      return; // No swap needed
    }

    // active.id and over.id are the day_numbers
    const fromDay = active.id;
    const toDay = over.id;

    console.log(`Swapping day ${fromDay} with day ${toDay}`);
    swapMeals(fromDay, toDay);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="large" />
        <p className="text-neutral-400 text-sm">Loading meal plan...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onDismiss={refreshMeals}
        dismissText="Retry"
      />
    );
  }

  // No meals (shouldn't happen due to createEmptyWeek, but handle gracefully)
  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">No meal plan found.</p>
        <button
          onClick={refreshMeals}
          className="mt-4 text-red-600 hover:text-red-500 text-sm"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3">
        {/* Table Header (optional, for context) */}
        <div className="sr-only">
          <h3>Weekly Meal Plan</h3>
          <p>7 days, Monday through Sunday</p>
        </div>

        {/* Sortable Meal Rows */}
        <SortableContext
          items={meals.map(meal => meal.day_number)}
          strategy={verticalListSortingStrategy}
        >
          {meals.map((meal) => (
            <MealRow key={meal.day_number} meal={meal} />
          ))}
        </SortableContext>

        {/* Save indicator (optional, subtle feedback) */}
        <div className="text-xs text-neutral-600 text-center mt-4">
          Changes save automatically • Drag to reorder
        </div>
      </div>
    </DndContext>
  );
}
