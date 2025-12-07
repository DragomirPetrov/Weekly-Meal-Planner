import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ErrorMessage from '../ui/ErrorMessage';

/**
 * Authentication form component (inline login/signup)
 * Handles both login and signup flows
 */
export default function AuthForm() {
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Validate form fields
   * @returns {boolean} - True if valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.success) {
      newErrors.email = emailValidation.error;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.success) {
      newErrors.password = passwordValidation.error;
    }

    // Validate password confirmation (signup only)
    if (!isLogin) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { success, error } = await login(email, password);
        if (!success) {
          setGlobalError(error);
        }
      } else {
        const { success, error } = await signup(email, password);
        if (!success) {
          setGlobalError(error);
        } else {
          // Success message
          setGlobalError('');
          // Note: May need email confirmation depending on Supabase settings
          alert('Account created successfully! You can now log in.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (error) {
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle between login and signup modes
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setGlobalError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Weekly Meal Planner
          </h1>
          <p className="text-text-secondary">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-bg-surface rounded-lg p-6 border border-border">
          {globalError && (
            <ErrorMessage
              message={globalError}
              onDismiss={() => setGlobalError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Email */}
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={loading}
              autoComplete="email"
            />

            {/* Password */}
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={loading}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            {/* Confirm Password (signup only) */}
            {!isLogin && (
              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                disabled={loading}
                autoComplete="new-password"
              />
            )}

            {/* Password requirements hint (signup only) */}
            {!isLogin && (
              <div className="text-xs text-text-secondary space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside pl-2">
                  <li>At least 6 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                </ul>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
