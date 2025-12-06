import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';

/**
 * Main content container component
 * Provides consistent padding and max-width
 * Supports swipe navigation for mobile UX
 */
export default function Container({ children, className = '', onSwipeLeft, onSwipeRight }) {
  // Enable swipe navigation if callbacks provided
  useSwipeNavigation({
    onSwipeLeft,
    onSwipeRight,
    enabled: !!(onSwipeLeft || onSwipeRight),
  });

  return (
    <main className="flex-1 overflow-y-auto">
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </div>
    </main>
  );
}
