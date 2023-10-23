import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./SuperMarketReport.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  Brush,
  AreaChart,
  Area,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";

import { Box, Stack, Typography } from "@mui/material";

function SuperMarketReport() {
  const [years, setYears] = useState([]);
  const thisYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(thisYear);
  const [allSuperData, setAllSuperData] = useState([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState();

  useEffect(() => {
    const fetchYearData = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/product/getRevenueReportForEachYear`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((respond) => {
          setYears(respond);
        })
        .catch((err) => console.log(err));
    };
    let supermarketList = [];
    let firstSupermarket = [];
    const fetchAllSupermarketSaleReport = async () => {
      const tokenId = await auth.currentUser.getIdToken();

      fetch(
        `${API.baseURL}/api/product/getAllSupermarketSaleReport?year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
        }
      )
        .then((res) => res.json())
        .then((respond) => {
          setAllSuperData(respond);
          supermarketList = respond;
        })
        .catch((err) => console.log(err));
    };
    const fetchSupermarketSaleReport = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/product/getAllSupermarketSaleReport?year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
        }
      )
        .then((res) => res.json())
        .then((respond) => {
          let supermarket;
          if (selectedSupermarket) {
            supermarket = supermarketList.filter(
              (item) => item.name === selectedSupermarket
            );
          } else {
            supermarket = supermarketList.filter(
              (item) => item.name === respond[0].name
            );
          }
          const id = supermarket[0].id;
        //   console.log(id);
          fetch(
            `${API.baseURL}/api/product/getSaleReportSupermarket?supermarketId=${id}&year=${selectedYear}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenId}`,
              },
            }
          )
            .then((res) => res.json())
            .then((respond) => {
              console.log(respond);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };
    fetchYearData();
    fetchAllSupermarketSaleReport();
    fetchSupermarketSaleReport();
  }, [selectedYear, selectedSupermarket]);
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

  const data01 = [
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

  const options = [];
  years.map((i) => {
    options.push(<option value={i.yearValue}>{i.yearValue}</option>);
  });

  const onHandleChange = (evt) => {
    // Handle Change Here
    // alert(evt.target.value);
    setSelectedYear(evt.target.value);
  };

  const onHandleSuperChange = (evt) => {
    // Handle Change Here
    // alert(evt.target.value);
    setSelectedSupermarket(evt.target.value);
  };

  const data02 = [
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
  const data03 = [
    {
      subject: "Math",
      A: 120,
      B: 110,
      fullMark: 150,
    },
    {
      subject: "Chinese",
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "English",
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "Geography",
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      subject: "Physics",
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      subject: "History",
      A: 65,
      B: 85,
      fullMark: 150,
    },
  ];
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
          {/* <option value={0}>{0}</option> */}
        </select>
      </div>
      <div className="supermarketReport__container">
        <div className="barchart">
          <div className="title">
            <text className="title_text">DOANH THU TỪNG SIÊU THỊ</text>
          </div>
          <ResponsiveContainer width="90%" height="90%">
            <BarChart data={allSuperData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalIncome" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div className="donvi">
            <text className="text_donvi">Đơn vị: triệu Đồng</text>
          </div>
        </div>
        <div className="chart_container">
          <div className="row1">
            <div className="title">
              <text className="title_text">DOANH THU THEO SIÊU THỊ</text>
            </div>
            <div className="linechart">
              <ResponsiveContainer width="75%" height="98%">
                <AreaChart
                  data={data01}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Bán"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Brush height={26} />
                </AreaChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="25%" height="90%">
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
                      data={data02}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data02.map((entry, index) => (
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
                        <Box
                          sx={{ width: 20, height: 20, background: color }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            opacity: 0.7,
                            color: "rgb(73, 148, 94)",
                            fontWeight: "600",
                          }}
                        >
                          {data02[i]?.name}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Box>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="row2">
            <div className="supermarket_picker">
              <text style={{ fontSize: "16px" }}>Siêu thị: </text>
              <select
                style={{
                  width: "120px",
                  height: "25px",
                  position: "relative",
                  top: "-3px",
                }}
                value={selectedSupermarket}
                onChange={onHandleSuperChange}
              >
                {allSuperData.map((market) => (
                  <option value={market.name}>{market.name}</option>
                ))}
              </select>
            </div>
            <div className="radarchart">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data03}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Tooltip />

                  <Radar
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperMarketReport;
