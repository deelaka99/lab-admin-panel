import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Charts() {
  const data = [
    { name: "Mon", uv: 400, pv: 2400, amt: 2400 },
    { name: "Tue", uv: 300, pv: 200, amt: 2000 },
    { name: "Wen", uv: 200, pv: 200, amt: 2000 },
    { name: "Thu", uv: 500, pv: 200, amt: 2000 },
    { name: "Fri", uv: 500, pv: 200, amt: 2000 },
    { name: "Sat", uv: 500, pv: 200, amt: 2000 },
    { name: "Sun", uv: 400, pv: 2400, amt: 2400 },
  ];
  return (
    <div className="flex justify-center items-center h-5/6 w-full">
      <LineChart
        className="w-full h-full"
        width={600}
        height={200}
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#0AA1DD" />
        <CartesianGrid stroke="#85F4FF" strokeDasharray="6 6" />
        <XAxis dataKey="name" stroke="#B3B5B6"/>
        <YAxis stroke="#B3B5B6"/>
        <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#D9D9D9' }} />
      </LineChart>
    </div>
  );
}

export default Charts;
