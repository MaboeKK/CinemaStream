import "./heatmap.scss"
// src/components/Heatmap/Heatmap.js
import React from "react";
import Plot from "react-plotly.js";

const Heatmap = () => {
  const data = [
    {
      z: [
        [1, null, 30, 50, 1,20,60],
        [20, 1, 60, 80, 30,10,-10],
        [30, 60, 1, -10, 20,80,40],
      ],
      x: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday","Sunday"],
      y: ["Morning", "Afternoon", "Evening"],
      type: "heatmap",
      hoverongaps: false,
      colorscale: "YlOrRd",
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot
        data={data}
        layout={{
          title: "Weekly Activity Heatmap",
          width: 600,
          height: 400,
        }}
      />
    </div>
  );
};

export default Heatmap;
