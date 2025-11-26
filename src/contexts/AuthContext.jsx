import { createContext, useContext, useState, useEffect } from 'react';
import { authService, handleAuthError } from '../services/auth.service';

const AuthContext = createContext(null);

/**
 * AuthContext Provider
 * Manages user authentication state and provides auth methods
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { session: existingSession } = await authService.getSession();
        setSession(existingSession);
        setUser(existingSession?.user || null);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const subscription = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sign up a new user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const signup = async (email, password) => {
    try {
      const { user: newUser, error } = await authService.signup(email, password);

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      // Note: Supabase may require email confirmation
      // Check your Supabase project settings
      return { success: true };
    } catch (error) {
      return { success: false, error: handleAuthError(error) };
    }
  };

  /**
   * Sign in with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    try {
      const { user: loggedInUser, session: newSession, error } = await authService.login(email, password);

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      // State will be updated by onAuthStateChange listener
      return { success: true };
    } catch (error) {
      return { success: false, error: handleAuthError(error) };
    }
  };

  /**
   * Sign out current user
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const logout = async () => {
    try {
      const { error } = await authService.logout();

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleAuthError(error) };
    }
  };

  /**
   * Send password reset email
   * @param {string} email
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const resetPassword = async (email) => {
    try {
      const { error } = await authService.resetPassword(email);

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleAuthError(error) };
    }
  };

  const value = {
    user,
    session,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
