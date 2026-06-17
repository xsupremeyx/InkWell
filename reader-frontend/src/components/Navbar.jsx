import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo/Site Name */}
        <Link to="/" className="text-xl font-bold text-text-primary">
          Inkwell
        </Link>

        {/* Right Side Nav */}
        <div className="flex items-center gap-6">
          <Link to="/#posts" className="text-text-secondary hover:text-accent font-medium transition-colors">
            Browse Posts
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <Link to="/login" className="text-text-secondary hover:text-text-primary transition-colors">
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-accent text-surface px-4 py-2 rounded-md hover:bg-opacity-90 transition-opacity"
          >
            Register
          </Link>
        </div>

      </div>
    </nav>
  );
}