import React from 'react';
import { BarChart2, Star, GitFork, HardDrive, Terminal, Flame, History } from 'lucide-react';

export default function StatsDashboard({ repos, loading }) {
  if (loading) {
    return (
      <section className="container animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="skeleton" style={{ height: '150px' }} />
          <div className="skeleton" style={{ height: '150px' }} />
          <div className="skeleton" style={{ height: '150px' }} />
        </div>
      </section>
    );
  }

  if (!repos || repos.length === 0) return null;

  // 1. Core aggregations
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const avgSize = Math.round(repos.reduce((sum, r) => sum + r.size, 0) / repos.length);

  // 2. Language breakdown
  const languageCounts = {};
  let validLangCount = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      validLangCount++;
    }
  });

  const topLanguages = Object.entries(languageCounts)
    .map(([lang, count]) => ({
      name: lang,
      count,
      percentage: validLangCount > 0 ? Math.round((count / validLangCount) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Project spotlights
  const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const mostStarred = sortedByStars[0];

  const sortedByPushed = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
  const mostRecent = sortedByPushed[0];

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

  const getLangColor = (lang) => langColors[lang] || 'var(--accent-primary)';

  return (
    <section className="container animate-slide-up" style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <BarChart2 size={22} style={{ color: 'var(--accent-primary)' }} />
        <h2>Developer Dashboard & Metrics</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Languages panel */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} style={{ color: 'var(--accent-tertiary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Top Languages</h3>
          </div>
          
          {topLanguages.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              No primary languages found in public repositories.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getLangColor(lang.name)
                      }} />
                      {lang.name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang.percentage}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${lang.percentage}%`,
                      height: '100%',
                      background: getLangColor(lang.name),
                      borderRadius: '3px',
                      boxShadow: `0 0 8px ${getLangColor(lang.name)}80`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global metrics grid */}
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '10px',
              background: 'rgba(255, 193, 7, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffc107',
              flexShrink: 0
            }}>
              <Star size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalStars}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total GitHub Stars</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <GitFork size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalForks}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Repo Forks</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '10px',
              background: 'rgba(192, 132, 252, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
              flexShrink: 0
            }}>
              <HardDrive size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{avgSize >= 1024 ? `${(avgSize / 1024).toFixed(1)} MB` : `${avgSize} KB`}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Average Repository Size</div>
            </div>
          </div>
        </div>

        {/* Spotlights card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Project Spotlight</h3>
          </div>

          {mostStarred && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Star size={18} style={{ color: '#ffc107', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Starred</div>
                <a 
                  href={mostStarred.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontWeight: '600', fontSize: '0.95rem', display: 'block', margin: '0.15rem 0' }}
                >
                  {mostStarred.name}
                </a>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {mostStarred.stargazers_count} stars • {mostStarred.language || 'No language'}
                </div>
              </div>
            </div>
          )}

          {mostRecent && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <History size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recently Updated</div>
                <a 
                  href={mostRecent.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontWeight: '600', fontSize: '0.95rem', display: 'block', margin: '0.15rem 0' }}
                >
                  {mostRecent.name}
                </a>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Pushed {new Date(mostRecent.pushed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
