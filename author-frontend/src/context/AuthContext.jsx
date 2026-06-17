import { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            setLoading(false);
            return;
        }

        apiFetch('/auth/me')
            .then((data) => {
                setUser(data.user);
            })
            .catch((err)=> {
                console.error("Session failed:", err);
                localStorage.removeItem("token");
            })
            .finally(() => setLoading(false));
    }, []);

    const login = ( token, userData) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}