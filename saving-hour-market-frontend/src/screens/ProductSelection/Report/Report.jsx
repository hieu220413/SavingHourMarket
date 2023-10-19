import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  AreaChart,
  Area,
  Brush,
  ReferenceLine,
} from "recharts";
import ManagementMenu from "../../../components/ManagementMenu/ManagementMenu";
import "./Report.scss";
import { Box, Stack, Typography } from "@mui/material";

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

  const data02 = [
    {
      name: "2020",
      doanhthu: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "2021",
      doanhthu: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "2022",
      doanhthu: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "2023",
      doanhthu: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "2024",
      doanhthu: 1209,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "2025",
      doanhthu: 4700,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "2026",
      doanhthu: 3520,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "2027",
      doanhthu: 6520,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "2028",
      doanhthu: 1202,
      pv: 4800,
      amt: 2181,
    },
  ];

  const data01 = [
    { name: "Quý 1", value: 40.54 },
    { name: "Quý 2", value: 38.63 },
    { name: "Quý 3", value: 67.75 },
    { name: "Quý 4", value: 23.782 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const data = [
    {
      name: "JAN",
      Bán: 150.75,
      Nhập: 78.8,
    },
    {
      name: "FEB",
      Bán: 138.92,
      Nhập: 67.7,
    },
    {
      name: "MAR",
      Bán: 160.78,
      Nhập: 80.6,
    },
    {
      name: "APR",
      Bán: 153.73,
      Nhập: 77.32,
    },
    {
      name: "MAY",
      Bán: 157.8,
      Nhập: 73.23,
    },
    {
      name: "JUN",
      Bán: 128.79,
      Nhập: 50.4,
    },
    {
      name: "JUL",
      Bán: 138.72,
      Nhập: 53.7,
    },
    {
      name: "AUG",
      Bán: 178.94,
      Nhập: 95.5,
    },
    {
      name: "SEP",
      Bán: 165.49,
      Nhập: 79.81,
    },
    {
      name: "OCT",
      Bán: 150.96,
      Nhập: 68.8,
    },
    {
      name: "NOV",
      Bán: 156.7,
      Nhập: 67.63,
    },
    {
      name: "DEC",
      Bán: 134.75,
      Nhập: 62.9,
    },
  ];
  const minOffset = 0;
  const maxOffset = 10;
  const thisYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(thisYear);
  const options = [];
  for (let i = minOffset; i <= maxOffset; i++) {
    const year = thisYear - i;
    options.push(<option value={year}>{year}</option>);
  }
  const onHandleChange = (evt) => {
    // Handle Change Here
    // alert(evt.target.value);
    setSelectedYear(evt.target.value);
  };
  const [initial, setInitial] = useState({
    startIndex: 0,
    endIndex: 2,
    timerId: 0,
    left: 0,
    right: 0,
    data: data02,
  });

  const hadleMouseWheel = (evt) => {
    if (evt.deltaY > 0) {
      var datalength = initial.data.length;
      console.log(datalength);
      setInitial(({ data, left = 0, right = 0 }) => {
        return {
          //  data: data.slice(),
          animation: true,
          left: 0,
          right: 0,
        };
      });
    } else if (evt.deltaY < 0) {
      setInitial(({ data, left = 0, right = 0 }) => {
        return {
          //  data: data.slice(),
          animation: true,
          left: left - 500,
          right: right - 500,
        };
      });
    }
  };

  const updateBrush = (pos) => {
    if (initial.timerId !== 0) {
      clearTimeout(initial.timerId);
    }
    initial.timerId = setTimeout(() => {
      setInitial({...initial, startIndex: pos.startIndex, endIndex: pos.endIndex });
    }, 500);
  };

  const { animation, left, right } = initial;
  console.log(initial.data);
  const values = initial.data.map((i) => i.doanhthu);

  const gradientOffset = () => {
    const dataMax = Math.max(...values);
    const dataMin = Math.min(...values);

    if (dataMax <= 0) {
      return 0;
    } else if (dataMin >= 0) {
      return 1;
    } else {
      return dataMax / (dataMax - dataMin);
    }
  };

  const off = gradientOffset();
  // hadleMouseWheel();
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <div className="year_picker">
        <text style={{ fontSize: "16px" }}>Năm: </text>
        <select
          style={{
            width: "60px",
            height: "25px",
            position: "relative",
            top: "-3px",
          }}
          value={selectedYear}
          onChange={onHandleChange}
        >
          {options}
        </select>
      </div>
      <div className="chart_container">
        <div className="barchart">
          <div className="column_1">
            <text className="text">THỐNG KÊ</text>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
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
            </ResponsiveContainer>
          </div>
          <div className="column_2">
            <text className="text">CHI TIẾT</text>
            <div className="detail_card">
              <text className="detail_text">Tổng tiền bán</text>
              <text className="num">150.702</text>
            </div>
            <div className="detail_card">
              <text className="detail_text">Tổng tiền nhập</text>
              <text className="num">80.6</text>
            </div>
            <div className="detail_card">
              <text className="detail_text">Tổng lợi nhuận</text>
              <text className="num">70.102</text>
            </div>
            <div className="donvi">
              <text className="text_donvi">Đơn vị: triệu Đồng</text>
            </div>
          </div>
        </div>
        <div className="piechart">
          <div className="title">
            <text className="title_text">DOANH THU THEO QUÝ</text>
          </div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            <PieChart width={200} height={200}>
              <Pie
                data={data01}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                marginTop: "17px",
              }}
            >
              {COLORS.map((color, i) => (
                <Stack key={color} alignItems="center" spacing={1}>
                  <Box sx={{ width: 20, height: 20, background: color }} />
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.7,
                      color: "rgb(73, 148, 94)",
                      fontWeight: "600",
                    }}
                  >
                    {data01[i]?.name}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Box>
          <div className="quarter_detail">
            <div className="title" style={{ marginTop: "10px" }}>
              <text className="title_text">CHI TIẾT</text>
            </div>
            <div className="list">
              {data01.map((item, i) => (
                <div>
                  <text className="items_text">
                    {item.name}: {item.value}
                  </text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="areachart">
        <div className="chart">
          <div className="title">
            <text className="title_text">DOANH THU HÀNG NĂM</text>
          </div>
          <ResponsiveContainer width="100%" height="88%">
            <AreaChart
              width={500}
              height={400}
              data={initial.data}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                padding={{ left: left, right: right }}
                tick={true}
                domain={["dataMin", "dataMax "]}
              />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke="#000" />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={1} />
                  <stop offset={off} stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>

              <Brush
                dataKey="name"
                height={30}
                stroke="#8884d8"
                onChange={(e) => {
                  updateBrush(e);
                }}
                startIndex={initial.startIndex}
                endIndex={initial.data.length - 1}
                padding={{ left: left, right: 10 }}
                tick={true}
              >
                <AreaChart data={initial.data}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={off} stopColor="green" stopOpacity={1} />
                      <stop offset={off} stopColor="red" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="doanhthu"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </Brush>
              <Area
                type="monotone"
                dataKey="doanhthu"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="donvi">
          <text className="text_donvi">Đơn vị: triệu Đồng</text>
        </div> */}
      </div>
    </div>
  );
};

export default Report;
