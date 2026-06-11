import React, { useState } from 'react';
import { Settings, X, Sliders, Moon, Sun, Check, RefreshCw } from 'lucide-react';

export default function ControlPanel({ 
  username, 
  setUsername, 
  token, 
  setToken, 
  theme, 
  setTheme, 
  showStats, 
  setShowStats,
  showContact,
  setShowContact,
  onRefresh
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempToken, setTempToken] = useState(token);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      setUsername(tempUsername);
      setToken(tempToken);
      if (onRefresh) {
        await onRefresh(tempUsername, tempToken);
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const themes = [
    { id: 'dark', name: 'Dark Space', desc: 'Sleek, deep-space slate and neon blue details.' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Vibrant pinks, neon cyans, and dark violet haze.' },
    { id: 'solarized', name: 'Solarized Light', desc: 'Warm cream paper aesthetic with teal and blue tones.' }
  ];

  return (
    <>
      {/* Floating Settings Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary btn-icon"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 900,
          background: 'var(--panel-bg)',
          borderColor: 'var(--panel-border)',
          boxShadow: 'var(--card-shadow)',
        }}
        aria-label="Open Site Customizer"
      >
        <Settings size={20} className={isOpen ? 'spin-anim' : ''} />
      </button>

      {/* Control Panel Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s forwards'
          }}
        />
      )}

      {/* Drawer Container */}
      <div 
        className="glass-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          zIndex: 1001,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px 0 0 16px',
          borderLeft: '1px solid var(--panel-border)',
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sliders size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3>Site Control Center</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div style={{
          padding: '1.5rem',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* GitHub Config Section */}
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4>GitHub Settings</h4>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                GitHub Username
              </label>
              <input 
                type="text" 
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none'
                }}
                placeholder="e.g. octocat"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Personal Access Token (Optional)
              </label>
              <input 
                type="password" 
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none'
                }}
                placeholder="ghp_..."
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Bypasses rate limiting and displays private repositories. Stored strictly client-side.
              </span>
            </div>

            <button 
              type="submit" 
              disabled={isUpdating}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {isUpdating ? <RefreshCw className="spin-anim" size={16} /> : 'Sync Profile'}
            </button>
          </form>

          {/* Theme Switcher */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Active Theme</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    document.documentElement.setAttribute('data-theme', t.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '10px',
                    background: theme === t.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
                    border: theme === t.id ? '1px solid var(--accent-primary)' : '1px solid var(--panel-border)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t.desc}</div>
                  </div>
                  {theme === t.id && (
                    <Check size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Controls */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Visible Components</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.95rem' }}>Language & Repository Statistics</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showContact}
                  onChange={(e) => setShowContact(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.95rem' }}>Contact Drawer / Feedback</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--panel-border)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          Powered by GitHub API • Antigravity UI
        </div>
      </div>

      {/* Spin animation CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </>
  );
}
