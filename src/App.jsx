import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login.jsx';
import AuditForm from './components/AuditForm.jsx';
import AuditResults from './components/AuditResults.jsx';
import CrawlResults from './components/CrawlResults.jsx';
import LoadingState from './components/LoadingState.jsx';
import ContentOptimizer from './components/ContentOptimizer.jsx';
import WebsiteOptimizer from './components/WebsiteOptimizer.jsx';
import { runAudit, runCrawl } from './services/api';
import './App.css';

function AppContent() {
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('audit');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [auditData, setAuditData] = useState(null);
  const [crawlData, setCrawlData] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('audit');

  const handleAudit = async (url, options) => {
    setLoading(true);
    setError(null);
    setAuditData(null);
    setCrawlData(null);

    try {
      if (mode === 'audit') {
        setLoadingMessage('Fetching and analyzing page...');
        const data = await runAudit(url, options.useJavaScript);
        setAuditData(data);
      } else {
        setLoadingMessage(`Crawling site (up to ${options.maxPages} pages)...`);
        const data = await runCrawl(url, options.maxPages);
        setCrawlData(data);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'An error occurred during the audit'
      );
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setAuditData(null);
    setCrawlData(null);
    setError(null);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    handleReset();
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#grad)" />
              <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <h1>SEO Audit Tool</h1>
          </div>
          <nav className="main-nav">
            <button
              className={`nav-btn ${activePage === 'audit' ? 'active' : ''}`}
              onClick={() => handlePageChange('audit')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              SEO Audit
            </button>
            <button
              className={`nav-btn ${activePage === 'content' ? 'active' : ''}`}
              onClick={() => handlePageChange('content')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Content Optimizer
            </button>
            <button
              className={`nav-btn ${activePage === 'website' ? 'active' : ''}`}
              onClick={() => handlePageChange('website')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              Website Optimizer
            </button>
          </nav>
          <div className="header-right">
            <span className="badge">AI Powered</span>
            <div className="user-menu">
              <span className="user-name">{user?.name}</span>
              <button className="logout-btn" onClick={logout} title="Sign out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* SEO Audit Page */}
        {activePage === 'audit' && (
          <>
            {!auditData && !crawlData && (
              <AuditForm
                onSubmit={handleAudit}
                loading={loading}
                mode={mode}
                onModeChange={setMode}
              />
            )}

            {loading && <LoadingState message={loadingMessage} mode={mode} />}

            {error && (
              <div className="error-card">
                <div className="error-icon">!</div>
                <h3>Audit Failed</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={handleReset}>
                  Try Again
                </button>
              </div>
            )}

            {auditData && (
              <AuditResults data={auditData} onReset={handleReset} />
            )}

            {crawlData && (
              <CrawlResults data={crawlData} onReset={handleReset} />
            )}
          </>
        )}

        {/* Content Optimizer Page */}
        {activePage === 'content' && <ContentOptimizer />}

        {/* Website Optimizer Page */}
        {activePage === 'website' && <WebsiteOptimizer />}
      </main>

      <footer className="app-footer">
        <p>AI SEO Audit Tool &mdash; Powered by Claude &amp; Gemini</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
