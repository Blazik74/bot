import React, { createContext, useState, useContext, useEffect } from 'react';
import { userApi } from '../api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await userApi.getProfile();
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
                setError(err);
                // Если токен невалидный, интерцептор в api.js должен будет его удалить
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    
    const refetchUser = async () => {
        setLoading(true);
        try {
            const response = await userApi.getProfile();
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to refetch user profile", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    const value = {
        user,
        setUser,
        loading,
        error,
        refetchUser,
        hasAccess: user?.has_access ?? false,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 