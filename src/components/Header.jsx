import { MapPin, Link as LinkIcon, Users, BookOpen, Briefcase } from 'lucide-react';

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

const Twitter = ({ size = 20, ...props }) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Header({ profile, loading }) {
  if (loading) {
    return (
      <header className="glass-panel container animate-fade-in" style={{ padding: '2.5rem', marginTop: '5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '130px', height: '130px', borderRadius: '50%' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="skeleton" style={{ width: '200px', height: '2rem' }} />
            <div className="skeleton" style={{ width: '120px', height: '1.25rem' }} />
            <div className="skeleton" style={{ width: '100%', height: '1.25rem' }} />
            <div className="skeleton" style={{ width: '60%', height: '1.25rem' }} />
          </div>
        </div>
      </header>
    );
  }

  if (!profile) return null;

  const {
    avatar_url,
    name,
    login,
    bio,
    location,
    company,
    blog,
    html_url,
    followers,
    following,
    public_repos,
    twitter_username
  } = profile;

  // Format blog link if it doesn't have http
  const blogLink = blog && !blog.startsWith('http') ? `https://${blog}` : blog;

  return (
    <header 
      className="glass-panel container animate-slide-up" 
      style={{ 
        padding: '2.5rem', 
        marginTop: '6rem', 
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative header glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'var(--gradient-accent)'
      }} />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '2.5rem', 
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }} className="header-layout">
        
        {/* Avatar block */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            borderRadius: '50%',
            background: 'var(--gradient-accent)',
            zIndex: 1,
            opacity: 0.85
          }} />
          <img 
            src={avatar_url} 
            alt={name || login} 
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 2,
              display: 'block',
              border: '4px solid var(--bg-color)'
            }}
          />
        </div>

        {/* Text profile details */}
        <div style={{ 
          flex: '1 1 300px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          textAlign: 'left'
        }} className="profile-text">
          <div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>{name || login}</h1>
            <a 
              href={html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                fontFamily: 'var(--font-code)', 
                fontSize: '1rem',
                color: 'var(--accent-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              @{login}
            </a>
          </div>

          {bio && <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px' }}>{bio}</p>}

          {/* Location and Company info */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.25rem', 
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}>
            {location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} />
                {location}
              </span>
            )}
            {company && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={16} />
                {company}
              </span>
            )}
            {blogLink && (
              <a 
                href={blogLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.35rem',
                  color: 'var(--text-muted)'
                }}
                className="blog-link"
              >
                <LinkIcon size={16} />
                Website
              </a>
            )}
            {twitter_username && (
              <a 
                href={`https://twitter.com/${twitter_username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.35rem',
                  color: 'var(--text-muted)'
                }}
              >
                <Twitter size={16} />
                @{twitter_username}
              </a>
            )}
          </div>
        </div>

        {/* Counter dashboard */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flex: '0 0 auto'
        }} className="counters-container">
          <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderRadius: '12px', minWidth: '90px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <BookOpen size={18} />
              {public_repos}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Repos</div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderRadius: '12px', minWidth: '90px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Users size={18} />
              {followers}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Followers</div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderRadius: '12px', minWidth: '90px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Users size={18} />
              {following}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Following</div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .header-layout {
            flex-direction: column !important;
            text-align: center !important;
          }
          .profile-text {
            text-align: center !important;
            align-items: center !important;
          }
          .profile-text > div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        .blog-link:hover {
          color: var(--accent-primary) !important;
        }
      `}</style>
    </header>
  );
}
