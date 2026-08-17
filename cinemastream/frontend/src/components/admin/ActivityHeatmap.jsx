import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import './ActivityHeatmap.scss';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PERIODS = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Hand-built CSS grid instead of a charting library -- this was the only
// consumer of react-plotly.js/plotly.js in the app, a heavy dependency for
// one heatmap. A day-by-time-of-day grid is exactly the shape a plain CSS
// grid does well (see GitHub's contribution graph for the same pattern),
// and it lets the color scale use the site's own accent instead of
// Plotly's default YlOrRd.
const ActivityHeatmap = () => {
  const [counts, setCounts] = useState(null); // Map<"day|period", number>
  const [maxCount, setMaxCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getHeatmap()
      .then((rows) => {
        const map = new Map(rows.map((r) => [`${r.day}|${r.period}`, r.count]));
        setCounts(map);
        setMaxCount(Math.max(0, ...rows.map((r) => r.count)));
      })
      .catch((err) => setError(err.message || 'Failed to load'));
  }, []);

  const cellStyle = (count) => {
    if (!count) return undefined;
    const intensity = maxCount > 0 ? count / maxCount : 0;
    return { backgroundColor: `rgba(244, 83, 166, ${0.12 + intensity * 0.78})` };
  };

  return (
    <div className="heatmap-container">
      <h3>Activity by Day &amp; Time</h3>
      {error ? (
        <div className="chart-status error">Error: {error}</div>
      ) : counts === null ? (
        <div className="chart-status">Loading chart data...</div>
      ) : maxCount === 0 ? (
        <div className="chart-status">No trailer plays recorded yet.</div>
      ) : (
        <div className="heatmap-grid" style={{ gridTemplateColumns: `80px repeat(${DAYS.length}, 1fr)` }}>
          <div className="heatmap-cell heatmap-corner" />
          {DAYS.map((day) => (
            <div className="heatmap-cell heatmap-day-label" key={day}>
              {day.slice(0, 3)}
            </div>
          ))}
          {PERIODS.map((period) => (
            <React.Fragment key={period}>
              <div className="heatmap-cell heatmap-period-label">{period}</div>
              {DAYS.map((day) => {
                const count = counts.get(`${day}|${period}`) || 0;
                return (
                  <div
                    className="heatmap-cell heatmap-value"
                    key={`${day}-${period}`}
                    style={cellStyle(count)}
                    title={`${day}, ${period}: ${count} play${count === 1 ? '' : 's'}`}
                  >
                    {count > 0 ? count : ''}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
