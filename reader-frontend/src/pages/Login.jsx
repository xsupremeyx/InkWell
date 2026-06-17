import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function Login() {
  // 0. useLocation succes message
  const location = useLocation();
  const successMessage = location.state?.successMessage;  
  // 1. Local state for our form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. State for handling loading and errors
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 3. Get the login function from our global loudspeaker
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from refreshing the page
    setError(null);
    setIsLoading(true);

    try {
      // Use our custom fetch wrapper to talk to the backend
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      // If we get here, it was a 200 OK!
      // Update our global context (which also saves to localStorage)
      login(data.token, data.user);
      
      // Redirect to the home page
      navigate('/');
    } catch (err) {
      // If our client.js threw an error, catch it here
      // Try to get the first specific field error, or fall back to the general message
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to log in';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-surface p-8 rounded-xl shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-6">Welcome Back</h2>
      {/* Show green success box if they just registered */}
      {successMessage && !error && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm border border-green-200">
          {successMessage}
        </div>
      )}
      {/* Show red error box if something goes wrong */}
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-white font-medium py-2 rounded-md hover:bg-opacity-90 transition disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
}