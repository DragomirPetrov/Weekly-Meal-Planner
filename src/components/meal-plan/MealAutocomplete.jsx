import { useEffect, useRef } from 'react';

/**
 * MealAutocomplete Component
 * Dropdown list of autocomplete suggestions for meal names
 *
 * Features:
 * - Dark theme with red accents (per PRD color palette)
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Touch-friendly tap targets (44px height per PRD)
 * - Smooth fade-in animation (200ms per PRD)
 * - Click outside to dismiss
 *
 * @param {Object} props
 * @param {string[]} props.suggestions - Array of meal name suggestions
 * @param {number} props.selectedIndex - Currently highlighted suggestion index
 * @param {Function} props.onSelect - Callback when suggestion is selected
 * @param {Function} props.onClose - Callback to close dropdown
 * @param {Object} props.inputRef - Ref to the input element (for positioning)
 */
export default function MealAutocomplete({
  suggestions,
  selectedIndex,
  onSelect,
  onClose,
  inputRef,
}) {
  const dropdownRef = useRef(null);

  /**
   * Handle click outside dropdown to close
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose, inputRef]);

  /**
   * Scroll selected item into view when selectedIndex changes
   */
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  // Don't render if no suggestions
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="
        absolute top-full left-0 right-0 mt-1 z-50
        bg-neutral-800 border border-neutral-700
        rounded-lg shadow-lg overflow-hidden
        animate-fade-in max-h-[280px] overflow-y-auto
      "
      role="listbox"
      aria-label="Meal suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(suggestion)}
          className={`
            w-full px-4 py-3 text-left text-base
            transition-colors cursor-pointer
            min-h-[44px] flex items-center
            ${
              index === selectedIndex
                ? 'bg-red-600 text-white'
                : 'text-neutral-100 hover:bg-neutral-700'
            }
            ${index !== suggestions.length - 1 ? 'border-b border-neutral-700' : ''}
          `}
          role="option"
          aria-selected={index === selectedIndex}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
