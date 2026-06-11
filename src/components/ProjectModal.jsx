import React, { useEffect, useState } from 'react';
import { X, ExternalLink, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { marked } from 'marked';
import { fetchRepoReadme } from '../utils/githubApi';

export default function ProjectModal({ repoName, username, token, onClose }) {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch README content
  useEffect(() => {
    let active = true;
    async function loadReadme() {
      setLoading(true);
      setError('');
      try {
        const content = await fetchRepoReadme(username, repoName, token);
        if (active) {
          setMarkdown(content);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load README.md');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReadme();
    return () => {
      active = false;
    };
  }, [repoName, username, token]);

  // Parse markdown content
  const renderedHtml = React.useMemo(() => {
    if (!markdown) return '';
    try {
      // Configure marked option to sanitize or process if needed, default is fine
      return marked.parse(markdown);
    } catch (err) {
      console.error('Markdown parse error:', err);
      return '<p>Error parsing markdown.</p>';
    }
  }, [markdown]);

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s forwards'
      }}
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal itself
        className="glass-panel modal-content"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--panel-bg)',
          borderRadius: '16px',
          border: '1px solid var(--panel-border)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
          animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>{repoName} / README.md</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a 
              href={`https://github.com/${username}/${repoName}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
              className="modal-github-link"
            >
              <ExternalLink size={14} />
              Open GitHub
            </a>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div 
          className="modal-body"
          style={{
            padding: '2rem 2.25rem',
            overflowY: 'auto',
            flex: 1,
            color: 'var(--text-primary)',
            fontSize: '0.95rem'
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
              <div className="skeleton" style={{ width: '40%', height: '2rem' }} />
              <div className="skeleton" style={{ width: '100%', height: '1.25rem' }} />
              <div className="skeleton" style={{ width: '90%', height: '1.25rem' }} />
              <div className="skeleton" style={{ width: '95%', height: '1.25rem' }} />
              <div className="skeleton" style={{ width: '30%', height: '1.25rem', marginTop: '1rem' }} />
              <div className="skeleton" style={{ width: '100%', height: '5rem' }} />
            </div>
          ) : error ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'var(--text-secondary)',
              padding: '3rem 0'
            }}>
              <AlertCircle size={32} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <h4 style={{ textAlign: 'center' }}>Error Loading README</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'center' }}>
                  {error}
                </p>
              </div>
            </div>
          ) : (
            <div 
              className="markdown-body" 
              dangerouslySetInnerHTML={{ __html: renderedHtml }} 
            />
          )}
        </div>
      </div>

      {/* Styled Markdown classes */}
      <style>{`
        .modal-github-link:hover {
          color: var(--accent-primary) !important;
        }
        
        /* Markdown rendering styles */
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--panel-border);
          padding-bottom: 0.3rem;
        }
        
        .markdown-body h1 { font-size: 1.75rem; }
        .markdown-body h2 { font-size: 1.4rem; }
        .markdown-body h3 { font-size: 1.15rem; }
        
        .markdown-body p {
          margin-bottom: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .markdown-body ul,
        .markdown-body ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: var(--text-secondary);
        }
        
        .markdown-body li {
          margin-bottom: 0.25rem;
        }
        
        .markdown-body pre {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          margin-bottom: 1rem;
          font-family: var(--font-code);
          font-size: 0.85rem;
        }
        
        .markdown-body code {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: var(--font-code);
          font-size: 0.85rem;
          color: var(--accent-primary);
        }
        
        .markdown-body pre code {
          background: none;
          padding: 0;
          color: var(--text-primary);
        }
        
        .markdown-body blockquote {
          border-left: 4px solid var(--accent-primary);
          padding-left: 1rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          font-style: italic;
        }
        
        .markdown-body img {
          max-width: 100%;
          border-radius: 6px;
          margin: 1rem 0;
        }

        .markdown-body table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .markdown-body th, .markdown-body td {
          border: 1px solid var(--panel-border);
          padding: 0.5rem 0.75rem;
          text-align: left;
        }

        .markdown-body th {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
