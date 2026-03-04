import React, { useState } from 'react';
import ScoreCard from './ScoreCard.jsx';
import ReactMarkdown from 'react-markdown';

function AuditResults({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { results, aiRecommendations, url, duration } = data;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'meta', label: 'Meta Tags', icon: '🏷️' },
    { id: 'headings', label: 'Headings', icon: '📑' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'keywords', label: 'Keywords', icon: '🔑' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'ai', label: 'AI Tips', icon: '🤖' },
  ];

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-header-left">
          <button className="btn btn-ghost" onClick={onReset}>
            ← New Audit
          </button>
          <div className="results-url">
            <h2>Audit Results</h2>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
            <span className="results-duration">Completed in {(duration / 1000).toFixed(1)}s</span>
          </div>
        </div>
        <ScoreCard score={results.overallScore} label="Overall" size="large" />
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab results={results} />}
        {activeTab === 'meta' && <CategoryTab data={results.meta} title="Meta Tags Analysis" />}
        {activeTab === 'headings' && <HeadingsTab data={results.headings} />}
        {activeTab === 'performance' && <PerformanceTab data={results.performance} />}
        {activeTab === 'keywords' && <KeywordsTab data={results.keywords} />}
        {activeTab === 'links' && <LinksTab data={results.links} />}
        {activeTab === 'mobile' && <CategoryTab data={results.mobile} title="Mobile Friendliness" />}
        {activeTab === 'accessibility' && <CategoryTab data={results.accessibility} title="Accessibility" />}
        {activeTab === 'ai' && <AITab recommendations={aiRecommendations} />}
      </div>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────
