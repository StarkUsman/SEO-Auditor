import React, { useState, useMemo } from 'react';
import { optimizeContent } from '../services/api';

const CATEGORY_LABELS = {
  keyword: { label: 'Keyword', icon: '🔑', color: '#6366f1' },
  readability: { label: 'Readability', icon: '📖', color: '#22c55e' },
  structure: { label: 'Structure', icon: '📑', color: '#f97316' },
  tone: { label: 'Tone', icon: '🎨', color: '#eab308' },
  seo: { label: 'SEO', icon: '🏷️', color: '#8b5cf6' },
  grammar: { label: 'Grammar', icon: '✏️', color: '#64748b' },
};

const IMPACT_COLORS = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
};

function ContentOptimizer() {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [contentType, setContentType] = useState('blog');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Track which suggestions have been accepted/rejected
  const [accepted, setAccepted] = useState(new Set());
  const [rejected, setRejected] = useState(new Set());

  // The live-editing text (starts as original, updated as suggestions are accepted)
  const [liveText, setLiveText] = useState('');

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError('Please enter at least 10 characters of text.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAccepted(new Set());
    setRejected(new Set());

    try {
      const data = await optimizeContent({
        text: text.trim(),
        keywords: keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
        tone,
        contentType,
      });
      setResult(data);
      setLiveText(text.trim());
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setAccepted(new Set());
    setRejected(new Set());
    setLiveText('');
  };

  const applySuggestion = (suggestion) => {
    setLiveText((prev) => {
      if (!prev.includes(suggestion.original)) return prev;
      return prev.replace(suggestion.original, suggestion.replacement);
    });
    setAccepted((prev) => new Set([...prev, suggestion.id]));
    setRejected((prev) => {
      const next = new Set(prev);
      next.delete(suggestion.id);
      return next;
    });
  };

  const undoSuggestion = (suggestion) => {
    setLiveText((prev) => {
      if (!prev.includes(suggestion.replacement)) return prev;
      return prev.replace(suggestion.replacement, suggestion.original);
    });
    setAccepted((prev) => {
      const next = new Set(prev);
      next.delete(suggestion.id);
      return next;
    });
  };

  const rejectSuggestion = (suggestion) => {
    // If it was already accepted, undo it first
    if (accepted.has(suggestion.id)) {
      undoSuggestion(suggestion);
    }
    setRejected((prev) => new Set([...prev, suggestion.id]));
  };

  const acceptAll = () => {
    if (!result?.suggestions) return;
    let updatedText = text.trim();
    const newAccepted = new Set();
    result.suggestions.forEach((s) => {
      if (!rejected.has(s.id) && updatedText.includes(s.original)) {
        updatedText = updatedText.replace(s.original, s.replacement);
        newAccepted.add(s.id);
      }
    });
    setLiveText(updatedText);
    setAccepted(newAccepted);
  };

  // Pending = not yet accepted or rejected
  const pending = useMemo(() => {
    if (!result?.suggestions) return [];
    return result.suggestions.filter((s) => !accepted.has(s.id) && !rejected.has(s.id));
  }, [result, accepted, rejected]);

  const acceptedList = useMemo(() => {
    if (!result?.suggestions) return [];
    return result.suggestions.filter((s) => accepted.has(s.id));
  }, [result, accepted]);

  const rejectedList = useMemo(() => {
    if (!result?.suggestions) return [];
    return result.suggestions.filter((s) => rejected.has(s.id));
  }, [result, rejected]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(liveText);
  };

  // Highlight accepted changes in the live text
  const renderHighlightedText = () => {
    if (!result?.suggestions || acceptedList.length === 0) {
      return <span>{liveText}</span>;
    }

    let remaining = liveText;
    const parts = [];
    let key = 0;

    // Build a list of replacement strings that are currently in the text
    const activeReplacements = acceptedList
      .filter((s) => liveText.includes(s.replacement))
      .sort((a, b) => liveText.indexOf(a.replacement) - liveText.indexOf(b.replacement));

    if (activeReplacements.length === 0) {
      return <span>{liveText}</span>;
    }

    for (const s of activeReplacements) {
      const idx = remaining.indexOf(s.replacement);
      if (idx === -1) continue;
      if (idx > 0) {
        parts.push(<span key={key++}>{remaining.substring(0, idx)}</span>);
      }
      parts.push(
        <mark key={key++} className="highlight-accepted" title={`Original: "${s.original}"`}>
          {s.replacement}
        </mark>
      );
      remaining = remaining.substring(idx + s.replacement.length);
    }
    if (remaining) {
      parts.push(<span key={key++}>{remaining}</span>);
    }
    return parts;
  };

  return (
    <div className="optimizer-section">
      {!result ? (
        <>
          <div className="form-hero">
            <h2>Content Optimizer</h2>
            <p>
              Paste or type your content and let AI suggest SEO optimizations.
              Review, accept or reject each suggestion individually.
            </p>
          </div>

          <form onSubmit={handleOptimize} className="optimizer-form">
            <div className="form-group">
              <label className="form-label">Your Content</label>
              <textarea
                className="content-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your paragraph, article, or any content here..."
                rows={10}
                required
                disabled={loading}
              />
              <span className="char-count">{text.length} characters · ~{Math.round(text.split(/\s+/).filter(Boolean).length)} words</span>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Target Keywords <span className="optional">(optional, comma-separated)</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., SEO tips, content marketing, organic traffic"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tone</label>
                <select
                  className="form-select"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="academic">Academic</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="conversational">Conversational</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Content Type</label>
                <select
                  className="form-select"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  disabled={loading}
                >
                  <option value="blog">Blog Post</option>
                  <option value="product">Product Description</option>
                  <option value="landing">Landing Page</option>
                  <option value="article">News Article</option>
                  <option value="email">Email Copy</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading || text.trim().length < 10}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Analyzing content...
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Get Optimization Suggestions
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-card">
              <div className="error-icon">!</div>
              <h3>Optimization Failed</h3>
              <p>{error}</p>
            </div>
          )}

          <div className="features-grid optimizer-features">
            <div className="feature-card">
              <div className="feature-icon">🔑</div>
              <h3>Keyword Integration</h3>
              <p>Naturally weaves target keywords into your content</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Readability</h3>
              <p>Improves readability while boosting SEO signals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h3>Meta Suggestions</h3>
              <p>Generates optimized title tags and meta descriptions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Accept or Reject</h3>
              <p>Review each suggestion and choose what to apply</p>
            </div>
          </div>
        </>
      ) : (
        <div className="optimizer-results">
          {/* Header */}
          <div className="results-header">
            <div>
              <h2>Optimization Suggestions</h2>
              <p className="results-meta">
                {result.suggestions?.length || 0} suggestions · Provider: {result.provider} · {(result.duration / 1000).toFixed(1)}s
              </p>
            </div>
            <div className="results-actions">
              <button className="btn btn-secondary" onClick={handleReset}>
                ← Start Over
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="suggestion-stats">
            <div className="stat-item stat-pending">
              <span className="stat-num">{pending.length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item stat-accepted">
              <span className="stat-num">{acceptedList.length}</span>
              <span className="stat-label">Accepted</span>
            </div>
            <div className="stat-item stat-rejected">
              <span className="stat-num">{rejectedList.length}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>

          {/* Two-column layout: suggestions + live preview */}
          <div className="suggestions-layout">
            {/* Left: Suggestion cards */}
            <div className="suggestions-panel">
              <div className="panel-header">
                <h3>Suggestions</h3>
                {pending.length > 0 && (
                  <button className="btn btn-accept-all" onClick={acceptAll}>
                    ✓ Accept All ({pending.length})
                  </button>
                )}
              </div>

              {result.suggestions?.length === 0 && (
                <div className="empty-suggestions">
                  <p>No optimization suggestions could be generated. Try with different content or keywords.</p>
                </div>
              )}

              {result.suggestions?.map((s) => {
                const isAccepted = accepted.has(s.id);
                const isRejected = rejected.has(s.id);
                const cat = CATEGORY_LABELS[s.category] || CATEGORY_LABELS.seo;

                return (
                  <div
                    key={s.id}
                    className={`suggestion-card ${isAccepted ? 'accepted' : ''} ${isRejected ? 'rejected' : ''}`}
                  >
                    <div className="suggestion-header">
                      <div className="suggestion-tags">
                        <span className="suggestion-category" style={{ color: cat.color }}>
                          {cat.icon} {cat.label}
                        </span>
                        <span
                          className="suggestion-impact"
                          style={{ color: IMPACT_COLORS[s.impact] || IMPACT_COLORS.medium }}
                        >
                          {s.impact} impact
                        </span>
                      </div>
                      <span className="suggestion-id">#{s.id}</span>
                    </div>

                    <div className="suggestion-diff">
                      <div className="diff-remove">
                        <span className="diff-label">−</span>
                        <span className="diff-text">{s.original}</span>
                      </div>
                      <div className="diff-add">
                        <span className="diff-label">+</span>
                        <span className="diff-text">{s.replacement}</span>
                      </div>
                    </div>

                    <p className="suggestion-reason">{s.reason}</p>

                    <div className="suggestion-actions">
                      {!isAccepted && !isRejected && (
                        <>
                          <button
                            className="btn btn-accept"
                            onClick={() => applySuggestion(s)}
                          >
                            ✓ Accept
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => rejectSuggestion(s)}
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                      {isAccepted && (
                        <button
                          className="btn btn-undo"
                          onClick={() => undoSuggestion(s)}
                        >
                          ↩ Undo
                        </button>
                      )}
                      {isRejected && (
                        <button
                          className="btn btn-undo"
                          onClick={() => {
                            setRejected((prev) => {
                              const next = new Set(prev);
                              next.delete(s.id);
                              return next;
                            });
                          }}
                        >
                          ↩ Reconsider
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Meta suggestions */}
              {result.metaSuggestions && (result.metaSuggestions.title || result.metaSuggestions.description) && (
                <div className="meta-suggestions-card">
                  <h3>💡 Meta Tag Suggestions</h3>
                  {result.metaSuggestions.title && (
                    <div className="meta-item">
                      <span className="meta-label">Title</span>
                      <span className="meta-value">{result.metaSuggestions.title}</span>
                    </div>
                  )}
                  {result.metaSuggestions.description && (
                    <div className="meta-item">
                      <span className="meta-label">Description</span>
                      <span className="meta-value">{result.metaSuggestions.description}</span>
                    </div>
                  )}
                  {result.metaSuggestions.h1 && (
                    <div className="meta-item">
                      <span className="meta-label">H1</span>
                      <span className="meta-value">{result.metaSuggestions.h1}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Live preview */}
            <div className="preview-panel">
              <div className="panel-header">
                <h3>Live Preview</h3>
                <button className="btn btn-secondary btn-sm" onClick={copyToClipboard}>
                  📋 Copy Text
                </button>
              </div>
              <div className="preview-content">
                {renderHighlightedText()}
              </div>
              <div className="preview-footer">
                <span>{liveText.length} chars · ~{Math.round(liveText.split(/\s+/).filter(Boolean).length)} words</span>
                <span>{acceptedList.length} change{acceptedList.length !== 1 ? 's' : ''} applied</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentOptimizer;
