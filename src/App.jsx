import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReactorView from './views/ReactorView';

export default function App() {
  // Load stats from localStorage or set defaults
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('mentora_stats');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      hearts: 5,
      streak: 1
    };
  });

  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mentora_stats', JSON.stringify(stats));
  }, [stats]);

  return (
    <div className="app-container">
      {/* Main content pane - full width since Sidebar is removed */}
      <div className="main-content">
        {/* Statistics and Navigation header */}
        <Header activeView="reactor" stats={stats} />

        {/* View outlet - solely Cine Reactor */}
        <ReactorView />
      </div>
    </div>
  );
}
