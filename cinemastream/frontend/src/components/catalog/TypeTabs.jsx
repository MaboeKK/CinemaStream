import React from 'react';
import './TypeTabs.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'movie', label: 'Movies' },
  { key: 'tv', label: 'TV Series' },
];

function TypeTabs({ activeTab, onChange, counts }) {
  return (
    <div className="type-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`type-tab${activeTab === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label} ({counts[tab.key] ?? 0})
        </button>
      ))}
    </div>
  );
}

export default TypeTabs;
