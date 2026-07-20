import React from 'react';

export default function Header() {
  return (
    <div style={{ width: '100%' }}>
      {/* Main Navbar */}
      <header className="top-header">
        {/* Center: Brand Logo */}
        <div className="top-header-center" title="Mentora Home">
          <img
            src="/assets/logo.png"
            alt="Mentora"
          />
        </div>
      </header>
    </div>
  );
}
