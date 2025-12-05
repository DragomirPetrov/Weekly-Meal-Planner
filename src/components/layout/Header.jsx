import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

/**
 * Header component with user email and logout button
 */
export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const { success, error } = await logout();
    if (!success) {
      alert(`Logout failed: ${error}`);
    }
  };

  return (
    <header className="bg-bg-surface border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-14">
          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary hidden sm:block">
              {user?.email}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
