import "./featured.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Example data: each item has name, views, and type
const rawData = [
  { name: "Inception", views: 8500, type: "Movie" },
  { name: "Breaking Bad", views: 8800, type: "Series" },
  { name: "Interstellar", views: 7200, type: "Movie" },
  { name: "Stranger Things", views: 7800, type: "Series" },
  { name: "Dune", views: 6300, type: "Movie" },
  { name: "Dark", views: 7000, type: "Series" },
];

const Featured = () => {
  // Create a sorted copy of the data
  const data = [...rawData].sort((a, b) => b.views - a.views);

  return (
    <div className="featured">
      <h2 className="featured-title">Top Performing Shows</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="name"
            stroke="#ccc"
            angle={360}
            textAnchor="end"
            interval={0}
          />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#222",
              border: "none",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="views" name="Views">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.type === "Movie" ? "#e50914" : "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Featured;

/* import "./featured.scss";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Featured = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/analytics/top-shows")
      .then((res) => res.json())
      .then((rows) => {
        // sort descending by views
        const sorted = rows.sort((a, b) => b.views - a.views);
        setData(sorted);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="featured">
      <h2 className="featured-title">Top Performing Shows</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="name"
            stroke="#ccc"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: "#ccc" }}
            tickMargin={10}
          />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="views" name="Views">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.type === "Movie" ? "#e50914" : "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Featured; */
