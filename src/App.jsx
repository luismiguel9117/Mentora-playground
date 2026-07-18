// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ReactorView from './views/ReactorView';
import ConfigView from './views/ConfigView';
import SubtitleEditor from './components/SubtitleEditor';

function AppContent({ stats }) {
  const location = useLocation();
  // Hide the global Header navigation bar on any path under /config
  const showHeader = !location.pathname.startsWith('/config');

  return (
    <div className="app-container">
      {/* Main content pane */}
      <div className="main-content">
        {/* Statistics and Navigation header (conditionally rendered) */}
        {showHeader && <Header activeView="reactor" stats={stats} />}
        <Routes>
          <Route path="/" element={<ReactorView />} />
          <Route path="/config" element={<ConfigView />} />
          <Route path="/config/editor/:videoId" element={<SubtitleEditor />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  // Load stats from localStorage or set defaults
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('mentora_stats');
    return saved ? JSON.parse(saved) : { xp: 0, hearts: 5, streak: 1 };
  });

  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mentora_stats', JSON.stringify(stats));
  }, [stats]);

  return (
    <BrowserRouter>
      <AppContent stats={stats} />
    </BrowserRouter>
  );
}
