import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return; 
    }

    setIsLoading(true);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      navigate('/login', { state: { successMessage: 'Registration successful! Please log in.' } });
    } catch (err) {
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to register';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row-reverse bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
                {/* Decorative Panel with Image (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col justify-center relative w-1/2 p-12 lg:p-16 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/register-bg.jpg')` }}
          />
          <div className="absolute inset-0 z-0 bg-black/50" /> {/* Slightly darker overlay here */}
          
          <div className="relative z-10 text-white drop-shadow-md">
            <h2 className="font-serif text-5xl font-black mb-6 leading-tight">Join the conversation.</h2>
            <p className="text-xl text-white/90 font-medium">
              "Read independently. Write fearlessly."
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-bold text-text-primary mb-8 text-center md:text-left">Create Account</h2>

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

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-text-primary text-surface font-semibold py-3.5 rounded-full hover:bg-accent transition-colors disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center md:text-left text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-semibold">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}