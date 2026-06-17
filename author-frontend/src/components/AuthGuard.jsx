import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AuthGuard({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-text-secondary font-medium">Verifying access...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'AUTHOR') {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}