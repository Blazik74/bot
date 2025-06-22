import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LockIcon = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  background-color: #f0f2f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 32px;
    height: 32px;
    fill: #333;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #818c99;
  margin-bottom: 24px;
  line-height: 1.4;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  color: #007bff;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;


const FeatureLockModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectTariff = () => {
    navigate('/tariffs');
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <LockIcon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3z"/></svg>
        </LockIcon>
        <Title>Функция недоступна</Title>
        <Description>
          Чтобы воспользоваться ИИ-таргетологом, выберете подходящий тариф. Вы получите доступ к загрузке креативов, автопилоту и рекомендациям от ИИ.
        </Description>
        <PrimaryButton onClick={handleSelectTariff}>Выбрать тариф</PrimaryButton>
        <SecondaryButton onClick={onClose}>Позже</SecondaryButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FeatureLockModal; 