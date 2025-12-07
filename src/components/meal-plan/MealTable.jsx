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
        distance: 5, // Reduced from 8px for faster response on iOS
        tolerance: 3, // Reduced from 5px for tighter control
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

  // Show cached/previous data while loading new week (optimistic UI)
  if (loading && meals.length > 0) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="relative space-y-2.5">
          {/* Small loading indicator in corner */}
          <div className="absolute -top-8 right-0 z-10">
            <Spinner size="small" />
          </div>

          {/* Show previous week's data with reduced opacity */}
          <div className="opacity-50 pointer-events-none">
            <SortableContext
              items={meals.map(meal => meal.day_number)}
              strategy={verticalListSortingStrategy}
            >
              {meals.map((meal) => (
                <MealRow key={meal.day_number} meal={meal} />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    );
  }

  // Show full loading spinner only on initial load (no cached data)
  if (loading && meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="large" />
        <p className="text-text-secondary text-sm">Loading meal plan...</p>
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
        <p className="text-text-secondary">No meal plan found.</p>
        <button
          onClick={refreshMeals}
          className="mt-4 text-primary hover:text-primary-hover text-sm"
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
      <div className="space-y-2.5">
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
      </div>
    </DndContext>
  );
}
