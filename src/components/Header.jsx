import React from 'react';

export default function Header() {
  return (
    <div style={{ width: '100%' }}>
      {/* Promo Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #0b0f19 0%, #0ea5e9 100%)',
        color: '#ffffff',
        padding: '8px 2rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#fbbf24', color: '#0b0f19', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>50% DCTO</span>
          <span>PRECIO LANZAMIENTO: Inglés desde S/2.66 al día</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ opacity: 0.8 }}>TIEMPO LIMITADO</span>
          <span style={{ background: '#0b0f19', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>01 : 24 : 53</span>
        </div>
        <span style={{ color: '#fbbf24' }}>¡Empieza hoy! Precio especial por lanzamiento</span>
      </div>

      {/* Main Navbar */}
      <header className="top-header" style={{
        height: '80px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
      }}>
        {/* Left Side: Brand Logo and links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {/* Logo "mentora" lowercase Outfit */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} title="Mentora Home">
            <svg viewBox="0 0 295 80" width="135" height="36">
              <g fill="#4f46e5">
                <path d="M15,68 V32 c0,-9.4 7.6,-17 17,-17 s17,7.6 17,17 v36 h-8 V32 c0,-5 -4,-9 -9,-9 s-9,4 -9,9 v36 h-8 V32 c0,-5 -4,-9 -9,-9 s-9,4 -9,9 v36 h-8 Z" />
                <path d="M97,33 c-9.4,0 -17,7.6 -17,17 s7.6,17 17,17 c7.5,0 13.9,-4.8 16.1,-11.5 h-8.8 c-1.4,2.2 -3.8,3.5 -6.5,3.5 c-5,0 -9,-4 -9,-9 h25.4 c0.1,-0.6 0.1,-1.2 0.1,-1.8 C114,40.6 106.4,33 97,33 Z M88.2,46.5 c0.5,-4 3.9,-7 7.8,-7 s7.3,3 7.8,7 Z" />
                <path d="M119,68 V32 c0,-9.4 7.6,-17 17,-17 s17,7.6 17,17 v36 h-8 V32 c0,-5 -4,-9 -9,-9 s-9,4 -9,9 v36 h-8 Z" />
                <path d="M161,20 L161,24 H153 V32 H161 V56 c0,6.6 5.4,12 12,12 h6 V60 h-6 c-2.2,0 -4,-1.8 -4,-4 V32 H177 V24 H169 V14 Z" />
                <path d="M197,33 c-9.4,0 -17,7.6 -17,17 s7.6,17 17,17 s17,-7.6 17,-17 S206.4,33 197,33 Z M197,41 c5,0 9,4 9,9 s-4,9 -9,9 s-9,-4 -9,-9 S192,41 197,41 Z" />
                <path d="M219,68 V32 c0,-9.4 7.6,-17 17,-17 h4 v8 h-4 c-5,0 -9,4 -9,9 v36 h-8 Z" />
                <path d="M262,33 c-9.4,0 -17,7.6 -17,17 s7.6,17 17,17 c5.1,0 9.6,-2.2 12.7,-5.7 V68 h8 V32 h-8 v3.5 C271.6,35.2 267.1,33 262,33 Z M262,41 c5,0 9,4 9,9 s-4,9 -9,9 s-9,-4 -9,-9 S257,41 262,41 Z" />
              </g>
            </svg>
          </div>

          <nav style={{ display: 'flex', gap: '1.5rem', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 500 }}>
            <span style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }}>Inicio</span>
            <span style={{ color: '#475569', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#4f46e5'} onMouseLeave={(e) => e.target.style.color = '#475569'}>Cómo funciona</span>
            <span style={{ color: '#475569', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#4f46e5'} onMouseLeave={(e) => e.target.style.color = '#475569'}>Planes</span>
          </nav>
        </div>

        {/* Center: Search input bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="¿Qué quieres aprender hoy?"
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              backgroundColor: '#f8fafc',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4f46e5';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Right Side: Log In and Join Now buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
          {/* Cart Icon */}
          <span style={{ cursor: 'pointer', opacity: 0.7 }} title="Carrito">🛒</span>
          
          {/* User Profile Icon */}
          <span style={{ cursor: 'pointer', opacity: 0.7 }} title="Perfil">👤</span>

          <span style={{
            color: '#4f46e5',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}>
            Iniciar Sesión
          </span>

          <button className="btn-3d btn-primary" style={{
            padding: '10px 24px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderRadius: '9999px',
            border: 'none',
            background: '#4f46e5',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #312e81',
            transition: 'transform 0.1s, box-shadow 0.1s'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(4px)';
            e.target.style.boxShadow = '0 0px 0 transparent';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 0 #312e81';
          }}
          >
            Únete ahora
          </button>
        </div>
      </header>
    </div>
  );
}
