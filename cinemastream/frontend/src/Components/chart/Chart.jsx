import "./chart.scss"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Monday',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Tuesday',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Wednsday',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Thursday',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Friday',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Saturday',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Sunday',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const Chart = () => {
  return (
    <div className="chart">
      <h3 style={{ marginBottom: "10px" }}>Weekly View Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" name="Movies" stroke="#e50914" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" name="Series" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default Chart