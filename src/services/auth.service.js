import { supabase } from './supabase';

/**
 * Authentication service for Supabase
 * Handles login, signup, logout, and password reset
 */
export const authService = {
  /**
   * Get current session
   * @returns {Promise<{session: Session|null, error: Error|null}>}
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  /**
   * Sign up a new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: User|null, error: Error|null}>}
   */
  async signup(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    return { user: data.user, error: null };
  },

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: User|null, session: Session|null, error: Error|null}>}
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    return { user: data.user, session: data.session, error: null };
  },

  /**
   * Sign out the current user
   * @returns {Promise<{error: Error|null}>}
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<{error: Error|null}>}
   */
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return { error };
  },

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Callback function (event, session) => void
   * @returns {Object} - Subscription object with unsubscribe method
   */
  onAuthStateChange(callback) {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data;
  },
};

/**
 * Helper function to handle Supabase errors
 * Maps technical errors to user-friendly messages
 * @param {Error} error - Supabase error
 * @returns {string} - User-friendly error message
 */
export const handleAuthError = (error) => {
  if (!error) return 'An unexpected error occurred';

  const errorMap = {
    'Invalid login credentials': 'Email or password is incorrect',
    'User already registered': 'An account with this email already exists',
    'Email not confirmed': 'Please confirm your email address',
    'Network request failed': 'Connection error. Please check your internet.',
    'JWT expired': 'Your session has expired. Please log in again.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters',
  };

  return errorMap[error.message] || error.message || 'An unexpected error occurred';
};
