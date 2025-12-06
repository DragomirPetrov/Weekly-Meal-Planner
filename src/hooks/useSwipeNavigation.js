import { useRef, useEffect } from 'react';

const SWIPE_THRESHOLD = 50; // Minimum horizontal distance for swipe (px)
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity (px/ms)
const MAX_VERTICAL_RATIO = 0.5; // Max ratio of vertical/horizontal movement

/**
 * Custom hook for swipe navigation
 * Detects horizontal swipes without interfering with scrolling or drag-and-drop
 *
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {boolean} options.enabled - Enable/disable swipe detection
 */
export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, enabled = true }) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      // Only track single finger touches
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
      isSwiping.current = false;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // If vertical movement dominates, it's a scroll - don't interfere
      if (absY > absX) {
        isSwiping.current = false;
        return;
      }

      // If horizontal movement is significant, mark as swiping
      if (absX > 20 && absY / absX < MAX_VERTICAL_RATIO) {
        isSwiping.current = true;
        // Prevent default to stop scrolling during horizontal swipe
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      const deltaTime = Date.now() - touchStartTime.current;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Calculate velocity
      const velocity = absX / deltaTime;

      // Validate swipe criteria
      const isHorizontal = absY / absX < MAX_VERTICAL_RATIO;
      const isLongEnough = absX > SWIPE_THRESHOLD;
      const isFastEnough = velocity > SWIPE_VELOCITY_THRESHOLD;

      if (isHorizontal && (isLongEnough || isFastEnough)) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }

      isSwiping.current = false;
    };

    // Add passive: false to allow preventDefault
    const options = { passive: false };

    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onSwipeLeft, onSwipeRight]);
}
