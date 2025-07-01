/* import React from "react";
import Plot from "react-plotly.js";

const Heatmap = () => {
  const data = [
    {
      z: [
        [1, null, 30, 50, 1, 20, 60],
        [20, 1, 60, 80, 30, 10, -10],
        [30, 60, 1, -10, 20, 80, 40],
      ],
      x: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      y: ["Morning", "Afternoon", "Evening"],
      type: "heatmap",
      hoverongaps: false,
      colorscale: "YlOrRd",
    },
  ];

  return (
    <div className="heatmap-container">
      <h3 className="featured-title">Weekly User Activity</h3>
      <Plot
        data={data}
        layout={{
          autosize: true,
          margin: { l: 80, r: 10, t: 10, b: 40 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { color: "#fff", family: "inherit" },
          xaxis: { tickfont: { color: "#ccc", family: "inherit" } },
          yaxis: { tickfont: { color: "#ccc", family: "inherit" } },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
};

export default Heatmap; */

import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const Heatmap = () => {
  const [x, setX] = useState([]); // days
  const [y, setY] = useState([]); // periods
  const [z, setZ] = useState([[]]);

  useEffect(() => {
    fetch("/api/stats/heatmap")
      .then((res) => res.json())
      .then((rows) => {
        // Define the full set of days & periods in the order you want
        const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const periods = ["Morning","Afternoon","Evening","Night"];

        // Initialize matrix with nulls
        const matrix = periods.map(() => days.map(() => null));

        // Fill the matrix
        rows.forEach(({ day, period, count }) => {
          const xi = days.indexOf(day);
          const yi = periods.indexOf(period);
          if (xi >= 0 && yi >= 0) {
            matrix[yi][xi] = count;
          }
        });

        setX(days);
        setY(periods);
        setZ(matrix);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="heatmap-container">
      <h3 className="featured-title">Weekly User Activity</h3>
      <Plot
        data={[
          {
            z,
            x,
            y,
            type: "heatmap",
            hoverongaps: false,
            colorscale: "YlOrRd",
            showscale: true,
          },
        ]}
        layout={{
          autosize: true,
          margin: { l: 80, r: 10, t: 30, b: 40 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { color: "#fff", family: "inherit" },
          xaxis: {
            tickfont: { color: "#ccc", family: "inherit" },
          },
          yaxis: {
            tickfont: { color: "#ccc", family: "inherit" },
            autorange: "reversed", // so Morning is at top
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
};

export default Heatmap;