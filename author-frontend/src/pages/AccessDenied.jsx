import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AccessDenied() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background">
            <h1 className="text-9xl font-serif font-black text-border mb-4">403</h1>
            <h2 className="text-4xl font-serif font-bold text-text-primary mb-4">Access Denied</h2>
            
            <p className="text-xl text-text-secondary mb-10 max-w-md leading-relaxed">
                This portal is exclusively for authors. Your account does not have author access.
            </p>
            
            <button
                onClick={handleLogout}
                className="px-8 py-3 bg-text-primary text-surface rounded-full font-semibold hover:bg-accent transition-colors cursor-pointer"
            >
                Log out & Return
            </button>
        </div>
    );
}