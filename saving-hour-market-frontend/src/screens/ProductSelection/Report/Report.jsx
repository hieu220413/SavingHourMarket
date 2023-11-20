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
  ComposedChart,
} from "recharts";
import ManagementMenu from "../../../components/ManagementMenu/ManagementMenu";
import "./Report.scss";
import { Box, Stack, Typography } from "@mui/material";
import { API } from "../../../contanst/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

const Report = () => {
  const [initial, setInitial] = useState({
    startIndex: 0,
    endIndex: 2,
    timerId: 0,
    left: 0,
    right: 0,
    data: [],
  });
  const [monthData, setMonthData] = useState([]);
  const thisYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(thisYear);
  const [quaterData, setQuaterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const userState = useAuthState(auth);
  useEffect(() => {
    const fetchYearDta = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(`${API.baseURL}/api/product/getRevenueReportForEachYear`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then((res) => res.json())
          .then((respond) => {
            // console.log(respond);
            setInitial({ ...initial, data: respond });
            setLoading(false);
            // console.log(initial);
          })
          .catch((err) => console.log(err));
      }
    };
    const fetchMonthData = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${API.baseURL}/api/product/getRevenueReportForEachMonth?year=${selectedYear}`,
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
            setMonthData(respond);
            let Quater1 = 0;
            for (let i = 0; i < 3; i++) {
              Quater1 += respond[i]?.totalDifferentAmount;
            }
            let Quater2 = 0;
            for (let i = 3; i < 6; i++) {
              Quater2 += respond[i]?.totalDifferentAmount;
            }
            let Quater3 = 0;
            for (let i = 6; i < 9; i++) {
              Quater3 += respond[i]?.totalDifferentAmount;
            }
            let Quater4 = 0;
            for (let i = 9; i < 11; i++) {
              Quater4 += respond[i]?.totalDifferentAmount;
            }
            setQuaterData([
              { name: "Quý 1", value: Quater1 },
              { name: "Quý 2", value: Quater2 },
              { name: "Quý 3", value: Quater3 },
              { name: "Quý 4", value: Quater4 },
            ]);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };

    fetchMonthData();
    fetchYearDta();
  }, [selectedYear, userState[1]]);

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

  const options = [];
  initial.data.map((i) => {
    options.push(<option value={i.yearValue}>{i.yearValue}</option>);
  });

  const totalIncome = monthData.reduce(
    (total, currentValue) => (total = total + currentValue.totalIncome),
    0
  );
  const totalPriceOriginal = monthData.reduce(
    (total, currentValue) => (total = total + currentValue.totalPriceOriginal),
    0
  );
  const totalDifferentAmount = monthData.reduce(
    (total, currentValue) =>
      (total = total + currentValue.totalDifferentAmount),
    0
  );

  const onHandleChange = (evt) => {
    // Handle Change Here
    // alert(evt.target.value);
    setSelectedYear(evt.target.value);
  };

  const updateBrush = (pos) => {
    if (initial.timerId !== 0) {
      clearTimeout(initial.timerId);
    }
    initial.timerId = setTimeout(() => {
      setInitial({
        ...initial,
        startIndex: pos.startIndex,
        endIndex: pos.endIndex,
      });
    }, 500);
  };

  const { animation, left, right } = initial;

  const values = initial.data.map((i) => i.totalDifferentAmount);
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
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`doanh thu : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

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
                data={monthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalIncome" name="Tổng tiền thu trên những sản phẩm đã bán" fill="#8884d8" />
                <Bar dataKey="totalPriceOriginal" name="Tổng tiền nhập trên những sản phẩm đã bán" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="column_2">
            <text className="text">CHI TIẾT</text>
            <div className="detail_card">
              <text className="detail_text">Tổng tiền thu trên những sản phẩm đã bán</text>
              <text className="num">{totalIncome}</text>
            </div>
            <div className="detail_card">
              <text className="detail_text">Tổng tiền nhập trên những sản phẩm đã bán</text>
              <text className="num">{totalPriceOriginal}</text>
            </div>
            <div className="detail_card">
              <text className="detail_text">Chênh lệch tổng thu và tổng nhập</text>
              <text className="num">{totalDifferentAmount}</text>
            </div>
            <div className="donvi">
              <text className="text_donvi">Đơn vị: VND</text>
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
                data={quaterData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {quaterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
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
                    {quaterData[i]?.name}
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
              {quaterData.map((item, i) => (
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
            <ComposedChart
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
                dataKey="yearValue"
                padding={{ left: left, right: right }}
                tick={true}
                domain={["dataMin", "dataMax "]}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="totalDifferentAmount" barSize={20} fill="#ff7300" />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={1} />
                  <stop offset={off} stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>

              <Brush
                dataKey="yearValue"
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
                    dataKey="totalDifferentAmount"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </Brush>
              <Area
                type="monotone"
                dataKey="totalDifferentAmount"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="donvi">
          <text className="text_donvi">Đơn vị: triệu Đồng</text>
        </div> */}
      </div>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default Report;
