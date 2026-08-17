import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminApi from '../../api/adminApi';
import './UserGrowthChart.scss';

// Two genuinely different quantities on two axes -- new signups (small,
// can go up or down month to month) and cumulative total (large, only
// ever grows). Sharing one axis would flatten the smaller line to near
// zero once the total climbs.
const UserGrowthChart = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getMonthlyGrowth()
      .then((rows) => {
        setData(
          rows.map((d) => ({
            month: new Date(d.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
            newSignups: d.newSignups,
            cumulativeTotal: d.cumulativeTotal,
          }))
        );
      })
      .catch((err) => setError(err.message || 'Failed to load'));
  }, []);

  return (
    <div className="chart">
      <h3 className="chart-title">Monthly User Growth</h3>
      {error ? (
        <div className="chart-status error">Error: {error}</div>
      ) : data === null ? (
        <div className="chart-status">Loading chart data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              stroke="#b3b3b3"
              label={{ value: 'Month', position: 'insideBottom', dy: 10, fill: '#b3b3b3' }}
            />
            <YAxis
              yAxisId="total"
              stroke="#b3b3b3"
              allowDecimals={false}
              label={{ value: 'Total Registered Users', angle: -90, position: 'insideLeft', dx: -10, fill: '#b3b3b3' }}
            />
            <YAxis
              yAxisId="new"
              orientation="right"
              stroke="#b3b3b3"
              allowDecimals={false}
              label={{ value: 'New Signups', angle: 90, position: 'insideRight', dx: 10, fill: '#b3b3b3' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#f5f5f5' }}
              labelStyle={{ color: '#f5f5f5' }}
            />
            <Legend wrapperStyle={{ color: '#f5f5f5' }} />
            <Line
              yAxisId="total"
              type="monotone"
              dataKey="cumulativeTotal"
              name="Total Registered Users"
              stroke="#f453a6"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="new"
              type="monotone"
              dataKey="newSignups"
              name="New Signups"
              stroke="#8b5cf6"
              strokeDasharray="4 3"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserGrowthChart;
