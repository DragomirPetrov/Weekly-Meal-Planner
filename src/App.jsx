import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MealPlanProvider, useMealPlan } from './contexts/MealPlanContext';
import AuthForm from './components/auth/AuthForm';
import Container from './components/layout/Container';
import Spinner from './components/ui/Spinner';
import WeekNavigation from './components/meal-plan/WeekNavigation';
import MealTable from './components/meal-plan/MealTable';
import RecipeSuggestions from './components/suggestions/RecipeSuggestions';

/**
 * Main content wrapper that uses meal plan context
 */
function MainContent() {
  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/menu-icon.png"
            alt="WMP Logo"
            className="w-5 h-5"
          />
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Weekly Meal Planner
          </h1>
        </div>

        {/* Week Navigation */}
        <WeekNavigation />

        {/* Weekly Meal Table */}
        <MealTable />

        {/* Weekly Recipe Suggestions */}
        <RecipeSuggestions />
      </div>
    </Container>
  );
}

/**
 * Main app content (after auth)
 * Provides meal plan context to all components
 */
function AppContent() {
  return (
    <MealPlanProvider>
      <MainContent />
    </MealPlanProvider>
  );
}

/**
 * Auth-gated app component
 * Shows auth form if not logged in, otherwise shows app content
 */
function AuthGate() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm />;
  }

  // Show main app if authenticated
  return <AppContent />;
}

/**
 * Root App component
 * Wraps everything with AuthProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <AuthGate />
      </div>
    </AuthProvider>
  );
}
