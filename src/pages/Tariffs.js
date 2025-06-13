import React, { useState } from 'react';
import styled from 'styled-components';
import useStore from '../store';
import profileGreyIcon from '../assets/icons/profile-grey.svg';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 32px 0;
`;

const AvatarCircle = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 16px auto;
`;

const AvatarImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.div`
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
`;

const TariffBlock = styled.div`
  font-size: 15px;
  color: #949CA9;
  text-align: center;
  margin-bottom: 24px;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const Section = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto 24px auto;
  background: #F6F6F6;
  border-radius: 14px;
  padding: 20px 20px 12px 20px;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ThemeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ThemeSelect = styled.select`
  font-size: 15px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #E5E8EB;
  background: #fff;
  color: #222;
`;

const FacebookButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 32px 24px 24px 24px;
  max-width: 360px;
  width: 100%;
  text-align: center;
`;

const MegaphoneCircle = styled.div`
  width: 81px;
  height: 81px;
  border-radius: 50%;
  background: #005EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
`;

const MegaphoneIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const ModalText = styled.div`
  font-size: 16px;
  color: #222;
  margin-bottom: 18px;
`;

const ModalList = styled.ul`
  text-align: left;
  margin: 0 0 24px 0;
  padding-left: 18px;
  color: #222;
  font-size: 16px;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const Profile = () => {
  const user = useStore((state) => state.user) || { username: 'User', avatar: '', tariff: null };
  const setTheme = useStore((state) => state.setTheme);
  const theme = useStore((state) => state.theme);
  const [modal, setModal] = useState(false);

  return (
    <Container>
      <AvatarCircle>
        {user.avatar ? (
          <AvatarImg src={user.avatar} alt="avatar" />
        ) : (
          <img src={profileGreyIcon} alt="avatar" width={64} height={64} />
        )}
      </AvatarCircle>
      <Username>{user.username || 'User'}</Username>
      <TariffBlock onClick={() => window.location.href = '/tariffs'}>
        {user.tariff === 'company' ? 'Компания' : user.tariff === 'freelancer' ? 'Фрилансер' : 'Нет'}
      </TariffBlock>
      <Section>
        <SectionTitle>Тема</SectionTitle>
        <ThemeRow>
          <span>Выберите тему:</span>
          <ThemeSelect value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Белая</option>
            <option value="dark">Темная</option>
          </ThemeSelect>
        </ThemeRow>
        <FacebookButton onClick={() => setModal(true)}>
          Подключить Facebook
        </FacebookButton>
      </Section>
      {modal && (
        <ModalOverlay onClick={() => setModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <MegaphoneCircle>
              {/* Здесь должен быть SVG громкоговорителя */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#005EFF"/>
                <path d="M27.5 18.5V21.5C27.5 22.0523 27.0523 22.5 26.5 22.5H24.5V25.5C24.5 26.0523 24.0523 26.5 23.5 26.5H16.5C15.9477 26.5 15.5 26.0523 15.5 25.5V14.5C15.5 13.9477 15.9477 13.5 16.5 13.5H23.5C24.0523 13.5 24.5 13.9477 24.5 14.5V17.5H26.5C27.0523 17.5 27.5 17.9477 27.5 18.5Z" fill="white"/>
              </svg>
            </MegaphoneCircle>
            <ModalTitle>Подключение рекламного аккаунта</ModalTitle>
            <ModalText>Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.</ModalText>
            <ModalText>Это позволяет вам:</ModalText>
            <ModalList>
              <li>Использовать ИИ автопилот</li>
              <li>Получать советы и диагностику от ИИ</li>
              <li>Просматривать метрики</li>
              <li>Загружать креативы</li>
            </ModalList>
            <ModalButton onClick={() => setModal(false)}>
              Подключить рекламный аккаунт
            </ModalButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Profile; 
