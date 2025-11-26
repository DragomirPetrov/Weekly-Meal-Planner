import { startOfWeek, endOfWeek, format, addWeeks as addWeeksFns, formatISO } from 'date-fns';

/**
 * Get the Monday of the week for a given date (ISO 8601 standard)
 * @param {Date} date - Any date
 * @returns {Date} - Monday of that week
 */
export const getMonday = (date) => {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
};

/**
 * Get the Sunday of the week for a given date
 * @param {Date} monday - Monday of the week
 * @returns {Date} - Sunday of that week
 */
export const getSunday = (monday) => {
  return endOfWeek(monday, { weekStartsOn: 1 });
};

/**
 * Format week range for display (e.g., "Nov 25 - Dec 1")
 * @param {Date} monday - Monday of the week
 * @returns {string} - Formatted week range
 */
export const formatWeekRange = (monday) => {
  const sunday = getSunday(monday);
  const startMonth = format(monday, 'MMM');
  const endMonth = format(sunday, 'MMM');

  // If same month: "Nov 25 - Dec 1"
  // If different months: "Nov 25 - Dec 1"
  return `${format(monday, 'MMM d')} - ${format(sunday, 'MMM d')}`;
};

/**
 * Add or subtract weeks from a date
 * @param {Date} date - Starting date
 * @param {number} count - Number of weeks to add (positive) or subtract (negative)
 * @returns {Date} - New date
 */
export const addWeeks = (date, count) => {
  return addWeeksFns(date, count);
};

/**
 * Check if a given date is in the current week
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is in current week
 */
export const isCurrentWeek = (date) => {
  const today = new Date();
  return getMonday(date).getTime() === getMonday(today).getTime();
};

/**
 * Format date as ISO date string (YYYY-MM-DD) for database
 * @param {Date} date - Date to format
 * @returns {string} - ISO date string
 */
export const formatISODate = (date) => {
  return formatISO(date, { representation: 'date' });
};

/**
 * Get today's date at midnight
 * @returns {Date} - Today at 00:00:00
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get the Monday of the current week
 * @returns {Date} - Monday of current week
 */
export const getCurrentMonday = () => {
  return getMonday(getToday());
};
