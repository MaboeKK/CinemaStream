import "./featured.scss"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Tues',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Wedn',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Thur',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Fri',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Sart',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Sun',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


const Featured = () => {
     return (
        <div className="featured">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
         <Bar dataKey="pv" name="Movie" fill="#8884d8" />
         <Bar dataKey="uv" name="Series" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      </div>
    );
    
}

export default Featured