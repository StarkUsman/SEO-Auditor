import React, { useState } from 'react';
import ScoreCard from './ScoreCard.jsx';
import ReactMarkdown from 'react-markdown';
import {
  OverviewTab, IssuesTab, MetaTab, UrlTab, SecurityTab, HeadingsTab,
  PerformanceTab, KeywordsTab, LinksTab, AccessibilityTab, TechnicalTab,
  ImagesTab, MobileTab,
} from './AuditTabs.jsx';

const PAGE_TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'meta', label: 'Meta', icon: '🏷️' },
  { id: 'headings', label: 'Headings', icon: '📑' },
  { id: 'url', label: 'URL', icon: '🔗' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'keywords', label: 'Keywords', icon: '🔑' },
  { id: 'links', label: 'Links', icon: '🌐' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'mobile', label: 'Mobile', icon: '📱' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿' },
  { id: 'technical', label: 'Technical', icon: '🔧' },
  { id: 'images', label: 'Images', icon: '🖼️' },
  { id: 'issues', label: 'Issues', icon: '🚨' },
];

function CrawlResults({ data, onReset }) {
  const [selectedPageIdx, setSelectedPageIdx] = useState(null);
  const { summary, pages, aiSummary, pagesAnalyzed, duration } = data;

  const selectedPage = selectedPageIdx !== null ? pages[selectedPageIdx] : null;

  if (selectedPage) {
    return (
      <PageDetailView
        page={selectedPage}
        pageIndex={selectedPageIdx}
        totalPages={pages.length}
        onBack={() => setSelectedPageIdx(null)}
        onPrev={selectedPageIdx > 0 ? () => setSelectedPageIdx(selectedPageIdx - 1) : null}
        onNext={selectedPageIdx < pages.length - 1 ? () => setSelectedPageIdx(selectedPageIdx + 1) : null}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-header-left">
          <button className="btn btn-ghost" onClick={onReset}>
            ← New Audit
          </button>
          <div className="results-url">
            <h2>Site Crawl Results</h2>
            <a href={data.url} target="_blank" rel="noopener noreferrer">{data.url}</a>
            <span className="results-duration">
              {pagesAnalyzed} pages analyzed in {(duration / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
        <ScoreCard score={summary?.averageScore || 0} label="Average" size="large" />
      </div>

      {/* Site-wide Summary */}
      <div className="crawl-summary">
        <h3>📊 Site-wide Summary</h3>
        <div className="summary-scores">
          {summary?.categoryAverages &&
            Object.entries(summary.categoryAverages).map(([cat, score]) => (
              <div key={cat} className="category-score-card mini">
                <span className="cat-name">{cat}</span>
                <ScoreCard score={score} size="medium" />
              </div>
            ))}
        </div>
      </div>

      {/* Common Issues */}
      {summary?.commonIssues?.length > 0 && (
        <div className="crawl-issues">
          <h3>🔴 Most Common Issues</h3>
          <div className="issues-list">
            {summary.commonIssues.map((issue, i) => (
              <div key={i} className="issue-item issue-critical">
                <span className="issue-count">{issue.affectedPages} pages</span>
                <span className="issue-text">{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Worst Pages */}
      {summary?.worstPages?.length > 0 && (
        <div className="crawl-worst">
          <h3>⚠️ Pages Needing Most Attention</h3>
          <div className="pages-list">
            {summary.worstPages.map((page, i) => {
              const pageIdx = pages.findIndex((p) => p.url === page.url);
              return (
                <div
                  key={i}
                  className="page-item page-item-clickable"
                  onClick={() => pageIdx !== -1 && setSelectedPageIdx(pageIdx)}
                  title="Click to view full audit"
                >
                  <ScoreCard score={page.score} size="medium" />
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {page.url}
                  </a>
                  <span className="view-details-hint">View Details →</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Pages */}
      <div className="crawl-pages">
        <h3>📄 All Pages ({pages?.length || 0})</h3>
        <div className="pages-grid">
          {pages?.map((page, i) => (
            <div
              key={i}
              className={`page-card ${page.error ? 'error' : ''}`}
              onClick={() => !page.error && setSelectedPageIdx(i)}
              title={page.error ? page.error : 'Click to view full audit'}
            >
              <div className="page-card-header">
                {page.error ? (
                  <div className="page-error-badge">Error</div>
                ) : (
                  <ScoreCard score={page.results?.overallScore || 0} size="medium" />
                )}
                <div className="page-card-url">
                  <span className="page-path">
                    {(() => { try { return new URL(page.url).pathname || '/'; } catch { return page.url; } })()}
                  </span>
                  <span className="page-status">
                    {page.statusCode ? `HTTP ${page.statusCode}` : 'Failed'}
                  </span>
                </div>
                {!page.error && (
                  <div className="page-card-scores">
                    {['meta','headings','performance','keywords','links','images','mobile','accessibility','technical'].map((cat) => {
                      const s = page.results?.[cat]?.score;
                      if (s == null) return null;
                      return (
                        <span
                          key={cat}
                          className={`mini-score-pill ${s >= 80 ? 'good' : s >= 50 ? 'moderate' : 'poor'}`}
                          title={`${cat}: ${s}`}
                        >
                          {cat.slice(0,3)} {s}
                        </span>
                      );
                    })}
                  </div>
                )}
                {page.error && (
                  <div className="page-error-msg">{page.error}</div>
                )}
              </div>
              {!page.error && (
                <div className="page-card-footer">
                  <span className="view-full-audit">View Full Audit →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="ai-crawl-summary">
          <h3>🤖 AI Site Analysis</h3>
          {!aiSummary.success && (
            <div className="ai-warning">
              ⚠️ AI service unavailable. Manual review recommended.
            </div>
          )}
          <div className="ai-content markdown-body">
            <ReactMarkdown>{aiSummary.summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Per-Page Detail View ─────────────────────────────────
function PageDetailView({ page, pageIndex, totalPages, onBack, onPrev, onNext, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const results = page.results;

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-header-left">
          <button className="btn btn-ghost" onClick={onReset}>
            ← New Audit
          </button>
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back to Crawl
          </button>
          <div className="results-url">
            <h2>Page Audit Detail</h2>
            <a href={page.url} target="_blank" rel="noopener noreferrer">{page.url}</a>
            <span className="results-duration">
              Page {pageIndex + 1} of {totalPages}
              {page.statusCode && ` · HTTP ${page.statusCode}`}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="page-nav-buttons">
            <button
              className="btn btn-ghost"
              onClick={onPrev}
              disabled={!onPrev}
              title="Previous page"
            >
              ‹ Prev
            </button>
            <button
              className="btn btn-ghost"
              onClick={onNext}
              disabled={!onNext}
              title="Next page"
            >
              Next ›
            </button>
          </div>
          <ScoreCard score={results?.overallScore || 0} label="Score" size="large" />
        </div>
      </div>

      {page.error ? (
        <div className="crawl-error-state">
          <div className="check-item check-failed" style={{ marginTop: '2rem' }}>
            <span className="check-icon">✗</span>
            <span>Failed to audit this page: {page.error}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="tabs">
            {PAGE_TABS.map((tab) => (
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
            {activeTab === 'meta' && <MetaTab data={results.meta} />}
            {activeTab === 'headings' && <HeadingsTab data={results.headings} />}
            {activeTab === 'url' && <UrlTab data={results.url} />}
            {activeTab === 'performance' && <PerformanceTab data={results.performance} />}
            {activeTab === 'keywords' && <KeywordsTab data={results.keywords} />}
            {activeTab === 'links' && <LinksTab data={results.links} />}
            {activeTab === 'security' && <SecurityTab data={results.security} />}
            {activeTab === 'mobile' && <MobileTab data={results.mobile} />}
            {activeTab === 'accessibility' && <AccessibilityTab data={results.accessibility} />}
            {activeTab === 'technical' && <TechnicalTab data={results.technical} />}
            {activeTab === 'images' && <ImagesTab data={results.images} />}
            {activeTab === 'issues' && <IssuesTab results={results} />}
          </div>
        </>
      )}
    </div>
  );
}

export default CrawlResults;
