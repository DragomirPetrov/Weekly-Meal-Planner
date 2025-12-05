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
  const { currentWeekStart } = useMealPlan();

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-primary mb-8 tracking-tight">
          Weekly Meal Planner
        </h1>

        {/* Week Navigation */}
        <WeekNavigation />

        {/* Weekly Meal Table */}
        <MealTable />

        {/* Weekly Recipe Suggestions (Phase 6) */}
        <RecipeSuggestions currentWeekStart={currentWeekStart} />
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
