import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MealPlanProvider } from './contexts/MealPlanContext';
import AuthForm from './components/auth/AuthForm';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import Spinner from './components/ui/Spinner';
import WeekNavigation from './components/meal-plan/WeekNavigation';
import MealTable from './components/meal-plan/MealTable';

/**
 * Main app content (after auth)
 * Phase 2: Core meal planning functionality
 */
function AppContent() {
  return (
    <MealPlanProvider>
      <Header />
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Week Navigation */}
          <WeekNavigation />

          {/* Weekly Meal Table */}
          <MealTable />
        </div>
      </Container>
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
