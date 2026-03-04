import React, { useState } from 'react';
import ScoreCard from './ScoreCard.jsx';
import ReactMarkdown from 'react-markdown';

function CrawlResults({ data, onReset }) {
  const [selectedPage, setSelectedPage] = useState(null);
  const { summary, pages, aiSummary, pagesAnalyzed, duration } = data;

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-header-left">
          <button className="btn btn-ghost" onClick={onReset}>
            ← New Audit
          </button>
          <div className="results-url">
            <h2>Site Crawl Results</h2>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              {data.url}
            </a>
            <span className="results-duration">
              {pagesAnalyzed} pages analyzed in {(duration / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
        <ScoreCard
          score={summary?.averageScore || 0}
          label="Average"
          size="large"
        />
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
            {summary.worstPages.map((page, i) => (
              <div key={i} className="page-item">
                <ScoreCard score={page.score} size="medium" />
                <a href={page.url} target="_blank" rel="noopener noreferrer">
                  {page.url}
                </a>
              </div>
            ))}
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
              className={`page-card ${selectedPage === i ? 'selected' : ''} ${page.error ? 'error' : ''}`}
              onClick={() => setSelectedPage(selectedPage === i ? null : i)}
            >
              <div className="page-card-header">
                {page.error ? (
                  <div className="page-error-badge">Error</div>
                ) : (
                  <ScoreCard
                    score={page.results?.overallScore || 0}
                    size="medium"
                  />
                )}
                <div className="page-card-url">
                  <span>{new URL(page.url).pathname || '/'}</span>
                  <span className="page-status">
                    {page.statusCode ? `HTTP ${page.statusCode}` : 'Failed'}
                  </span>
                </div>
              </div>

              {selectedPage === i && page.results && (
                <div className="page-details">
                  <div className="page-scores-mini">
                    {['meta', 'headings', 'performance', 'keywords', 'links'].map(
                      (cat) =>
                        page.results[cat] && (
                          <div key={cat} className="mini-score">
                            <span>{cat}</span>
                            <span
                              className={`mini-score-value ${
                                page.results[cat].score >= 80
                                  ? 'good'
                                  : page.results[cat].score >= 50
                                  ? 'moderate'
                                  : 'poor'
                              }`}
                            >
                              {page.results[cat].score}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                  {page.results.meta?.issues?.length > 0 && (
                    <div className="page-issues-mini">
                      {page.results.meta.issues.map((issue, j) => (
                        <div key={j} className="mini-issue">
                          {issue.message}
                        </div>
                      ))}
                    </div>
                  )}
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

export default CrawlResults;
