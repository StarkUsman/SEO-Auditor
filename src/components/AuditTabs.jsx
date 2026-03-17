import React from 'react';
import ScoreCard from './ScoreCard.jsx';
import ReactMarkdown from 'react-markdown';

// ─── Shared helper ────────────────────────────────────────
export function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2');
}

// ─── Passed / Issues / Warnings block ────────────────────
export function CheckSections({ data }) {
  return (
    <>
      {data.passed?.length > 0 && (
        <div className="check-section">
          <h4>✅ Passed ({data.passed.length})</h4>
          {data.passed.map((item, i) => (
            <div key={i} className="check-item check-passed">
              <span className="check-icon">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
      {data.issues?.length > 0 && (
        <div className="check-section">
          <h4>❌ Issues ({data.issues.length})</h4>
          {data.issues.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span>{item.message}</span>
              <span className={`impact-badge impact-${item.impact}`}>{item.impact}</span>
            </div>
          ))}
        </div>
      )}
      {data.warnings?.length > 0 && (
        <div className="check-section">
          <h4>⚠️ Warnings ({data.warnings.length})</h4>
          {data.warnings.map((item, i) => (
            <div key={i} className="check-item check-warning">
              <span className="check-icon">!</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Overview Tab ─────────────────────────────────────────
export function OverviewTab({ results }) {
  const categories = [
    { key: 'meta', label: 'Meta Tags', icon: '🏷️' },
    { key: 'headings', label: 'Headings', icon: '📑' },
    { key: 'url', label: 'URL Structure', icon: '🔗' },
    { key: 'performance', label: 'Performance', icon: '⚡' },
    { key: 'keywords', label: 'Keywords', icon: '🔑' },
    { key: 'links', label: 'Links', icon: '🌐' },
    { key: 'security', label: 'Security', icon: '🔐' },
    { key: 'images', label: 'Images', icon: '🖼️' },
    { key: 'mobile', label: 'Mobile', icon: '📱' },
    { key: 'accessibility', label: 'Accessibility', icon: '♿' },
    { key: 'technical', label: 'Technical', icon: '🔧' },
  ];

  const allIssues = [];
  const allWarnings = [];
  categories.forEach(({ key, label }) => {
    if (results[key]?.issues) {
      results[key].issues.forEach((i) => allIssues.push({ ...i, category: label }));
    }
    if (results[key]?.warnings) {
      results[key].warnings.forEach((w) => allWarnings.push({ ...w, category: label }));
    }
  });

  return (
    <div className="overview-tab">
      <div className="scores-grid">
        {categories.map(({ key, label, icon }) => (
          <div key={key} className="category-score-card">
            <div className="category-score-header">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
            <ScoreCard score={results[key]?.score || 0} size="medium" />
            <div className="category-score-stats">
              <span className="stat-issues">{results[key]?.issues?.length || 0} issues</span>
              <span className="stat-warnings">{results[key]?.warnings?.length || 0} warnings</span>
            </div>
          </div>
        ))}
      </div>

      {allIssues.length > 0 && (
        <div className="issues-section">
          <h3>🔴 Critical Issues ({allIssues.length})</h3>
          <div className="issues-list">
            {allIssues.map((issue, i) => (
              <div key={i} className="issue-item issue-critical">
                <span className="issue-badge">{issue.category}</span>
                <span className="issue-text">{issue.message}</span>
                <span className={`impact-badge impact-${issue.impact}`}>{issue.impact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allWarnings.length > 0 && (
        <div className="issues-section">
          <h3>🟡 Warnings ({allWarnings.length})</h3>
          <div className="issues-list">
            {allWarnings.map((warning, i) => (
              <div key={i} className="issue-item issue-warning">
                <span className="issue-badge">{warning.category}</span>
                <span className="issue-text">{warning.message}</span>
                <span className={`impact-badge impact-${warning.impact}`}>{warning.impact}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Issues Tab ───────────────────────────────────────────
export function IssuesTab({ results }) {
  const categories = [
    { key: 'meta', label: 'Meta Tags' },
    { key: 'headings', label: 'Headings' },
    { key: 'url', label: 'URL Structure' },
    { key: 'performance', label: 'Performance' },
    { key: 'keywords', label: 'Keywords' },
    { key: 'links', label: 'Links' },
    { key: 'security', label: 'Security' },
    { key: 'images', label: 'Images' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'technical', label: 'Technical' },
  ];

  const errors = [];
  const warnings = [];
  const notices = [];

  categories.forEach(({ key, label }) => {
    if (results[key]?.issues) {
      results[key].issues.forEach((i) => errors.push({ ...i, category: label }));
    }
    if (results[key]?.warnings) {
      results[key].warnings.forEach((w) => {
        if (w.impact === 'moderate') warnings.push({ ...w, category: label });
        else notices.push({ ...w, category: label });
      });
    }
  });

  const totalIssues = errors.length + warnings.length + notices.length;

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Issues & Recommendations</h3>
        <div className="issues-summary-badges">
          <span className="badge badge-error">{errors.length} Errors</span>
          <span className="badge badge-warning">{warnings.length} Warnings</span>
          <span className="badge badge-notice">{notices.length} Notices</span>
        </div>
      </div>

      {totalIssues === 0 && (
        <div className="check-item check-passed" style={{ marginTop: '1rem' }}>
          <span className="check-icon">✓</span>
          <span>No issues found — excellent SEO health!</span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="check-section">
          <h4>❌ Errors — Critical Issues ({errors.length})</h4>
          {errors.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <div className="issue-row">
                <span className="issue-badge">{item.category}</span>
                <span>{item.message}</span>
              </div>
              <span className={`impact-badge impact-${item.impact}`}>{item.impact}</span>
            </div>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="check-section">
          <h4>⚠️ Warnings — Moderate Issues ({warnings.length})</h4>
          {warnings.map((item, i) => (
            <div key={i} className="check-item check-warning">
              <div className="issue-row">
                <span className="issue-badge">{item.category}</span>
                <span>{item.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {notices.length > 0 && (
        <div className="check-section">
          <h4>ℹ️ Notices — Minor Issues ({notices.length})</h4>
          {notices.map((item, i) => (
            <div key={i} className="check-item check-notice">
              <div className="issue-row">
                <span className="issue-badge">{item.category}</span>
                <span>{item.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Meta Tags Tab ────────────────────────────────────────
export function MetaTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const meta = data.data || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Meta Tags Analysis</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      {(meta.ogImage || meta.ogTitle || meta.ogDescription) && (
        <div className="social-preview-section">
          <h4>📢 Social Preview</h4>
          <div className="social-preview-card">
            {meta.ogImage && (
              <div className="social-preview-image">
                <img
                  src={meta.ogImage}
                  alt="OG preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div className="social-preview-text">
              <div className="social-preview-site">
                {meta.ogSiteName || (() => { try { return new URL(meta.ogUrl || 'https://example.com').hostname; } catch { return meta.ogUrl || ''; } })()}
              </div>
              <div className="social-preview-title">{meta.ogTitle || meta.title || 'No title'}</div>
              <div className="social-preview-desc">{meta.ogDescription || meta.metaDescription || 'No description'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="data-section">
        <h4>📄 Meta Data</h4>
        <div className="data-grid">
          {[
            { label: 'Title', value: meta.title, extra: meta.title ? `${meta.title.length} chars` : null },
            { label: 'Meta Description', value: meta.metaDescription, extra: meta.metaDescription ? `${meta.metaDescription.length} chars` : null },
            { label: 'Meta Keywords', value: meta.metaKeywords || '—' },
            { label: 'Canonical URL', value: meta.canonical || '—' },
            { label: 'Robots', value: meta.robots || '—' },
            { label: 'Charset', value: meta.charset || '—' },
            { label: 'Language', value: meta.language || '—' },
            { label: 'Favicon', value: meta.favicon ? '✅ Set' : '❌ Missing' },
            { label: 'OG Title', value: meta.ogTitle || '—' },
            { label: 'OG Description', value: meta.ogDescription || '—' },
            { label: 'OG Image', value: meta.ogImage || '—' },
            { label: 'OG Type', value: meta.ogType || '—' },
            { label: 'Twitter Card', value: meta.twitterCard || '—' },
            { label: 'AMP URL', value: meta.ampUrl || '—' },
          ].map(({ label, value, extra }, i) => (
            <div key={i} className="data-item">
              <span className="data-key">{label}</span>
              <span className="data-value" style={{ wordBreak: 'break-all' }}>
                {value}{extra && <span className="data-extra"> ({extra})</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {meta.hreflang && meta.hreflang.length > 0 && (
        <div className="check-section">
          <h4>🌍 hreflang Tags ({meta.hreflang.length})</h4>
          <div className="links-list">
            {meta.hreflang.map((tag, i) => (
              <div key={i} className="link-item">
                <span className="link-nofollow">{tag.hreflang}</span>
                <span className="link-url">{tag.href}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── URL Structure Tab ────────────────────────────────────
export function UrlTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const urlData = data.data || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>URL Structure Analysis</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="data-section">
        <h4>📄 URL Details</h4>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-key">Full URL</span>
            <span className="data-value" style={{ wordBreak: 'break-all' }}>{urlData.url || '—'}</span>
          </div>
          <div className="data-item">
            <span className="data-key">URL Length</span>
            <span className="data-value">
              {urlData.length || 0} chars
              <span className={`impact-badge impact-${urlData.length <= 75 ? 'low' : urlData.length <= 115 ? 'moderate' : 'critical'}`}>
                {urlData.length <= 75 ? 'Good' : urlData.length <= 115 ? 'Long' : 'Too Long'}
              </span>
            </span>
          </div>
          <div className="data-item">
            <span className="data-key">Path</span>
            <span className="data-value">{urlData.path || '/'}</span>
          </div>
          <div className="data-item">
            <span className="data-key">Path Depth</span>
            <span className="data-value">{urlData.pathDepth || 0} level(s)</span>
          </div>
          <div className="data-item">
            <span className="data-key">HTTPS</span>
            <span className="data-value">{urlData.isHttps ? '✅ Yes' : '❌ No'}</span>
          </div>
          <div className="data-item">
            <span className="data-key">Has Underscores</span>
            <span className="data-value">{urlData.hasUnderscores ? '⚠️ Yes' : '✅ No'}</span>
          </div>
          <div className="data-item">
            <span className="data-key">Has Uppercase</span>
            <span className="data-value">{urlData.hasUppercase ? '⚠️ Yes' : '✅ No'}</span>
          </div>
          <div className="data-item">
            <span className="data-key">Query String</span>
            <span className="data-value">
              {urlData.hasQueryString ? `⚠️ Yes (${urlData.queryParams?.length || 0} param(s))` : '✅ No'}
            </span>
          </div>
        </div>
      </div>

      {urlData.queryParams && urlData.queryParams.length > 0 && (
        <div className="check-section">
          <h4>Query Parameters</h4>
          {urlData.queryParams.map((param, i) => (
            <div key={i} className="check-item check-warning">
              <span className="check-icon">?</span>
              <span>{param}</span>
            </div>
          ))}
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────
export function SecurityTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const secData = data.data || {};
  const headers = secData.headers || {};
  const rawHeaders = secData.rawHeaders || {};

  const headerChecks = [
    { key: 'hsts', label: 'HSTS (Strict-Transport-Security)', desc: 'Enforces HTTPS connections' },
    { key: 'csp', label: 'Content-Security-Policy', desc: 'Prevents XSS attacks' },
    { key: 'xFrameOptions', label: 'X-Frame-Options', desc: 'Prevents clickjacking' },
    { key: 'xContentTypeOptions', label: 'X-Content-Type-Options', desc: 'Prevents MIME sniffing' },
    { key: 'referrerPolicy', label: 'Referrer-Policy', desc: 'Controls referrer information' },
    { key: 'permissionsPolicy', label: 'Permissions-Policy', desc: 'Restricts browser features' },
  ];

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Security Analysis</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="check-section">
        <h4>🔐 Protocol</h4>
        <div className={`check-item ${secData.isHttps ? 'check-passed' : 'check-failed'}`}>
          <span className="check-icon">{secData.isHttps ? '✓' : '✗'}</span>
          <span>{secData.isHttps ? 'Page is served over HTTPS' : 'Page is not served over HTTPS'}</span>
        </div>
      </div>

      <div className="check-section">
        <h4>🛡️ Security Headers</h4>
        {headerChecks.map(({ key, label, desc }) => (
          <div key={key} className={`check-item ${headers[key] ? 'check-passed' : 'check-warning'}`}>
            <span className="check-icon">{headers[key] ? '✓' : '!'}</span>
            <div style={{ flex: 1 }}>
              <div><strong>{label}</strong></div>
              <div style={{ fontSize: '0.82rem', opacity: 0.7 }}>{desc}</div>
              {rawHeaders[key] && (
                <div style={{ fontSize: '0.78rem', marginTop: '2px', fontFamily: 'monospace', opacity: 0.6, wordBreak: 'break-all' }}>
                  {rawHeaders[key]}
                </div>
              )}
            </div>
            <span className={`impact-badge impact-${headers[key] ? 'low' : 'moderate'}`}>
              {headers[key] ? 'Present' : 'Missing'}
            </span>
          </div>
        ))}
      </div>

      <CheckSections data={data} />
    </div>
  );
}

// ─── Headings Tab ─────────────────────────────────────────
export function HeadingsTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const headings = data.data || {};
  const summary = data.summary || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Heading Structure</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="content-stats">
        {['h1','h2','h3','h4','h5','h6'].map((level) => (
          <div key={level} className="stat-card">
            <span className="stat-number">{summary.counts?.[level] || 0}</span>
            <span className="stat-desc">{level.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {summary.emptyCount > 0 && (
        <div className="check-section">
          <div className="check-item check-failed">
            <span className="check-icon">✗</span>
            <span>{summary.emptyCount} empty heading(s) found — these should be filled or removed</span>
          </div>
        </div>
      )}

      <CheckSections data={data} />

      <div className="headings-tree">
        <h4>📋 Heading Tree</h4>
        {['h1','h2','h3','h4','h5','h6'].map((level) => {
          const items = headings[level];
          if (!items || items.length === 0) return null;
          return (
            <div key={level} className="heading-level">
              <div className="heading-level-label">
                <span className={`heading-tag tag-${level}`}>{level.toUpperCase()}</span>
                <span className="heading-count">({items.length})</span>
              </div>
              {items.map((text, i) => (
                <div key={i} className="heading-item" style={{ paddingLeft: `${(parseInt(level[1]) - 1) * 20 + 16}px` }}>
                  {text ? text : <em className="empty-heading">[Empty heading]</em>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Performance Tab ──────────────────────────────────────
export function PerformanceTab({ data }) {
  if (!data) return <p>No data available.</p>;

  const coreWebVitals = [
    { key: 'lcp', label: 'Largest Contentful Paint', unit: 'ms', good: 2500, poor: 4000, desc: 'Time for largest content element to render' },
    { key: 'fcp', label: 'First Contentful Paint', unit: 'ms', good: 1800, poor: 3000, desc: 'Time for first content to appear' },
    { key: 'cls', label: 'Cumulative Layout Shift', unit: '', good: 0.1, poor: 0.25, desc: 'Visual stability score (lower is better)' },
  ];

  const otherMetrics = [
    { key: 'loadTime', label: 'Total Load Time', unit: 'ms', good: 3000, poor: 5000 },
    { key: 'ttfb', label: 'Time to First Byte', unit: 'ms', good: 200, poor: 600 },
    { key: 'domContentLoaded', label: 'DOM Content Loaded', unit: 'ms', good: 2000, poor: 4000 },
    { key: 'domElements', label: 'DOM Elements', unit: '', good: 800, poor: 1500 },
    { key: 'documentSize', label: 'Document Size', unit: 'bytes', good: 200000, poor: 500000 },
  ];

  const formatValue = (value, unit) => {
    if (unit === 'bytes') return `${(value / 1024).toFixed(1)} KB`;
    if (unit === 'ms') return value > 1000 ? `${(value / 1000).toFixed(2)}s` : `${value}ms`;
    return String(value);
  };

  const getStatus = (value, good, poor) => value <= good ? 'good' : value <= poor ? 'moderate' : 'poor';

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Performance Metrics</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="check-section">
        <h4>⚡ Core Web Vitals</h4>
        <div className="metrics-grid">
          {coreWebVitals.map(({ key, label, unit, good, poor, desc }) => {
            const value = data.data?.[key];
            if (value === null || value === undefined) return (
              <div key={key} className="metric-card metric-na">
                <span className="metric-label">{label}</span>
                <span className="metric-value">N/A</span>
                <div style={{ fontSize: '0.78rem', opacity: 0.6 }}>{desc}</div>
              </div>
            );
            const status = getStatus(value, good, poor);
            return (
              <div key={key} className={`metric-card metric-${status}`}>
                <span className="metric-label">{label}</span>
                <span className="metric-value">{formatValue(value, unit)}</span>
                <div style={{ fontSize: '0.78rem', opacity: 0.7, marginBottom: '4px' }}>{desc}</div>
                <div className="metric-bar">
                  <div className="metric-bar-fill" style={{ width: `${Math.min(100, (value / poor) * 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="check-section">
        <h4>📊 Other Metrics</h4>
        <div className="metrics-grid">
          {otherMetrics.map(({ key, label, unit, good, poor }) => {
            const value = data.data?.[key];
            if (value === null || value === undefined) return null;
            const status = getStatus(value, good, poor);
            return (
              <div key={key} className={`metric-card metric-${status}`}>
                <span className="metric-label">{label}</span>
                <span className="metric-value">{formatValue(value, unit)}</span>
                <div className="metric-bar">
                  <div className="metric-bar-fill" style={{ width: `${Math.min(100, (value / poor) * 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data.data?.renderBlockingResources?.length > 0 && (
        <div className="check-section">
          <h4>🚫 Render-Blocking Resources ({data.data.renderBlockingResources.length})</h4>
          {data.data.renderBlockingResources.map((r, i) => (
            <div key={i} className="check-item check-warning">
              <span className="check-icon">!</span>
              <span style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>
                {typeof r === 'string' ? r : `${r.name} (${r.duration}ms)`}
              </span>
            </div>
          ))}
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── Keywords Tab ─────────────────────────────────────────
export function KeywordsTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const d = data.data || {};
  const readabilityColor = d.readabilityScore >= 60 ? 'good' : d.readabilityScore >= 30 ? 'moderate' : 'poor';

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Keywords & Content</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="content-stats">
        <div className="stat-card">
          <span className="stat-number">{d.wordCount || 0}</span>
          <span className="stat-desc">Words</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.paragraphCount || 0}</span>
          <span className="stat-desc">Paragraphs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.readingTime || 0} min</span>
          <span className="stat-desc">Reading Time</span>
        </div>
        {d.contentToHtmlRatio != null && (
          <div className="stat-card">
            <span className="stat-number">{d.contentToHtmlRatio}%</span>
            <span className="stat-desc">Content/HTML Ratio</span>
          </div>
        )}
      </div>

      {d.readabilityScore != null && (
        <div className="check-section">
          <h4>📖 Readability (Flesch-Kincaid)</h4>
          <div className={`metric-card metric-${readabilityColor}`} style={{ maxWidth: '320px' }}>
            <span className="metric-label">Readability Score</span>
            <span className="metric-value">{d.readabilityScore} / 100 — {d.readabilityLabel}</span>
            <div className="metric-bar">
              <div className="metric-bar-fill" style={{ width: `${d.readabilityScore}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {d.topKeywords?.length > 0 && (
        <div className="keywords-section">
          <h4>🔑 Primary Keywords (Top 5)</h4>
          <div className="keywords-table">
            <div className="keywords-header">
              <span>Keyword</span>
              <span>Count</span>
              <span>Density</span>
            </div>
            {d.topKeywords.map((kw, i) => (
              <div key={i} className="keyword-row">
                <span className="keyword-word">
                  <span className="keyword-rank">#{i + 1}</span>
                  {kw.word}
                </span>
                <span className="keyword-count">{kw.count}</span>
                <span className="keyword-density">
                  <div className="density-bar">
                    <div className="density-fill" style={{ width: `${Math.min(100, kw.density * 20)}%` }}></div>
                  </div>
                  {kw.density}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {d.lsiKeywords?.length > 0 && (
        <div className="keywords-section">
          <h4>🧠 LSI / Semantic Keywords</h4>
          <div className="lsi-keywords-grid">
            {d.lsiKeywords.map((kw, i) => (
              <div key={i} className="lsi-keyword-chip">
                <span className="lsi-word">{kw.word}</span>
                <span className="lsi-density">{kw.density}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── Links Tab ────────────────────────────────────────────
export function LinksTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const d = data.data || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Link Analysis</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="content-stats">
        <div className="stat-card">
          <span className="stat-number">{d.internalCount || 0}</span>
          <span className="stat-desc">Internal Links</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.externalCount || 0}</span>
          <span className="stat-desc">External Links</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.brokenCount || 0}</span>
          <span className="stat-desc">Broken Links</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.dofollowExternalCount || 0}</span>
          <span className="stat-desc">Dofollow External</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.nofollowExternalCount || 0}</span>
          <span className="stat-desc">Nofollow External</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.nofollowRatio != null ? `${d.nofollowRatio}%` : '—'}</span>
          <span className="stat-desc">Nofollow Ratio</span>
        </div>
      </div>

      {d.internal?.length > 0 && (
        <div className="links-section">
          <h4>Internal Links (showing {d.internal.length})</h4>
          <div className="links-list">
            {d.internal.map((link, i) => (
              <div key={i} className="link-item">
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                <span className="link-url">{link.url}</span>
                {link.nofollow && <span className="link-nofollow">nofollow</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {d.external?.length > 0 && (
        <div className="links-section">
          <h4>External Links (showing {d.external.length})</h4>
          <div className="links-list">
            {d.external.map((link, i) => (
              <div key={i} className="link-item">
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                <span className="link-url">{link.url}</span>
                {link.nofollow && <span className="link-nofollow">nofollow</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── Accessibility Tab ────────────────────────────────────
export function AccessibilityTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const d = data.data || {};

  const checks = [
    { label: 'HTML lang attribute', value: d.hasLang },
    { label: 'DOCTYPE declaration', value: d.hasDoctype },
    { label: 'Character encoding', value: d.hasCharset },
    { label: 'ARIA roles present', value: d.hasAriaRoles, extra: d.hasAriaRoles ? `${d.ariaRolesCount} elements` : null },
    { label: 'Navigation landmark (<nav>)', value: d.hasNavLandmark },
    { label: 'Skip navigation link', value: d.hasSkipLink },
  ];

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Accessibility</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="check-section">
        <h4>Accessibility Checklist</h4>
        {checks.map(({ label, value, extra }, i) => (
          <div key={i} className={`check-item ${value ? 'check-passed' : 'check-warning'}`}>
            <span className="check-icon">{value ? '✓' : '!'}</span>
            <span>{label}{extra && ` — ${extra}`}</span>
          </div>
        ))}
        {d.imgsMissingAlt > 0 && (
          <div className="check-item check-failed">
            <span className="check-icon">✗</span>
            <span>{d.imgsMissingAlt} image(s) missing alt text</span>
          </div>
        )}
      </div>

      <CheckSections data={data} />
    </div>
  );
}

// ─── Technical Tab ────────────────────────────────────────
export function TechnicalTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const tech = data.data || {};
  const sd = data.structuredData || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Technical SEO</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="data-section">
        <h4>📄 Technical Details</h4>
        <div className="data-grid">
          {[
            { label: 'HTTPS / SSL', value: tech.hasSSL ? '✅ Enabled' : '❌ Not Enabled' },
            { label: 'DOCTYPE', value: tech.hasDoctype ? '✅ Present' : '❌ Missing' },
            { label: 'Charset', value: tech.hasCharset ? '✅ Declared' : '❌ Missing' },
            { label: 'Favicon', value: tech.hasFavicon ? '✅ Set' : '❌ Missing' },
            { label: 'Robots.txt', value: tech.hasRobotsTxt ? '✅ Found' : '❌ Missing' },
            { label: 'Sitemap.xml', value: tech.hasSitemap ? '✅ Found' : '❌ Missing' },
            { label: 'Scripts Count', value: tech.scriptsCount },
            { label: 'Stylesheets Count', value: tech.stylesheetsCount },
            { label: 'Inline Styles Count', value: tech.inlineStylesCount },
            { label: 'iFrames Count', value: tech.iframesCount },
            { label: 'Forms Count', value: tech.formsCount },
            { label: 'Mixed Content', value: tech.hasMixedContent ? `⚠️ ${tech.mixedContent?.length || 0} item(s)` : '✅ None' },
          ].map(({ label, value }, i) => (
            <div key={i} className="data-item">
              <span className="data-key">{label}</span>
              <span className="data-value">{value != null ? String(value) : '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {sd.hasSchema && (
        <div className="check-section">
          <h4>🧩 Structured Data / Schema</h4>
          {sd.schemas && sd.schemas.map((schema, i) => (
            <div key={i} className="check-item check-passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>{schema['@type'] || 'Unknown type'}</strong>
                {schema['@context'] && <span style={{ marginLeft: '8px', opacity: 0.6, fontSize: '0.82rem' }}>{schema['@context']}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.hreflang && data.hreflang.length > 0 && (
        <div className="check-section">
          <h4>🌍 hreflang Tags ({data.hreflang.length})</h4>
          <div className="links-list">
            {data.hreflang.map((tag, i) => (
              <div key={i} className="link-item">
                <span className="link-nofollow">{tag.hreflang}</span>
                <span className="link-url">{tag.href}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.ampUrl && (
        <div className="check-section">
          <h4>⚡ AMP</h4>
          <div className="check-item check-passed">
            <span className="check-icon">✓</span>
            <span>AMP version: <a href={data.ampUrl} target="_blank" rel="noopener noreferrer">{data.ampUrl}</a></span>
          </div>
        </div>
      )}

      {(data.paginationNext || data.paginationPrev) && (
        <div className="check-section">
          <h4>📄 Pagination</h4>
          {data.paginationNext && (
            <div className="check-item check-passed">
              <span className="check-icon">✓</span>
              <span>rel="next": {data.paginationNext}</span>
            </div>
          )}
          {data.paginationPrev && (
            <div className="check-item check-passed">
              <span className="check-icon">✓</span>
              <span>rel="prev": {data.paginationPrev}</span>
            </div>
          )}
        </div>
      )}

      {tech.mixedContent && tech.mixedContent.length > 0 && (
        <div className="check-section">
          <h4>⚠️ Mixed Content ({tech.mixedContent.length})</h4>
          {tech.mixedContent.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span style={{ wordBreak: 'break-all', fontSize: '0.83rem' }}>{item}</span>
            </div>
          ))}
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── Images Tab ───────────────────────────────────────────
export function ImagesTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const d = data.data || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Media & Image Optimization</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="content-stats">
        <div className="stat-card">
          <span className="stat-number">{d.total || 0}</span>
          <span className="stat-desc">Total Images</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.missingAlt || 0}</span>
          <span className="stat-desc">Missing Alt</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.lazyLoaded || 0}</span>
          <span className="stat-desc">Lazy Loaded</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.modernFormats || 0}</span>
          <span className="stat-desc">Modern Format</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.legacyFormats || 0}</span>
          <span className="stat-desc">Legacy Format</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{d.brokenImages || 0}</span>
          <span className="stat-desc">Broken Images</span>
        </div>
      </div>

      {d.formatBreakdown && Object.keys(d.formatBreakdown).length > 0 && (
        <div className="check-section">
          <h4>🖼️ Image Format Breakdown</h4>
          <div className="data-grid">
            {Object.entries(d.formatBreakdown).map(([fmt, count]) => (
              <div key={fmt} className="data-item">
                <span className="data-key">{fmt.toUpperCase()}</span>
                <span className="data-value">
                  {count} image(s)
                  {['webp','avif'].includes(fmt) && <span className="impact-badge impact-low" style={{ marginLeft: '6px' }}>Modern</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {d.brokenImagesList && d.brokenImagesList.length > 0 && (
        <div className="check-section">
          <h4>❌ Broken Images</h4>
          {d.brokenImagesList.map((src, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span style={{ wordBreak: 'break-all', fontSize: '0.83rem' }}>{src || '[Empty src]'}</span>
            </div>
          ))}
        </div>
      )}

      <CheckSections data={data} />
    </div>
  );
}

// ─── Mobile Tab (generic) ─────────────────────────────────
export function MobileTab({ data }) {
  if (!data) return <p>No data available.</p>;
  const d = data.data || {};

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Mobile Friendliness</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="data-section">
        <h4>📄 Details</h4>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-key">Viewport Set</span>
            <span className="data-value">{d.hasViewport ? '✅ Yes' : '❌ No'}</span>
          </div>
          {d.viewportContent && (
            <div className="data-item">
              <span className="data-key">Viewport Content</span>
              <span className="data-value">{d.viewportContent}</span>
            </div>
          )}
          <div className="data-item">
            <span className="data-key">Horizontal Scroll</span>
            <span className="data-value">{d.hasHorizontalScroll ? '⚠️ Yes' : '✅ No'}</span>
          </div>
        </div>
      </div>

      <CheckSections data={data} />
    </div>
  );
}

// ─── AI Tab ───────────────────────────────────────────────
export function AITab({ recommendations }) {
  if (!recommendations) return <p>No AI recommendations available.</p>;

  return (
    <div className="category-tab ai-tab">
      <div className="ai-header">
        <h3>🤖 AI-Powered Recommendations</h3>
        <p className="ai-subtitle">Generated by AI based on your audit results</p>
        {!recommendations.success && (
          <div className="ai-warning">
            ⚠️ AI service unavailable. Showing rule-based recommendations.
          </div>
        )}
      </div>
      <div className="ai-content markdown-body">
        <ReactMarkdown>{recommendations.recommendations}</ReactMarkdown>
      </div>
    </div>
  );
}
