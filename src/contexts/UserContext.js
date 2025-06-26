import React, { createContext, useState, useContext, useEffect } from 'react';
import { userApi, telegramAuth } from '../api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Эта функция теперь единственный источник для загрузки профиля
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await userApi.getProfile();
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch user profile", err);
            setError(err);
            // Токен может быть невалидным, интерцептор в api.js его удалит
        } finally {
            setLoading(false);
        }
    };

    // Основной хук для инициализации
    useEffect(() => {
        const initializeAuth = async () => {
            let token = localStorage.getItem('authToken');

            // Если токена нет, пробуем получить его через Telegram
            if (!token && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
                try {
                    setLoading(true);
                    const initData = window.Telegram.WebApp.initData;
                    const response = await telegramAuth.login(initData);
                    token = response.data.token; // Получаем токен
                    localStorage.setItem('authToken', token);
                } catch (err) {
                    console.error("Telegram auth failed:", err);
                    setError(err);
                    setLoading(false);
                    return; // Прерываем выполнение если авторизация в ТГ не удалась
                }
            }

            // Если после всех проверок есть токен, загружаем профиль
            if (token) {
                await fetchUserProfile();
            } else {
                // Если токена нет и мы не в ТГ, просто заканчиваем загрузку
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Хук для обновления данных при возвращении на вкладку
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchUserProfile(); // Используем ту же функцию
            }
        };

        const handleFocus = () => {
            fetchUserProfile(); // Используем ту же функцию
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []); // Зависимости не нужны, т.к. fetchUserProfile не меняется

    useEffect(() => {
        if (user) {
            console.log('USER DEBUG:', user);
        }
    }, [user]);
    
    // refetchUser теперь просто псевдоним для fetchUserProfile
    const refetchUser = fetchUserProfile;

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
