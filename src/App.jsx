import React, { useState, useEffect } from 'react';
import { fetchGitHubProfile, fetchGitHubRepos, clearUserCache } from './utils/githubApi';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import ProjectGrid from './components/ProjectGrid';
import ProjectModal from './components/ProjectModal';
import ControlPanel from './components/ControlPanel';
import ContactForm from './components/ContactForm';
import CustomCursor from './components/CustomCursor';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Github = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function App() {
  // Load initial settings from localStorage if they exist
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('portfolio_github_username') || 'hn260';
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('portfolio_github_token') || '';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme') || 'dark';
  });
  const [showStats, setShowStats] = useState(() => {
    const val = localStorage.getItem('portfolio_show_stats');
    return val !== 'false';
  });
  const [showContact, setShowContact] = useState(() => {
    const val = localStorage.getItem('portfolio_show_contact');
    return val !== 'false';
  });

  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRepoReadme, setSelectedRepoReadme] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply configuration saves to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio_github_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('portfolio_github_token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('portfolio_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('portfolio_show_stats', showStats);
  }, [showStats]);

  useEffect(() => {
    localStorage.setItem('portfolio_show_contact', showContact);
  }, [showContact]);

  // Core profile and repository data fetching
  const loadData = async (user = username, tok = token, forceRefresh = false) => {
    setLoading(true);
    setError('');
    
    if (forceRefresh) {
      clearUserCache(user);
    }

    try {
      // Fetch profile and repos in parallel for fast loads
      const [profileData, reposData] = await Promise.all([
        fetchGitHubProfile(user, tok),
        fetchGitHubRepos(user, tok)
      ]);
      
      setProfile(profileData);
      setRepos(reposData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching GitHub data.');
      setProfile(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger load on mounting and configuration changes
  useEffect(() => {
    loadData();
  }, [username, token]);

  const handleManualRefresh = async (user = username, tok = token) => {
    setIsRefreshing(true);
    await loadData(user, tok, true);
    setIsRefreshing(false);
  };

  return (
    <>
      {/* Background visual components */}
      <CustomCursor />
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      {/* Top Navigation / Status Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        zIndex: 800,
        background: 'rgba(8, 12, 20, 0.4)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Github size={22} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: '700', 
            letterSpacing: '0.05em',
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}>
            {profile ? `${profile.name || profile.login} // PORTFOLIO` : 'DEV PORTFOLIO'}
          </span>
        </div>

        {/* Pulsing Sync Active Node */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block'
            }} />
            <span style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse 1.5s infinite',
              display: 'inline-block'
            }} />
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: '600', 
            color: '#10b981', 
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-code)'
          }}>
            GitHub Live Sync Active
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Error Alert Panel */}
        {error ? (
          <div className="container" style={{ marginTop: '7rem', marginBottom: '1rem' }}>
            <div className="glass-panel" style={{
              padding: '1.5rem 2rem',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.05)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: '#ef4444' }}>Sync Interrupted</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {error}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleManualRefresh(username, token)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                disabled={loading || isRefreshing}
              >
                <RefreshCw size={14} className={(loading || isRefreshing) ? 'spin-anim' : ''} style={{ marginRight: '0.25rem' }} />
                Retry Sync
              </button>
            </div>
          </div>
        ) : null}

        {/* Profile Header */}
        <Header profile={profile} loading={loading} />

        {/* Statistics Dashboard */}
        {showStats && (
          <StatsDashboard repos={repos} loading={loading} />
        )}

        {/* Repositories Project Grid */}
        <ProjectGrid 
          repos={repos} 
          loading={loading}
          onViewReadme={(name) => setSelectedRepoReadme(name)}
        />

        {/* Contact Form Section */}
        {showContact && (
          <ContactForm />
        )}

        {/* Control Panel Drawer */}
        <ControlPanel 
          username={username}
          setUsername={setUsername}
          token={token}
          setToken={setToken}
          theme={theme}
          setTheme={setTheme}
          showStats={showStats}
          setShowStats={setShowStats}
          showContact={showContact}
          setShowContact={setShowContact}
          onRefresh={handleManualRefresh}
        />

        {/* README markdown modal */}
        {selectedRepoReadme && (
          <ProjectModal 
            repoName={selectedRepoReadme}
            username={username}
            token={token}
            onClose={() => setSelectedRepoReadme(null)}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer style={{
        borderTop: '1px solid var(--panel-border)',
        padding: '2rem 0',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            &copy; {new Date().getFullYear()} • Dynamic Developer Portfolio • Built via Antigravity AI
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time synchronization pulls live repository stats directly from GitHub.
          </p>
        </div>
      </footer>

      {/* Pulse keyframe & global overrides */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
