import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';
import BottomNavigation from '../components/BottomNavigation';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 80px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: ${({ theme }) => theme.card};
  margin-bottom: 18px;
`;

const Nickname = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 18px;
`;

const InfoBlock = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  margin: 0 16px 18px 16px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child { border-bottom: none; }
`;

const InfoTitle = styled.div`
  flex: 0 0 110px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  padding-left: 18px;
`;

const InfoValue = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  padding-right: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TariffButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  font-weight: 400;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ArrowAnim = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
`;

const Arrow = styled.span`
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  transform: ${({ open }) => open ? 'rotate(180deg)' : 'rotate(90deg)'};
`;

const FacebookButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  padding: 16px;
  background: #1877F3;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s;
  box-shadow: none;
  &:hover {
    background: #166fe0;
  }
`;

const FacebookIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

const LogoutButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWindow = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 32px 18px 0 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 18px;
`;

const ModalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 20px;
  font-weight: 600;
  margin: 18px 0 18px 0;
  cursor: pointer;
`;

const MegaphoneIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 18px;
`;

const ModalText = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 18px;
`;

const ModalList = styled.ul`
  text-align: left;
  margin: 0 0 18px 0;
  padding-left: 18px;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
`;

export default function Profile() {
  const [tgUser, setTgUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeContext();
  const themeObj = themes[theme];

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowThemeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeDropdown(false);
  };

  const avatar = tgUser?.photo_url || '';
  const nickname = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'Имя пользователя';
  const tariff = tgUser?.tariff || 'Фрилансер';

  return (
    <Container theme={themeObj}>
      <ProfileHeader>
        <Avatar src={avatar || ''} alt={nickname} theme={themeObj} />
        <Nickname theme={themeObj}>{nickname}</Nickname>
      </ProfileHeader>
      <InfoBlock theme={themeObj}>
        <InfoRow theme={themeObj}>
          <InfoTitle theme={themeObj}>Аккаунт</InfoTitle>
          <InfoValue theme={themeObj}>{username}</InfoValue>
        </InfoRow>
        <InfoRow theme={themeObj}>
          <InfoTitle theme={themeObj}>Тариф</InfoTitle>
          <InfoValue theme={themeObj}>
            <TariffButton theme={themeObj} onClick={() => navigate('/tariffs')}>{tariff} <span style={{fontSize:20,marginLeft:4}}>&#8250;</span></TariffButton>
          </InfoValue>
        </InfoRow>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',height:48,borderBottom:`1px solid ${themeObj.border}`,cursor:'pointer'}} onClick={()=>setShowModal('theme')}>
            <div style={{flex:'0 0 110px',fontWeight:700,color:themeObj.text,fontSize:16,paddingLeft:18}}>Тема</div>
            <div style={{flex:1,textAlign:'right',fontWeight:400,color:themeObj.text,fontSize:16,paddingRight:18,display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              {theme === 'dark' ? 'Тёмная' : 'Светлая'}
              <svg width="18" height="18" style={{marginLeft:8,transform:showModal==='theme'?'rotate(90deg)':'rotate(0deg)',transition:'transform 0.22s'}} viewBox="0 0 20 20" fill="none"><path d="M8 6L12 10L8 14" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          {showModal==='theme' && (
            <div style={{position:'absolute',top:48,right:0,left:0,background:themeObj.card,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',overflow:'hidden',zIndex:2000}}>
              <div style={{padding:'12px 16px',cursor:'pointer',color:themeObj.text,fontSize:15,display:'flex',alignItems:'center',gap:8}} onClick={()=>{setTheme('light');setShowModal(false);}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:'#000',border:`2px solid ${themeObj.border}`}} />
                Светлая
              </div>
              <div style={{padding:'12px 16px',cursor:'pointer',color:themeObj.text,fontSize:15,display:'flex',alignItems:'center',gap:8}} onClick={()=>{setTheme('dark');setShowModal(false);}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:'#fff',border:`2px solid ${themeObj.border}`}} />
                Тёмная
              </div>
            </div>
          )}
        </div>
      </InfoBlock>
      <FacebookButton onClick={() => setShowModal(true)}>
        <FacebookIcon src={facebookIcon} alt="Facebook" />
        Подключить Facebook Ads Account
      </FacebookButton>
      <LogoutButton theme={themeObj}>Выйти</LogoutButton>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalWindow theme={themeObj} onClick={e => e.stopPropagation()} style={{padding:0}}>
            <div style={{background:'#005EFF',borderRadius:'16px 16px 0 0',display:'flex',justifyContent:'center',alignItems:'center',height:90}}>
              <img src={megaphoneIcon} alt="Megaphone" style={{width:44,height:44}} />
            </div>
            <div style={{padding:'28px 18px 0 18px'}}>
              <div style={{fontSize:24,fontWeight:700,color:'#222',marginBottom:18}}>Подключение рекламного аккаунта</div>
              <div style={{fontSize:16,color:'#222',textAlign:'center',marginBottom:18}}>
                Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.
              </div>
              <ul style={{color:'#222',fontSize:16,marginBottom:32,paddingLeft:0,textAlign:'left',listStyle:'none'}}>
                <li style={{position:'relative',paddingLeft:18,marginBottom:8}}><span style={{position:'absolute',left:0,top:8,width:6,height:6,borderRadius:'50%',background:'#222',display:'inline-block'}}></span>Использовать ИИ автопилот</li>
                <li style={{position:'relative',paddingLeft:18,marginBottom:8}}><span style={{position:'absolute',left:0,top:8,width:6,height:6,borderRadius:'50%',background:'#222',display:'inline-block'}}></span>Получать советы и диагностику от ИИ</li>
                <li style={{position:'relative',paddingLeft:18,marginBottom:8}}><span style={{position:'absolute',left:0,top:8,width:6,height:6,borderRadius:'50%',background:'#222',display:'inline-block'}}></span>Просматривать метрики</li>
                <li style={{position:'relative',paddingLeft:18,marginBottom:8}}><span style={{position:'absolute',left:0,top:8,width:6,height:6,borderRadius:'50%',background:'#222',display:'inline-block'}}></span>Загружать креативы</li>
              </ul>
              <button style={{background:'#005EFF',color:'#fff',border:'none',borderRadius:10,padding:'16px 0',width:'100%',maxWidth:340,fontSize:17,fontWeight:600,cursor:'pointer',margin:'0 auto',display:'block',marginTop:18}} onClick={()=>setShowModal(false)}>Подключить рекламный аккаунт</button>
            </div>
          </ModalWindow>
        </ModalOverlay>
      )}
      <BottomNavigation activeTab="/profile" />
    </Container>
  );
} 
