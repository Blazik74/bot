import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { facebookAuth } from '../api';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: sans-serif;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: #333;
`;

const ErrorMessage = styled(Message)`
  color: #d93025;
`;

const FacebookCallback = () => {
  const [message, setMessage] = useState('Обработка авторизации...');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (params.get('error')) {
      setError('Авторизация через Facebook не удалась. Попробуйте снова.');
      setTimeout(() => navigate('/profile'), 3000);
      return;
    }

    if (!code) {
      setError('Код авторизации не найден.');
      setTimeout(() => navigate('/profile'), 3000);
      return;
    }

    facebookAuth.callback(code)
      .then(response => {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setMessage('Авторизация прошла успешно! Перенаправление в профиль...');
        navigate('/profile');
      })
      .catch(err => {
        console.error('Facebook callback error:', err);
        setError('Не удалось обменять код на токен доступа. Попробуйте снова.');
        setTimeout(() => navigate('/profile'), 3000);
      });

  }, [location, navigate]);

  return (
    <Container>
      <Spinner />
      {error ? <ErrorMessage>{error}</ErrorMessage> : <Message>{message}</Message>}
    </Container>
  );
};

export default FacebookCallback; 