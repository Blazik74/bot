import React, { createContext, useState, useContext, useEffect } from 'react';
import { userApi, telegramAuth } from '../api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
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

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (token) {
                await fetchUser();
                setLoading(false);
                return;
            }

            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
                try {
                    const initData = window.Telegram.WebApp.initData;
                    const response = await telegramAuth.login(initData);
                    const { token: newToken } = response.data;
                    
                    localStorage.setItem('authToken', newToken);
                    
                    // После получения токена, загружаем профиль
                    await fetchUser();
                } catch (err) {
                    console.error("Telegram auth failed:", err);
                    setError(err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Если мы не в телеграме и токена нет, просто заканчиваем загрузку
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    useEffect(() => {
        // Добавляем слушатели событий, чтобы обновлять данные пользователя,
        // когда он возвращается на вкладку.
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refetchUser();
            }
        };

        const handleFocus = () => {
            refetchUser();
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        // Убираем слушатели при размонтировании компонента
        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            console.log('USER DEBUG:', user);
        }
    }, [user]);
    
    const refetchUser = async () => {
        if (!localStorage.getItem('authToken')) {
            setLoading(false);
            return;
        }
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
        canAccessApp: Boolean(
            user && (
                user.role === 'admin' ||
                user.role === 'superadmin' ||
                user.has_access === true ||
                (user.tariff && user.tariff.id > 1)
            )
        ),
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 
