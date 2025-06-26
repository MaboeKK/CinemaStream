// import "./chart.scss";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Monthly registrations data
// const data = [
//   { month: "Jan", users: 120 },
//   { month: "Feb", users: 200 },
//   { month: "Mar", users: 300 },
//   { month: "Apr", users: 250 },
//   { month: "May", users: 400 },
//   { month: "Jun", users: 350 },
//   { month: "Jul", users: 450 },
//   { month: "Aug", users: 500 },
//   { month: "Sep", users: 550 },
//   { month: "Oct", users: 600 },
//   { month: "Nov", users: 650 },
//   { month: "Dec", users: 700 },
// ];

// const Chart = () => {
//   return (
//     <div className="chart">
//       <h3 className="chart-title">Monthly User Growth</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//         >
//           <CartesianGrid stroke="#333" strokeDasharray="3 3" />
//           <XAxis
//             dataKey="month"
//             stroke="#ccc"
//             label={{
//               value: "Month",
//               position: "insideBottom",
//               dy: 10,
//               fill: "#ccc",
//             }}
//           />
//           <YAxis
//             stroke="#ccc"
//             label={{
//               value: "Registered Users",
//               angle: -90,
//               position: "insideLeft",
//               dx: -10,
//               fill: "#ccc",
//             }}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#222",
//               border: "none",
//               color: "#fff",
//             }}
//             labelStyle={{ color: "#fff" }}
//           />
//           <Legend wrapperStyle={{ color: "#fff" }} />
//           <Line
//             type="monotone"
//             dataKey="users"
//             stroke="#e50914"
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Chart;

 import "./chart.scss";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((stats) => {
        // map stats.dailyUsers → [{ month: formattedDate, users: count }]
        const monthly = stats.dailyUsers.map((d) => ({
          month: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          users: Number(d.count),
        }));
        setData(monthly);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="chart">
      <h3 className="chart-title">Monthly User Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            stroke="#ccc"
            label={{ value: "Date", position: "insideBottom", dy: 10, fill: "#ccc" }}
          />
          <YAxis
            stroke="#ccc"
            label={{ value: "Registered Users", angle: -90, position: "insideLeft", dx: -10, fill: "#ccc" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Line
            type="monotone"
            dataKey="users"
            name="Registered Users"
            stroke="#e50914"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
 
