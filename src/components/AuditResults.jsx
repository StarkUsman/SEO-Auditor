import React, { useState } from 'react';
import ScoreCard from './ScoreCard.jsx';
import {
  OverviewTab, IssuesTab, MetaTab, UrlTab, SecurityTab, HeadingsTab,
  PerformanceTab, KeywordsTab, LinksTab, AccessibilityTab, TechnicalTab,
  ImagesTab, MobileTab, AITab,
} from './AuditTabs.jsx';

function AuditResults({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { results, aiRecommendations, url, duration } = data;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'meta', label: 'Meta Tags', icon: '🏷️' },
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
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
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
        {activeTab === 'ai' && <AITab recommendations={aiRecommendations} />}
      </div>
    </div>
  );
}

export default AuditResults;
