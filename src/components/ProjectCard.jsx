import React from 'react';
import { Star, GitFork, ExternalLink, FileText, Calendar } from 'lucide-react';

export default function ProjectCard({ repo, onViewReadme }) {
  const {
    name,
    description,
    stargazers_count,
    forks_count,
    language,
    html_url,
    pushed_at,
    topics = []
  } = repo;

  // Language colors mapping
  const langColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Shell: '#89e051',
    Swift: '#F05138',
    Kotlin: '#A97BFF'
  };

  const getLangColor = (lang) => langColors[lang] || '#64748b';

  // Format date
  const formattedDate = new Date(pushed_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article 
      className="glass-panel" 
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}
      className="project-card glass-panel"
    >
      {/* Dynamic top highlight colored by primary language */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: getLangColor(language)
      }} />

      <div>
        {/* Title & Description */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', wordBreak: 'break-word', color: 'var(--text-primary)' }}>{name}</h3>
          
          <a 
            href={html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--text-secondary)',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
            className="card-external-link"
            aria-label={`View ${name} on GitHub`}
          >
            <ExternalLink size={16} />
          </a>
        </div>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.9rem', 
          lineHeight: '1.5',
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '4.05rem' // 3 lines of text
        }}>
          {description || "No description provided."}
        </p>

        {/* Topics / Tags */}
        {topics && topics.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.4rem', 
            marginBottom: '1.25rem' 
          }}>
            {topics.slice(0, 4).map((topic) => (
              <span 
                key={topic} 
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-code)'
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Meta details (Stars, Forks, Language, Date) */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--panel-border)',
          paddingTop: '1rem',
          marginBottom: '1.25rem',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {language && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: getLangColor(language)
                }} />
                {language}
              </span>
            )}
            
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={14} style={{ color: stargazers_count > 0 ? '#ffc107' : 'inherit' }} />
              {stargazers_count}
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <GitFork size={14} />
              {forks_count}
            </span>
          </div>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} />
            {formattedDate}
          </span>
        </div>

        {/* Buttons / Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => onViewReadme(name)}
            className="btn btn-secondary"
            style={{ 
              flex: 1, 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <FileText size={15} />
            README
          </button>
          
          <a 
            href={html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ 
              flex: 1, 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem',
              color: '#080c14'
            }}
          >
            Codebase
          </a>
        </div>
      </div>

      <style>{`
        .project-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), var(--gradient-glow);
          border-color: var(--panel-border-hover);
        }
        .card-external-link:hover {
          color: var(--accent-primary) !important;
        }
      `}</style>
    </article>
  );
}
