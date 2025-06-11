import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { BottomNavBar } from './components/BottomNavBar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Router>
        <AppRoutes />
        <BottomNavBar />
      </Router>
    </div>
  );
}

export default App;
