import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { Search, Filter, ArrowUpDown, FolderGit2, AlertTriangle } from 'lucide-react';

export default function ProjectGrid({ repos, onViewReadme, loading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'stars' | 'name'
  const [visibleCount, setVisibleCount] = useState(9);

  // 1. Gather all unique languages dynamically
  const languages = useMemo(() => {
    const list = new Set();
    repos.forEach((r) => {
      if (r.language) list.add(r.language);
    });
    return ['All', ...Array.from(list)];
  }, [repos]);

  // 2. Filter and sort repos
  const filteredSortedRepos = useMemo(() => {
    let result = [...repos];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const nameMatch = r.name.toLowerCase().includes(q);
        const descMatch = (r.description || '').toLowerCase().includes(q);
        const topicMatch = (r.topics || []).some((t) => t.toLowerCase().includes(q));
        return nameMatch || descMatch || topicMatch;
      });
    }

    // Language filter
    if (selectedLang !== 'All') {
      result = result.filter((r) => r.language === selectedLang);
    }

    // Sort
    if (sortBy === 'updated') {
      result.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    } else if (sortBy === 'stars') {
      result.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [repos, searchQuery, selectedLang, sortBy]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setVisibleCount(9);
  }, [searchQuery, selectedLang, sortBy]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (loading) {
    return (
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="skeleton" style={{ height: '350px' }} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container animate-slide-up" style={{ marginBottom: '5rem' }} id="projects">
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <FolderGit2 size={22} style={{ color: 'var(--accent-primary)' }} />
        <h2>Projects & Repositories</h2>
      </div>

      {/* Control Bar (Search, Filter, Sort) */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.01)'
      }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, tags..."
            style={{
              width: '100%',
              padding: '0.7rem 0.75rem 0.7rem 2.5rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            className="search-input"
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          
          {/* Language filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} style={{ background: 'var(--bg-color)' }}>
                  {lang === 'All' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="updated" style={{ background: 'var(--bg-color)' }}>Recently Pushed</option>
              <option value="stars" style={{ background: 'var(--bg-color)' }}>Most Stars</option>
              <option value="name" style={{ background: 'var(--bg-color)' }}>Alphabetical</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid Display */}
      {filteredSortedRepos.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <AlertTriangle size={36} style={{ color: 'var(--accent-tertiary)' }} />
          <div>
            <h3>No repositories match your criteria</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Try adjusting your search query or language filter.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredSortedRepos.slice(0, visibleCount).map((repo) => (
              <div key={repo.id} className="animate-fade-in">
                <ProjectCard repo={repo} onViewReadme={onViewReadme} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredSortedRepos.length && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <button 
                onClick={loadMore}
                className="btn btn-secondary"
                style={{ padding: '0.8rem 2rem', fontWeight: '500' }}
              >
                Load More Projects
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .search-input:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
        }
      `}</style>
    </section>
  );
}
