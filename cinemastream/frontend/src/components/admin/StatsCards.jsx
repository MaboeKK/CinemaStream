import React from 'react';
import './StatsCards.scss';

// Static placeholders -- no live endpoint backed these in the original either.
const STATS = [
  { title: 'Total Trailers Watched', value: 2456 },
  { title: 'Most Watched Trailer', value: 'Avengers: Secret Wars' },
  { title: 'Top Genre', value: 'Rom-Com' },
  { title: 'Rewatches', value: 989 },
  { title: 'Active Users', value: '156 of 872' },
];

const StatCard = ({ title, value }) => (
  <div className="stats-card">
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

const StatsCards = () => (
  <div className="stats-container">
    <h1 className="stats-title">Key Platform Stats</h1>
    <div className="stats-grid">
      {STATS.map((stat) => (
        <StatCard key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </div>
  </div>
);

export default StatsCards;
