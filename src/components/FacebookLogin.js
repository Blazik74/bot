import React, { useState, useEffect } from 'react';
import { facebookAuth, authHelpers } from '../api';
import './FacebookLogin.css';

const FacebookLogin = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Проверяем состояние авторизации при загрузке компонента
  useEffect(() => {
    const authData = authHelpers.getAuthData();
    if (authData.user) {
      setUser(authData.user);
      if (onLoginSuccess) {
        onLoginSuccess(authData.user);
      }
    }
  }, [onLoginSuccess]);

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Получаем URL для авторизации
      const response = await facebookAuth.getAuthUrl();
      const authUrl = response.data.auth_url;

      // Открываем окно авторизации Facebook
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        'facebook-login',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      // Слушаем сообщения от popup окна
      const handleMessage = async (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'FACEBOOK_LOGIN_SUCCESS') {
          const { code } = event.data;
          
          try {
            // Обмениваем код на токен
            const loginResponse = await facebookAuth.callback(code);
            const { token, user: userData } = loginResponse.data;
            
            // Сохраняем данные авторизации
            authHelpers.setAuthData(token, userData);
            
            // Обновляем состояние компонента
            setUser(userData);
            
            // Закрываем popup
            if (popup) {
              popup.close();
            }
            
            // Убираем слушатель
            window.removeEventListener('message', handleMessage);
            
            // Вызываем callback
            if (onLoginSuccess) {
              onLoginSuccess(userData);
            }
            
          } catch (error) {
            console.error('Login error:', error);
            setError('Ошибка входа. Попробуйте еще раз.');
          } finally {
            setIsLoading(false);
          }
        } else if (event.data.type === 'FACEBOOK_LOGIN_ERROR') {
          setError('Ошибка авторизации через Facebook.');
          if (popup) {
            popup.close();
          }
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
        } else if (event.data.type === 'FACEBOOK_LOGIN_CANCELLED') {
          setError('Вход отменен пользователем.');
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Проверяем, закрылось ли окно
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          if (!user) {
            setIsLoading(false);
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Error getting auth URL:', error);
      setError('Ошибка получения URL авторизации.');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await facebookAuth.logout();
      authHelpers.clearAuthData();
      setUser(null);
      if (onLoginSuccess) {
        onLoginSuccess(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Ошибка выхода. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Если пользователь авторизован, показываем профиль
  if (user) {
    return (
      <div className="facebook-login-container">
        <div className="user-info">
          {user.picture && (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="user-avatar"
            />
          )}
          <div className="user-details">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p className="user-tariff">
              Тариф: {user.tariff_id === 1 ? 'Базовый' : 
                      user.tariff_id === 2 ? 'Профессиональный' : 'Бизнес'}
            </p>
            <p className="user-campaigns">
              Создано кампаний: {user.campaigns_created}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="facebook-logout-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Выход...' : 'Выйти'}
        </button>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем кнопку входа
  return (
    <div className="facebook-login-container">
      <button 
        onClick={handleFacebookLogin}
        className="facebook-login-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Вход...</span>
          </div>
        ) : (
          <>
            <svg className="facebook-icon" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Войти через Facebook</span>
          </>
        )}
      </button>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default FacebookLogin; 