import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import adminApi from '../../api/adminApi';
import './ActivityHeatmap.scss';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PERIODS = ['Morning', 'Afternoon', 'Evening', 'Night'];

const ActivityHeatmap = () => {
  const [z, setZ] = useState([[]]);

  useEffect(() => {
    adminApi
      .getHeatmap()
      .then((rows) => {
        const matrix = PERIODS.map(() => DAYS.map(() => null));
        rows.forEach(({ day, period, count }) => {
          const xi = DAYS.indexOf(day);
          const yi = PERIODS.indexOf(period);
          if (xi >= 0 && yi >= 0) matrix[yi][xi] = count;
        });
        setZ(matrix);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="heatmap-container">
      <h3>Weekly User Activity</h3>
      <Plot
        data={[{ z, x: DAYS, y: PERIODS, type: 'heatmap', hoverongaps: false, colorscale: 'YlOrRd', showscale: true }]}
        layout={{
          autosize: true,
          margin: { l: 80, r: 10, t: 30, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: '#fff', family: 'inherit' },
          xaxis: { tickfont: { color: '#ccc', family: 'inherit' } },
          yaxis: { tickfont: { color: '#ccc', family: 'inherit' } },
        }}
        config={{ responsive: true }}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default ActivityHeatmap;
