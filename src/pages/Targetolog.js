import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import useStore from '../store';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 32px 16px;
  transition: background 0.3s;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 24px;
  transition: color 0.3s;
`;

const NewCampaignButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.button};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  &:hover {
    opacity: 0.9;
  }
`;

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  transition: background 0.3s;
`;

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const Select = styled.select`
  padding: 8px 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
  &::placeholder {
    color: ${({ theme }) => theme.text}80;
  }
`;

const CampaignsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CampaignCard = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 16px;
  transition: background 0.3s;
`;

const CampaignHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CampaignName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s;
`;

const CampaignStatus = styled.p`
  font-size: 14px;
  color: ${({ active }) => active ? '#1BC47D' : '#FFB800'};
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const StatItem = styled.div`
  text-align: right;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 4px;
  transition: color 0.3s;
`;

const StatValue = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s;
`;

export const Targetolog = () => {
  const { theme } = useTheme();
  const campaigns = useStore((state) => state.campaigns);

  return (
    <Container theme={theme}>
      <Title theme={theme}>Targetolog</Title>
      <NewCampaignButton theme={theme}>New Campaign</NewCampaignButton>
      
      <FiltersContainer theme={theme}>
        <FiltersRow>
          <Select theme={theme}>
            <option>All Status</option>
            <option>Active</option>
            <option>Paused</option>
          </Select>
          <Select theme={theme}>
            <option>All Platforms</option>
            <option>Facebook</option>
            <option>Instagram</option>
          </Select>
          <SearchInput theme={theme} placeholder="Search campaigns..." />
        </FiltersRow>
      </FiltersContainer>

      <CampaignsList>
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            theme={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CampaignHeader>
              <div>
                <CampaignName theme={theme}>{campaign.name}</CampaignName>
                <CampaignStatus active={campaign.status === 'active'}>
                  {campaign.status}
                </CampaignStatus>
              </div>
              <StatsContainer>
                <StatItem>
                  <StatLabel theme={theme}>CTR</StatLabel>
                  <StatValue theme={theme}>{campaign.stats.ctr.toFixed(2)}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel theme={theme}>CPC</StatLabel>
                  <StatValue theme={theme}>${campaign.stats.cpc.toFixed(2)}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel theme={theme}>CPM</StatLabel>
                  <StatValue theme={theme}>${campaign.stats.cpm.toFixed(2)}</StatValue>
                </StatItem>
              </StatsContainer>
            </CampaignHeader>
          </CampaignCard>
        ))}
      </CampaignsList>
    </Container>
  );
}; 
