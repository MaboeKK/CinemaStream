

// import React from "react";
// import Plot from "react-plotly.js";

// const Heatmap = () => {
//   const data = [
//     {
//       z: [
//         [1, null, 30, 50, 1, 20, 60],
//         [20, 1, 60, 80, 30, 10, -10],
//         [30, 60, 1, -10, 20, 80, 40],
//       ],
//       x: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
//       y: ["Morning", "Afternoon", "Evening"],
//       type: "heatmap",
//       hoverongaps: false,
//       colorscale: "YlOrRd",
//     },
//   ];

//   return (
//     <div style={{ flex: 1, padding: "20px", background: "transparent" }}>
//       <h3
//         style={{
//           marginBottom: "10px",
//           color: "#e50914",
//           fontSize: "1.2rem",
//           fontWeight: 500,
//         }}
//       >
//         Weekly User Activity
//       </h3>
//       <Plot
//         data={data}
//         layout={{
//           autosize: true,
//           margin: { l: 40, r: 10, t: 10, b: 40 },
//           paper_bgcolor: "transparent",
//           plot_bgcolor: "transparent",
//           font: {
//             color: "#fff",
//             family: "inherit",
//           },
//           xaxis: {
//             tickfont: { color: "#ccc", family: "inherit" },
//           },
//           yaxis: {
//             tickfont: { color: "#ccc", family: "inherit" },
//           },
//         }}
//         config={{ responsive: true }}
//         style={{ width: "100%", height: "300px" }}
//       />
//     </div>
//   );
// };

// export default Heatmap;
import React from "react";
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

export default Heatmap;
