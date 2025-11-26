/**
 * Main content container component
 * Provides consistent padding and max-width
 */
export default function Container({ children, className = '' }) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
        {children}
      </div>
    </main>
  );
}
