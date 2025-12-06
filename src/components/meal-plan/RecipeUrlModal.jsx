import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

/**
 * RecipeUrlModal Component
 * Modal for adding/editing recipe URL for a meal
 *
 * Features:
 * - Input field for URL entry
 * - URL validation (basic format check)
 * - Save and Cancel buttons
 * - Escape key to close
 * - Click outside to close
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Function} props.onSave - Callback when URL is saved (receives url string or null)
 * @param {string} props.currentUrl - Current recipe URL (for editing)
 * @param {string} props.mealName - Name of the meal (for display)
 */
export default function RecipeUrlModal({
  isOpen,
  onClose,
  onSave,
  currentUrl = '',
  mealName
}) {
  const [url, setUrl] = useState(currentUrl || '');
  const [error, setError] = useState('');

  // Sync with currentUrl when it changes
  useEffect(() => {
    setUrl(currentUrl || '');
    setError('');
  }, [currentUrl, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  /**
   * Validate URL format (basic check)
   * Allows empty string (to remove URL)
   */
  const validateUrl = (urlString) => {
    if (!urlString.trim()) {
      return true; // Allow empty to remove URL
    }

    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Handle save button click
   */
  const handleSave = () => {
    const trimmedUrl = url.trim();

    // Allow empty URL (removes the link)
    if (!trimmedUrl) {
      onSave(null); // Pass null to remove URL
      onClose();
      return;
    }

    // Validate URL format
    if (!validateUrl(trimmedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    onSave(trimmedUrl);
    onClose();
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setUrl(currentUrl || '');
    setError('');
    onClose();
  };

  /**
   * Handle click on backdrop (outside modal)
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-bg-card rounded-lg border border-border p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Recipe Link
        </h3>

        {/* Meal Name Display */}
        <p className="text-sm text-text-secondary mb-4">
          {mealName || 'No meal name'}
        </p>

        {/* URL Input */}
        <div className="mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(''); // Clear error on typing
            }}
            placeholder="https://example.com/recipe"
            className="w-full px-3 py-2 bg-bg-elevated text-text-primary border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-border-secondary transition-colors duration-200 placeholder:text-text-placeholder"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />

          {/* Error Message */}
          {error && (
            <p className="text-sm text-error mt-2">
              {error}
            </p>
          )}

          {/* Helper Text */}
          <p className="text-xs text-text-tertiary mt-2">
            Leave empty to remove the recipe link
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="px-4 py-2"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
