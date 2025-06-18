import "./featured.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Monday", uv: 4000, pv: 2400 },
  { name: "Tuesday", uv: 3000, pv: 1398 },
  { name: "Wednesday", uv: 2000, pv: 9800 },
  { name: "Thursday", uv: 2780, pv: 3908 },
  { name: "Friday", uv: 1890, pv: 4800 },
  { name: "Saturday", uv: 2390, pv: 3800 },
  { name: "Sunday", uv: 3490, pv: 4300 },
];

const Featured = () => {
  return (
    <div className="featured">
      <h2 className="featured-title">Top performing shows</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
          <Legend />
          <Bar dataKey="pv" name="Movies" fill="#e50914" />
          <Bar dataKey="uv" name="Series" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Featured;
