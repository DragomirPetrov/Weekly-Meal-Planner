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
  const { goToPreviousWeek, goToNextWeek } = useMealPlan();

  return (
    <Container
      onSwipeLeft={goToNextWeek}
      onSwipeRight={goToPreviousWeek}
    >
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
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
