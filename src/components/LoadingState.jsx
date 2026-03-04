import React from 'react';

function LoadingState({ message, mode }) {
  const steps = mode === 'audit' 
    ? ['Fetching page content', 'Parsing HTML structure', 'Analyzing SEO factors', 'Checking robots.txt & sitemap', 'Generating AI recommendations']
    : ['Discovering pages', 'Crawling & analyzing', 'Generating site summary'];

  return (
    <div className="loading-state">
      <div className="loading-animation">
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay-1"></div>
        <div className="pulse-ring delay-2"></div>
        <div className="loading-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>
      <h3>{message || 'Analyzing...'}</h3>
      <div className="loading-steps">
        {steps.map((step, i) => (
          <div key={i} className="loading-step">
            <div className="step-dot"></div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingState;
