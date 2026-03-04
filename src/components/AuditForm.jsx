import React, { useState } from 'react';

function AuditForm({ onSubmit, loading, mode, onModeChange }) {
  const [url, setUrl] = useState('');
  const [useJavaScript, setUseJavaScript] = useState(true);
  const [maxPages, setMaxPages] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    onSubmit(processedUrl, { useJavaScript, maxPages });
  };

  return (
    <div className="form-section">
      <div className="form-hero">
        <h2>Analyze Your Website's SEO</h2>
        <p>
          Get a comprehensive AI-powered SEO audit with actionable recommendations
          to improve your search rankings.
        </p>
      </div>

      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'audit' ? 'active' : ''}`}
          onClick={() => onModeChange('audit')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Single Page Audit
        </button>
        <button
          className={`mode-btn ${mode === 'crawl' ? 'active' : ''}`}
          onClick={() => onModeChange('crawl')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
          </svg>
          Site Crawl
        </button>
      </div>

      <form onSubmit={handleSubmit} className="audit-form">
        <div className="url-input-group">
          <div className="url-prefix">https://</div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="url-input"
            required
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary btn-submit" disabled={loading || !url.trim()}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Analyzing...
              </span>
            ) : mode === 'audit' ? (
              'Run Audit'
            ) : (
              'Start Crawl'
            )}
          </button>
        </div>

        <div className="form-options">
          {mode === 'audit' && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useJavaScript}
                onChange={(e) => setUseJavaScript(e.target.checked)}
              />
              <span className="checkmark"></span>
              Render JavaScript (slower but more accurate)
            </label>
          )}

          {mode === 'crawl' && (
            <div className="pages-selector">
              <label>Max pages to crawl:</label>
              <select
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
              >
                <option value={5}>5 pages</option>
                <option value={10}>10 pages</option>
                <option value={25}>25 pages</option>
                <option value={50}>50 pages</option>
                <option value={100}>100 pages</option>
                <option value={250}>250 pages</option>
                <option value={500}>500 pages</option>
                <option value={1000}>1,000 pages</option>
                <option value={2500}>2,500 pages</option>
                <option value={5000}>5,000 pages</option>
                <option value={10000}>10,000 pages</option>
                <option value={20000}>20,000 pages</option>
              </select>
            </div>
          )}
        </div>
      </form>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🏷️</div>
          <h3>Meta Tags</h3>
          <p>Title, description, OG tags & social metadata</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📑</div>
          <h3>Headings</h3>
          <p>H1-H6 hierarchy and structure analysis</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Performance</h3>
          <p>Load time, TTFB, FCP & page speed metrics</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔑</div>
          <h3>Keywords</h3>
          <p>Keyword density & content optimization</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Links</h3>
          <p>Internal & external link analysis</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Mobile & A11y</h3>
          <p>Mobile-friendliness & accessibility checks</p>
        </div>
      </div>
    </div>
  );
}

export default AuditForm;
