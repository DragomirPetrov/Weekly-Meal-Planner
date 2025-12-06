/**
 * Main content container component
 * Provides consistent padding and max-width
 * Mobile-optimized: minimal horizontal padding on mobile for better content visibility
 */
export default function Container({ children, className = '' }) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className={`max-w-7xl mx-auto px-1.5 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </div>
    </main>
  );
}
