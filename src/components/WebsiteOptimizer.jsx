import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { optimizeWebsite } from '../services/api';

function WebsiteOptimizer() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('content');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Geo options
  const [targetLocation, setTargetLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [targetRadius, setTargetRadius] = useState('');

  const handleOptimize = async (e) => {
    e.preventDefault();
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await optimizeWebsite({
        url: processedUrl,
        mode,
        geoOptions:
          mode === 'geo'
            ? {
                targetLocation: targetLocation.trim(),
                businessType: businessType.trim(),
                targetRadius: targetRadius.trim(),
              }
            : {},
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="optimizer-section">
      {!result ? (
        <>
          <div className="form-hero">
            <h2>Website Optimizer</h2>
            <p>
              Enter a URL and get AI-powered content optimization or local/geo SEO
              recommendations tailored to your page.
            </p>
          </div>

          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'content' ? 'active' : ''}`}
              onClick={() => setMode('content')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Content Optimizer
            </button>
            <button
              className={`mode-btn ${mode === 'geo' ? 'active' : ''}`}
              onClick={() => setMode('geo')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Geo / Local SEO
            </button>
          </div>

          <form onSubmit={handleOptimize} className="audit-form">
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
              <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Analyzing...
                  </span>
                ) : (
                  'Optimize'
                )}
              </button>
            </div>

            {mode === 'geo' && (
              <div className="geo-options">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Target Location <span className="optional">(city, region, or country)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={targetLocation}
                      onChange={(e) => setTargetLocation(e.target.value)}
                      placeholder="e.g., New York, NY"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Business Type <span className="optional">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      placeholder="e.g., Restaurant, Law Firm, Dentist"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Target Radius <span className="optional">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={targetRadius}
                      onChange={(e) => setTargetRadius(e.target.value)}
                      placeholder="e.g., 25 miles, citywide"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group flex-1"></div>
                </div>
              </div>
            )}
          </form>

          {error && (
            <div className="error-card">
              <div className="error-icon">!</div>
              <h3>Optimization Failed</h3>
              <p>{error}</p>
            </div>
          )}

          <div className="features-grid optimizer-features">
            {mode === 'content' ? (
              <>
                <div className="feature-card">
                  <div className="feature-icon">📝</div>
                  <h3>Content Analysis</h3>
                  <p>Deep analysis of content quality, depth & E-E-A-T signals</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔑</div>
                  <h3>Keyword Strategy</h3>
                  <p>Primary, secondary, and long-tail keyword recommendations</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📑</div>
                  <h3>Heading Optimization</h3>
                  <p>Ideal heading hierarchy and structure for your page</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <h3>Featured Snippet</h3>
                  <p>Format content to win featured snippets in search</p>
                </div>
              </>
            ) : (
              <>
                <div className="feature-card">
                  <div className="feature-icon">📍</div>
                  <h3>Local SEO</h3>
                  <p>Complete local SEO readiness assessment and plan</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🏢</div>
                  <h3>Google Business</h3>
                  <p>GBP optimization with category, attributes & posting strategy</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📋</div>
                  <h3>Schema Markup</h3>
                  <p>Ready-to-use LocalBusiness JSON-LD structured data</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🗺️</div>
                  <h3>Geo Targeting</h3>
                  <p>Service area pages, geo-modified keywords & hreflang</p>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="optimizer-results">
          <div className="results-header">
            <div>
              <h2>
                {result.mode === 'geo' ? 'Geo/Local SEO' : 'Content'} Optimization Results
              </h2>
              <p className="results-meta">
                {result.url} · Provider: {result.provider} · {(result.duration / 1000).toFixed(1)}s
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleReset}>
              ← Optimize Another
            </button>
          </div>

          {result.pageInfo && (
            <div className="page-info-card">
              <h3>Page Summary</h3>
              <div className="page-info-grid">
                <div className="page-info-item">
                  <span className="label">Title</span>
                  <span className="value">{result.pageInfo.title || 'N/A'}</span>
                </div>
                <div className="page-info-item">
                  <span className="label">Meta Description</span>
                  <span className="value">{result.pageInfo.metaDescription || 'N/A'}</span>
                </div>
                <div className="page-info-item">
                  <span className="label">H1</span>
                  <span className="value">{result.pageInfo.h1 || 'N/A'}</span>
                </div>
                <div className="page-info-item">
                  <span className="label">Word Count</span>
                  <span className="value">{result.pageInfo.wordCount || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="ai-content-card">
            <ReactMarkdown>{result.optimization}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebsiteOptimizer;
