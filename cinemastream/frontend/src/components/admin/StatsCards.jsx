import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import './StatsCards.scss';

// "Top Genre" has no honest source: watched_history never stored a genre
// (TMDB genre ids are resolved client-side only, never sent to /watch), so
// unlike the other four cards it can't be backed by a real query -- it's
// labeled as placeholder data rather than presented as if it were live.
const TOP_GENRE_PLACEHOLDER = 'Rom-Com';

const StatCard = ({ title, value, placeholder }) => (
  <div className="stats-card">
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value}</p>
    {placeholder && <span className="stat-placeholder-badge">Demo data</span>}
  </div>
);

const StatsCards = () => {
  const [overview, setOverview] = useState(null);
  const [topShow, setTopShow] = useState(null);

  useEffect(() => {
    adminApi.getOverview().then(setOverview).catch(console.error);
    adminApi
      .getTopShows()
      .then((rows) => setTopShow(rows[0] ?? null))
      .catch(console.error);
  }, []);

  const stats = [
    { title: 'Total Trailers Watched', value: overview ? overview.totalWatched : '—' },
    { title: 'Most Watched Trailer', value: topShow ? topShow.name : '—' },
    { title: 'Top Genre', value: TOP_GENRE_PLACEHOLDER, placeholder: true },
    { title: 'Rewatches', value: overview ? overview.rewatches : '—' },
    {
      title: 'Active Users',
      value: overview ? `${overview.activeUsers} of ${overview.totalUsers}` : '—',
    },
  ];

  return (
    <div className="stats-container">
      <h1 className="stats-title">Key Platform Stats</h1>
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} placeholder={stat.placeholder} />
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
