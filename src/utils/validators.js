import { z } from 'zod';
import { MEAL_NAME_MAX_LENGTH, PASSWORD_REQUIREMENTS } from './constants';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

/**
 * Password validation schema
 * Requirements: 6+ chars, 1 uppercase, 1 lowercase, 1 number
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_REQUIREMENTS.MIN_LENGTH, `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Meal name validation schema
 * Optional, max 100 characters, trimmed
 */
export const mealNameSchema = z
  .string()
  .trim()
  .max(MEAL_NAME_MAX_LENGTH, `Meal name must be ${MEAL_NAME_MAX_LENGTH} characters or less`)
  .optional()
  .nullable();

/**
 * Validate email
 * @param {string} email
 * @returns {{ success: boolean, error?: string }}
 */
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.errors[0]?.message || 'Invalid email' };
  }
};

/**
 * Validate password
 * @param {string} password
 * @returns {{ success: boolean, error?: string }}
 */
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.errors[0]?.message || 'Invalid password' };
  }
};

/**
 * Validate meal name
 * @param {string} mealName
 * @returns {{ success: boolean, error?: string, value?: string }}
 */
export const validateMealName = (mealName) => {
  try {
    const validated = mealNameSchema.parse(mealName);
    return { success: true, value: validated };
  } catch (err) {
    return { success: false, error: err.errors[0]?.message || 'Invalid meal name' };
  }
};
