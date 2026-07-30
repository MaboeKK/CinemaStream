import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminApi from '../../api/adminApi';
import './UserGrowthChart.scss';

const UserGrowthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getMonthlyGrowth()
      .then((rows) => {
        setData(
          rows.map((d) => ({
            month: new Date(d.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
            users: Number(d.count),
          }))
        );
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading chart data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="chart">
      <h3 className="chart-title">Monthly User Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            stroke="#b3b3b3"
            label={{ value: 'Month', position: 'insideBottom', dy: 10, fill: '#b3b3b3' }}
          />
          <YAxis
            stroke="#b3b3b3"
            label={{ value: 'Registered Users', angle: -90, position: 'insideLeft', dx: -10, fill: '#b3b3b3' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#f5f5f5' }}
            labelStyle={{ color: '#f5f5f5' }}
          />
          <Legend wrapperStyle={{ color: '#f5f5f5' }} />
          <Line type="monotone" dataKey="users" name="Registered Users" stroke="#e50914" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