function OverviewTab({ results }) {
  const categories = [
    { key: 'meta', label: 'Meta Tags', icon: '🏷️' },
    { key: 'headings', label: 'Headings', icon: '📑' },
    { key: 'performance', label: 'Performance', icon: '⚡' },
    { key: 'keywords', label: 'Keywords', icon: '🔑' },
    { key: 'links', label: 'Links', icon: '🔗' },
    { key: 'images', label: 'Images', icon: '🖼️' },
    { key: 'mobile', label: 'Mobile', icon: '📱' },
    { key: 'accessibility', label: 'Accessibility', icon: '♿' },
    { key: 'technical', label: 'Technical', icon: '🔧' },
  ];

  // Collect all issues
  const allIssues = [];
  const allWarnings = [];
  categories.forEach(({ key, label }) => {
    if (results[key]?.issues) {
      results[key].issues.forEach((i) =>
        allIssues.push({ ...i, category: label })
      );
    }
    if (results[key]?.warnings) {
      results[key].warnings.forEach((w) =>
        allWarnings.push({ ...w, category: label })
      );
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
              <span className="stat-issues">
                {results[key]?.issues?.length || 0} issues
              </span>
              <span className="stat-warnings">
                {results[key]?.warnings?.length || 0} warnings
              </span>
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
                <span className={`impact-badge impact-${issue.impact}`}>
                  {issue.impact}
                </span>
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
                <span className={`impact-badge impact-${warning.impact}`}>
                  {warning.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Generic Category Tab ────────────────────────────────
function CategoryTab({ data, title }) {
  if (!data) return <p>No data available.</p>;

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>{title}</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

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
              <span className={`impact-badge impact-${item.impact}`}>
                {item.impact}
              </span>
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

      {data.data && (
        <div className="data-section">
          <h4>📄 Details</h4>
          <div className="data-grid">
            {Object.entries(data.data).map(([key, value]) => {
              if (typeof value === 'object') return null;
              return (
                <div key={key} className="data-item">
                  <span className="data-key">{formatKey(key)}</span>
                  <span className="data-value">
                    {typeof value === 'boolean' ? (value ? '✅ Yes' : '❌ No') : value || '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Headings Tab ────────────────────────────────────────
function HeadingsTab({ data }) {
  if (!data) return <p>No data available.</p>;

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Heading Structure</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      {data.passed?.length > 0 && (
        <div className="check-section">
          <h4>✅ Passed</h4>
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
          <h4>❌ Issues</h4>
          {data.issues.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}

      {data.warnings?.length > 0 && (
        <div className="check-section">
          <h4>⚠️ Warnings</h4>
          {data.warnings.map((item, i) => (
            <div key={i} className="check-item check-warning">
              <span className="check-icon">!</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="headings-tree">
        <h4>📋 Heading Tree</h4>
        {data.data &&
          Object.entries(data.data).map(([level, headings]) => {
            if (headings.length === 0) return null;
            return (
              <div key={level} className="heading-level">
                <div className="heading-level-label">
                  <span className={`heading-tag tag-${level}`}>
                    {level.toUpperCase()}
                  </span>
                  <span className="heading-count">({headings.length})</span>
                </div>
                {headings.map((text, i) => (
                  <div
                    key={i}
                    className="heading-item"
                    style={{ paddingLeft: `${(parseInt(level[1]) - 1) * 20 + 16}px` }}
                  >
                    {text || <em className="empty-heading">[Empty heading]</em>}
                  </div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ─── Performance Tab ─────────────────────────────────────
function PerformanceTab({ data }) {
  if (!data) return <p>No data available.</p>;

  const metrics = [
    { key: 'loadTime', label: 'Total Load Time', unit: 'ms', good: 3000, poor: 5000 },
    { key: 'ttfb', label: 'Time to First Byte', unit: 'ms', good: 200, poor: 600 },
    { key: 'fcp', label: 'First Contentful Paint', unit: 'ms', good: 1800, poor: 3000 },
    { key: 'domContentLoaded', label: 'DOM Content Loaded', unit: 'ms', good: 2000, poor: 4000 },
    { key: 'domElements', label: 'DOM Elements', unit: '', good: 800, poor: 1500 },
    { key: 'documentSize', label: 'Document Size', unit: 'bytes', good: 200000, poor: 500000 },
  ];

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Performance Metrics</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="metrics-grid">
        {metrics.map(({ key, label, unit, good, poor }) => {
          const value = data.data?.[key];
          if (value === null || value === undefined) return null;

          let displayValue = value;
          if (unit === 'bytes') {
            displayValue = `${(value / 1024).toFixed(1)} KB`;
          } else if (unit === 'ms') {
            displayValue = value > 1000
              ? `${(value / 1000).toFixed(2)}s`
              : `${value}ms`;
          }

          const status = value <= good ? 'good' : value <= poor ? 'moderate' : 'poor';

          return (
            <div key={key} className={`metric-card metric-${status}`}>
              <span className="metric-label">{label}</span>
              <span className="metric-value">{displayValue}</span>
              <div className="metric-bar">
                <div
                  className="metric-bar-fill"
                  style={{ width: `${Math.min(100, (value / poor) * 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {data.passed?.length > 0 && (
        <div className="check-section">
          <h4>✅ Passed</h4>
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
          <h4>❌ Issues</h4>
          {data.issues.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}

      {data.warnings?.length > 0 && (
        <div className="check-section">
          <h4>⚠️ Warnings</h4>
          {data.warnings.map((item, i) => (
            <div key={i} className="check-item check-warning">
              <span className="check-icon">!</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Keywords Tab ────────────────────────────────────────
function KeywordsTab({ data }) {
  if (!data) return <p>No data available.</p>;

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Keywords & Content</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="content-stats">
        <div className="stat-card">
          <span className="stat-number">{data.data?.wordCount || 0}</span>
          <span className="stat-desc">Words</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.data?.paragraphCount || 0}</span>
          <span className="stat-desc">Paragraphs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.data?.readingTime || 0} min</span>
          <span className="stat-desc">Reading Time</span>
        </div>
      </div>

      {data.data?.topKeywords?.length > 0 && (
        <div className="keywords-section">
          <h4>🔑 Top Keywords</h4>
          <div className="keywords-table">
            <div className="keywords-header">
              <span>Keyword</span>
              <span>Count</span>
              <span>Density</span>
            </div>
            {data.data.topKeywords.map((kw, i) => (
              <div key={i} className="keyword-row">
                <span className="keyword-word">
                  <span className="keyword-rank">#{i + 1}</span>
                  {kw.word}
                </span>
                <span className="keyword-count">{kw.count}</span>
                <span className="keyword-density">
                  <div className="density-bar">
                    <div
                      className="density-fill"
                      style={{ width: `${Math.min(100, kw.density * 20)}%` }}
                    ></div>
                  </div>
                  {kw.density}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.passed?.length > 0 && (
        <div className="check-section">
          <h4>✅ Passed</h4>
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
          <h4>❌ Issues</h4>
          {data.issues.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}

      {data.warnings?.length > 0 && (
        <div className="check-section">
          <h4>⚠️ Warnings</h4>
          {data.warnings.map((item, i) => (
            <div key={i} className="check-item check-warning">
              <span className="check-icon">!</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Links Tab ───────────────────────────────────────────
function LinksTab({ data }) {
  if (!data) return <p>No data available.</p>;

  return (
    <div className="category-tab">
      <div className="category-header">
        <h3>Link Analysis</h3>
        <ScoreCard score={data.score} size="medium" />
      </div>

      <div className="content-stats">
        <div className="stat-card">
          <span className="stat-number">{data.data?.internalCount || 0}</span>
          <span className="stat-desc">Internal Links</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.data?.externalCount || 0}</span>
          <span className="stat-desc">External Links</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.data?.brokenCount || 0}</span>
          <span className="stat-desc">Broken Links</span>
        </div>
      </div>

      {data.data?.internal?.length > 0 && (
        <div className="links-section">
          <h4>🔗 Internal Links (showing {data.data.internal.length})</h4>
          <div className="links-list">
            {data.data.internal.map((link, i) => (
              <div key={i} className="link-item">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.text}
                </a>
                <span className="link-url">{link.url}</span>
                {link.nofollow && <span className="link-nofollow">nofollow</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.data?.external?.length > 0 && (
        <div className="links-section">
          <h4>🌐 External Links (showing {data.data.external.length})</h4>
          <div className="links-list">
            {data.data.external.map((link, i) => (
              <div key={i} className="link-item">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.text}
                </a>
                <span className="link-url">{link.url}</span>
                {link.nofollow && <span className="link-nofollow">nofollow</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.passed?.length > 0 && (
        <div className="check-section">
          <h4>✅ Passed</h4>
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
          <h4>❌ Issues</h4>
          {data.issues.map((item, i) => (
            <div key={i} className="check-item check-failed">
              <span className="check-icon">✗</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AI Recommendations Tab ─────────────────────────────
function AITab({ recommendations }) {
  if (!recommendations) return <p>No AI recommendations available.</p>;

  return (
    <div className="category-tab ai-tab">
      <div className="ai-header">
        <h3>🤖 AI-Powered Recommendations</h3>
        <p className="ai-subtitle">
          Generated by Google Gemini based on your audit results
        </p>
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

// ─── Helper ──────────────────────────────────────────────
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2');
}

export default AuditResults;
