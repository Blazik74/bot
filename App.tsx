import { useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Campaigns from './Campaigns';
import Upload from './Upload';
import Navigation from './Navigation';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #F5F5F5;
  color: #333;
  font-family: 'Inter', sans-serif;
`;

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    // Expand to full screen
    WebApp.expand();
  }, []);

  return (
    <Router>
      <AppContainer>
        <Navigation />
        <Routes>
          <Route path="/" element={<Campaigns />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App; 