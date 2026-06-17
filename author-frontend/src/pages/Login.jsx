import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            // If the user isn't an author, explicitly reject them!
            if (data.user.role !== 'AUTHOR') {
                logout(); // ensure they aren't saving the token
                setError("This portal is for authors only. Your account does not have author access.");
                return;
            }

            // Otherwise, log them in!
            login(data.token, data.user);
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.errors?.[0]?.message || err.message || 'Login failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
                {/* Decorative Image Panel */}
                <div className="hidden md:flex flex-col justify-center relative w-1/2 p-12 overflow-hidden">
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url('/login-bg.webp')` }}
                    />
                    <div className="absolute inset-0 z-0 bg-black/40" />
                    <div className="relative z-10 text-white">
                        <h2 className="font-serif text-5xl font-black mb-4 leading-tight">Welcome Back, Author.</h2>
                        <p className="text-lg opacity-90">Sign in to manage your posts and publish new stories.</p>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-serif font-bold text-text-primary mb-2">Sign In</h1>
                        <p className="text-text-secondary">Enter your credentials to access the author dashboard.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-text-primary text-surface font-semibold py-3.5 rounded-full hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer mt-4"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}