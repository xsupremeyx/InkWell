import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for toggling the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Ref to detect clicks outside the dropdown to close it
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-border shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link to="/" className="text-xl font-bold text-text-primary">
          Inkwell
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/#posts" className="text-text-secondary hover:text-accent font-medium transition-colors">
            Browse Posts
          </Link>
          
          <div className="h-4 w-px bg-border"></div>

          {/* Conditional Rendering: Logged In vs Logged Out */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium cursor-pointer"
              >
                Hey, {user.username} <span className="text-xs">▼</span>
              </button>

              {/* The Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg py-1 z-20">
                  <Link 
                    to="/account" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                  >
                    Account Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-text-secondary hover:text-text-primary transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-accent text-surface px-4 py-2 rounded-md hover:bg-opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}