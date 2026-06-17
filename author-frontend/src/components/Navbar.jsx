import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-black tracking-tight text-text-primary flex items-baseline gap-2">
          Inkwell <span className="text-sm font-sans font-semibold text-accent tracking-wide uppercase">Author</span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-sm text-text-secondary">
              Logged in as <span className="font-semibold text-text-primary">{user.username}</span>
            </span>
            
            <div className="h-4 w-px bg-border hidden sm:block"></div>

            <Link 
              to="/account" 
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Account
            </Link>

            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-text-secondary hover:text-red-600 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}