import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import adminApi from '../../api/adminApi';
import './TopShowsChart.scss';

// Brand gradient stops (--gradient-accent) rather than a generic red/orange
// pair, so the two content types read as this app's palette.
const COLORS = { Movie: '#ff8a3d', Series: '#8b5cf6' };

const TopShowsChart = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getTopShows()
      .then((rows) => setData([...rows].sort((a, b) => b.total_views - a.total_views)))
      .catch((err) => setError(err.message || 'Failed to load'));
  }, []);

  return (
    <div className="featured">
      <h2 className="featured-title">Most Watched Trailers</h2>
      {error ? (
        <div className="chart-status error">Error: {error}</div>
      ) : data === null ? (
        <div className="chart-status">Loading chart data...</div>
      ) : data.length === 0 ? (
        <div className="chart-status">No trailer plays recorded yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="name"
              stroke="#b3b3b3"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: '#b3b3b3' }}
              tickMargin={10}
            />
            <YAxis stroke="#b3b3b3" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#f5f5f5' }}
              labelStyle={{ color: '#f5f5f5' }}
            />
            <Legend
              payload={Object.entries(COLORS).map(([type, color]) => ({ value: type, type: 'square', color }))}
              wrapperStyle={{ color: '#f5f5f5' }}
            />
            <Bar dataKey="total_views" name="Views">
              {data.map((entry) => (
                <Cell key={`${entry.type}-${entry.content_id}`} fill={COLORS[entry.type]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopShowsChart;
