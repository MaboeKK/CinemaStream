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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats/monthly-growth");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const monthlyGrowth = await response.json();
        
        // Map monthlyGrowth → [{ month: formattedDate, users: count }]
        const monthly = monthlyGrowth.map((d) => ({
          month: new Date(d.date).toLocaleDateString(undefined, { month: "short", year: "numeric" }),
          users: Number(d.count),
        }));
        
        setData(monthly);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading chart data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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
            label={{ value: "Month", position: "insideBottom", dy: 10, fill: "#ccc" }}
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

 
