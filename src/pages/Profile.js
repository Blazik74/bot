import React from 'react';
import styled, { useTheme } from 'styled-components';

// Примерные данные пользователя (замени на реальные из стора/контекста)
const user = {
  avatar: 'https://i.pravatar.cc/120',
  name: 'Иван Иванов',
  username: 'ivan_ivanov',
};

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  padding: 0 0 40px 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 36px 0 24px 0;
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const Username = styled.div`
  font-size: 16px;
  color: #888;
  margin-top: 4px;
`;

const Section = styled.div`
  margin: 0 16px 24px 16px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const TariffBlock = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#F6F8FA'};
  border-radius: 14px;
  padding: 18px 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  cursor: default;
`;

const Profile = () => {
  const theme = useTheme().theme || 'light';
  return (
    <Container theme={theme}>
      <ProfileHeader>
        <Avatar src={user.avatar} alt={user.name} />
        <Name theme={theme}>{user.name}</Name>
        <Username>@{user.username}</Username>
      </ProfileHeader>
      <Section>
        <SectionTitle theme={theme}>Ваш тариф</SectionTitle>
        <TariffBlock theme={theme}>Фрилансер (50 000₸/мес)</TariffBlock>
      </Section>
      {/* Здесь можно добавить другие секции профиля */}
    </Container>
  );
};

export default Profile;
