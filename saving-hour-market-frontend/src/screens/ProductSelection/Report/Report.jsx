import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ManagementMenu from "../../../components/ManagementMenu/ManagementMenu";

const Report = () => {
  const menuTabs = [
    {
      display: "Hệ thống",
      to: "/productselectionreport",
    },
    {
      display: "Siêu thị",
      to: "/supermarketreport",
    },
  ];
  const data = [
    {
      name: "JAN",
      Bán: 4000,
      Nhập: 2400,
    },
    {
      name: "FEB",
      Bán: 3000,
      Nhập: 1398,
    },
    {
      name: "MAR",
      Bán: 2000,
      Nhập: 1000,
    },
    {
      name: "APR",
      Bán: 2780,
      Nhập: 3908,
    },
    {
      name: "MAY",
      Bán: 1890,
      Nhập: 4800,
    },
    {
      name: "JUN",
      Bán: 2390,
      Nhập: 3800,
    },
    {
      name: "JUL",
      Bán: 3490,
      Nhập: 4300,
    },
    {
      name: "AUG",
      Bán: 3490,
      Nhập: 4300,
    },
    {
      name: "SEP",
      Bán: 3490,
      Nhập: 4300,
    },
    {
      name: "OCT",
      Bán: 3490,
      Nhập: 4300,
    },
    {
      name: "NOV",
      Bán: 3490,
      Nhập: 4300,
    },
    {
      name: "DEC",
      Bán: 3490,
      Nhập: 4300,
    },
  ];
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <BarChart
        width={800}
        height={400}
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
        <Bar dataKey="Bán" fill="#8884d8" />
        <Bar dataKey="Nhập" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default Report;
