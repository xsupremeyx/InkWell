import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 1. We need to know what page we are on to trigger the transparent hero effect!
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dropdownRef = useRef(null);

  // 2. Listen for scrolling to change the background from transparent to frosted glass
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu whenever you click a link and the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

    const handleBrowsePostsClick = (e) => {
      // If we are already on the Home page, manually trigger the smooth scroll!
      if (isHome) {
        e.preventDefault();
        document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false); // Close mobile dropdown if it was open
      }
    };

  // 3. MAGIC LOGIC: Determine if the navbar should be completely transparent right now
  const isTransparent = isHome && !isScrolled && !isMobileMenuOpen;
  
  // Dynamic CSS classes based on the transparent state
  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
    isTransparent 
      ? 'bg-transparent border-transparent' 
      : 'bg-surface/90 backdrop-blur-md border-border shadow-sm'
  }`;

  const textClass = isTransparent ? 'text-white' : 'text-text-primary';
  const textSecondaryClass = isTransparent ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-accent';

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <Link to="/" className={`text-2xl font-serif font-black tracking-tight transition-colors ${textClass}`}>
            Inkwell
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#posts" className={`font-medium transition-colors ${textSecondaryClass}`} onClick={handleBrowsePostsClick}>
              Browse Posts
            </Link>
            
            <div className={`h-4 w-px transition-colors ${isTransparent ? 'bg-white/30' : 'bg-border'}`}></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 transition-colors font-medium cursor-pointer ${textClass}`}
                >
                  Hey, {user.username} <span className="text-xs">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg py-1 z-20">
                    <Link 
                      to="/account" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                    >
                      Account Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`transition-colors font-medium ${textSecondaryClass}`}>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    isTransparent 
                      ? 'bg-white text-gray-900 hover:bg-opacity-90' 
                      : 'bg-accent text-white hover:bg-opacity-90'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button 
            className={`md:hidden p-2 -mr-2 cursor-pointer transition-colors ${textClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* SVG Icon for hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-b border-border shadow-lg absolute top-16 left-0 right-0">
            <div className="flex flex-col px-6 py-4 space-y-4">
              <Link to="/#posts" className="text-text-primary font-medium text-lg" onClick={handleBrowsePostsClick}>
                Browse Posts
              </Link>
              <hr className="border-border" />
              {user ? (
                <>
                  <div className="text-text-secondary text-sm">Signed in as <span className="font-bold text-text-primary">{user.username}</span></div>
                  <Link to="/account" className="text-text-primary font-medium text-lg">
                    Account Settings
                  </Link>
                  <button onClick={handleLogout} className="text-left text-red-600 font-medium text-lg cursor-pointer">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-text-primary font-medium text-lg">
                    Login
                  </Link>
                  <Link to="/register" className="text-accent font-medium text-lg">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* 4. MAGIC SPACER: Because the navbar is 'fixed' now, it floats over the top 64px of the screen. 
             We add an invisible 64px box here to push content down ONLY when we are not on the Hero page! */}
      {!isHome && <div className="h-16"></div>}
    </>
  );
}