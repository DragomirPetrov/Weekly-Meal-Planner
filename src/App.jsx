import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import Spinner from './components/ui/Spinner';

/**
 * Main app content (after auth)
 * This will be expanded in Phase 2 with meal planning features
 */
function AppContent() {
  return (
    <>
      <Header />
      <Container>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Welcome to Weekly Meal Planner!
          </h2>
          <p className="text-text-secondary mb-4">
            Your meal planning features will appear here.
          </p>
          <p className="text-sm text-text-disabled">
            Phase 1 (Foundation) complete. Next: Core meal planning features.
          </p>
        </div>
      </Container>
    </>
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
