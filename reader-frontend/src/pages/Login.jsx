import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function Login() {
  const location = useLocation();
  const successMessage = location.state?.successMessage;  
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to log in';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
                {/* Left Decorative Panel with Image (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col justify-center relative w-1/2 p-12 lg:p-16 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/login-bg.webp')` }}
          />
          <div className="absolute inset-0 z-0 bg-black/40" /> {/* Dark overlay to make text pop */}
          
          <div className="relative z-10 text-white drop-shadow-md">
            <h2 className="font-serif text-5xl font-black mb-6 leading-tight">Welcome back to Inkwell.</h2>
            <p className="text-xl text-white/90 font-medium">
              "Where stories find their voice, and readers find their home."
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-bold text-text-primary mb-8 text-center md:text-left">Log In</h2>
          
          {successMessage && !error && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-200">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-text-primary text-surface font-semibold py-3.5 rounded-full hover:bg-accent transition-colors disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center md:text-left text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-semibold">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}