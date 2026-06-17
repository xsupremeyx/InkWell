import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // <-- New state
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // <-- New Client-Side Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return; 
    }

    setIsLoading(true);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        // Notice we DO NOT send confirmPassword to the backend! 
        // The API only expects username and password.
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
    <div className="max-w-md mx-auto mt-12 bg-surface p-8 rounded-xl shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-6">Create an Account</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* <-- New Confirm Password Input --> */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-white font-medium py-2 rounded-md hover:bg-opacity-90 transition disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}