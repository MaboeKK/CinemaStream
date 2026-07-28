import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import adminApi from '../../api/adminApi';
import './TopShowsChart.scss';

const TopShowsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    adminApi
      .getTopShows()
      .then((rows) => setData([...rows].sort((a, b) => b.total_views - a.total_views)))
      .catch(console.error);
  }, []);

  return (
    <div className="featured">
      <h2 className="featured-title">Most Watched Trailers</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="name"
            stroke="#ccc"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: '#ccc' }}
            tickMargin={10}
          />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff' }} />
          <Bar dataKey="total_views" name="Views">
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.type === 'Movie' ? '#e50914' : '#8884d8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopShowsChart;
