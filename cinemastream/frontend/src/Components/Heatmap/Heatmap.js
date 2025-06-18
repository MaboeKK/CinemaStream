import "./heatmap.scss"

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
// import React, {Component} from 'react';

// import {XYPlot, XAxis, YAxis, HeatmapSeries, Hint} from 'index';

// export default class HeatmapChart extends Component {
//   state = {
//     value: false
//   };

//   render() {
//     const {value} = this.state;
//     return (
//       <XYPlot width={300} height={300}>
//         <XAxis />
//         <YAxis />
//         <HeatmapSeries
//           className="heatmap-series-example"
//           onValueMouseOver={v => this.setState({value: v})}
//           onSeriesMouseOut={v => this.setState({value: false})}
//           data={[
//             {x: 1, y: 0, color: 10},
//             {x: 1, y: 5, color: 10},
//             {x: 1, y: 10, color: 6},
//             {x: 1, y: 15, color: 7},
//             {x: 2, y: 0, color: 12},
//             {x: 2, y: 5, color: 2},
//             {x: 2, y: 10, color: 1},
//             {x: 2, y: 15, color: 12},
//             {x: 3, y: 0, color: 9},
//             {x: 3, y: 5, color: 2},
//             {x: 3, y: 10, color: 6},
//             {x: 3, y: 15, color: 12}
//           ]}
//         />
//         {value !== false && <Hint value={value} />}
//       </XYPlot>
//     );
//   }
// }