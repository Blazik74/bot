import React, { createContext, useState, useContext, useEffect } from 'react';
import { userApi, telegramAuth } from '../api';

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

    // Проверяем, запущено ли приложение в Telegram WebApp
    useEffect(() => {
        const initTelegramAuth = async () => {
            // Проверяем, есть ли уже токен
            const token = localStorage.getItem('authToken');
            if (token) {
                return;
            }

            // Проверяем, запущено ли приложение в Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
                try {
                    const initData = window.Telegram.WebApp.initData;
                    if (initData) {
                        setLoading(true);
                        const response = await telegramAuth.login(initData);
                        const { token, user: userData } = response.data;
                        
                        // Сохраняем токен и данные пользователя
                        localStorage.setItem('authToken', token);
                        setUser(userData);
                    }
                } catch (err) {
                    console.error("Telegram auth failed:", err);
                    setError(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initTelegramAuth();
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
    }, []);

    useEffect(() => {
        if (user) {
            console.log('USER DEBUG:', user);
        }
    }, [user]);
    
    const refetchUser = async () => {
        // Не обновляем, если токена нет
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
        canAccessApp: (() => {
            const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
            const hasAccess = user?.has_access === true;
            const hasPaidTariff = user?.tariff && user?.tariff.id > 1;
            
            const canAccess = isAdmin || hasAccess || hasPaidTariff;
            
            console.log('Access Debug:', {
                user: user?.id,
                role: user?.role,
                isAdmin,
                hasAccess,
                tariffId: user?.tariff?.id,
                tariffName: user?.tariff?.name,
                hasPaidTariff,
                canAccess
            });
            
            return canAccess;
        })(),
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 
