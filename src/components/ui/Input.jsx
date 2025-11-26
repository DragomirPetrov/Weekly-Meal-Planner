/**
 * Reusable Input component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message to display
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 */
export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2
          bg-bg-surface text-text-primary
          border rounded
          ${error ? 'border-error' : 'border-border'}
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          hover:border-border-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          placeholder:text-text-disabled
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
