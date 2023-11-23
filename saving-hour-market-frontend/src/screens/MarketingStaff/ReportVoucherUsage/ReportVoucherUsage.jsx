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
import "../../ProductSelection/Report/Report.scss";
import { Box, Stack, Typography } from "@mui/material";
import { API } from "../../../contanst/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
const ReportVoucherUsage = () => {
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
  const [categoriesVoucherUsage, setCategoriesVoucherUsage] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = [
    {
      name: "--",
      value: "",
    },
    {
      name: "Tháng 1",
      value: "JAN",
    },
    {
      name: "Tháng 2",
      value: "FEB",
    },
    {
      name: "Tháng 3",
      value: "MAR",
    },
    {
      name: "Tháng 4",
      value: "APR",
    },
    {
      name: "Tháng 5",
      value: "MAY",
    },
    {
      name: "Tháng 6",
      value: "JUNE",
    },
    {
      name: "Tháng 7",
      value: "JULY",
    },
    {
      name: "Tháng 8",
      value: "AUG",
    },
    {
      name: "Tháng 9",
      value: "SEPT",
    },
    {
      name: "Tháng 10",
      value: "OCT",
    },
    {
      name: "Tháng 11",
      value: "NOV",
    },
    {
      name: "Tháng 12",
      value: "DEC",
    },
  ];
  const quarters = [
    {
      name: "--",
      value: "",
    },
    {
      name: "Quý 1",
      value: "Q1",
    },
    {
      name: "Quý 2",
      value: "Q2",
    },
    {
      name: "Quý 3",
      value: "Q3",
    },
    {
      name: "Quý 4",
      value: "Q4",
    },
  ];

  const [selectMonth, setSelectMonth] = useState("--");
  const [selectQuarter, setSelectQuarter] = useState("--");

  const userState = useAuthState(auth);

  useEffect(() => {
    const fetchMonths = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${API.baseURL}/api/discount/getDiscountUsageReportForEachMonth?year=${selectedYear}&fromPercentage=0&toPercentage=100`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((respond) => {
            setMonthData(respond);
            let Quater1 = 0;
            for (let i = 0; i < 3; i++) {
              Quater1 += respond[i]?.totalDiscountUsage;
            }
            let Quater2 = 0;
            for (let i = 3; i < 6; i++) {
              Quater2 += respond[i]?.totalDiscountUsage;
            }
            let Quater3 = 0;
            for (let i = 6; i < 9; i++) {
              Quater3 += respond[i]?.totalDiscountUsage;
            }
            let Quater4 = 0;
            for (let i = 9; i < 11; i++) {
              Quater4 += respond[i]?.totalDiscountUsage;
            }
            setQuaterData([
              { name: "Quý 1", value: Quater1 },
              { name: "Quý 2", value: Quater2 },
              { name: "Quý 3", value: Quater3 },
              { name: "Quý 4", value: Quater4 },
            ]);
            setLoading(false);
          });
      }
    };
    const fetchAllCategoriesDiscountUsageReport = async () => {
      setLoading(true);
      const month = months.find((item) => item.name === selectMonth);
      const quarter = quarters.find((item) => item.name === selectQuarter);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${API.baseURL}/api/discount/getAllCategoryDiscountUsageReport?${
            month.value === "" ? "" : `&month=${month.value}`
          }${
            quarter.value === "" ? "" : `&quarter=${quarter.value}`
          }&year=${selectedYear}&fromPercentage=0&toPercentage=100`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((respond) => {
            setCategoriesVoucherUsage(respond);
          });
      }
    };
    fetchMonths();
    fetchAllCategoriesDiscountUsageReport();
  }, [selectMonth, selectQuarter]);

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
  const totalVoucherUsage = monthData.reduce(
    (total, currentValue) => (total = total + currentValue.totalDiscountUsage),
    0
  );

  const optionsMonth = [];
  months.map((month) => {
    optionsMonth.push(<option value={month.name}>{month.name} </option>);
  });
  const optionsQuarter = [];
  quarters.map((quarter) => {
    optionsQuarter.push(<option value={quarter.name}>{quarter.name}</option>);
  });

  const onHandleChange = (evt) => {
    // Handle Change Here
    // alert(evt.target.value);
    setSelectedYear(evt.target.value);
  };

  return (
    <div>
      <div>
        <div className="year_picker">
          <text style={{ fontSize: "16px" }}>Năm: {selectedYear} </text>
          {/* <select
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
        </select> */}
        </div>

        <div className="chart_container">
          <div className="barchart">
            <div className="column_1">
              <text className="text">THỐNG KÊ THEO TỪNG THÁNG</text>
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
                  <Bar
                    dataKey="totalDiscountUsage"
                    name="Tổng số lượng mã sản phẩm đã được dùng theo từng tháng"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="column_2">
              <text className="text">CHI TIẾT</text>
              <div className="detail_card">
                <text className="detail_text">
                  Tổng số mã giảm giá đã được sử dụng
                </text>
                <text className="num">{totalVoucherUsage}</text>
              </div>
              <div className="donvi">
                <text className="text_donvi">Đơn vị: Mã</text>
              </div>
            </div>
          </div>
          <div className="piechart">
            <div className="title">
              <text
                className="title_text"
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  textAlign: "center",
                }}
              >
                SỐ MÃ GIẢM GIÁ ĐƯỢC SỬ DỤNG THEO QUÝ
              </text>
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
              <PieChart width={180} height={180}>
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
                      {item.name}: {item.value} mã
                    </text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "350px",
          }}
        >
          <div
            style={{
              marginTop: 30,
              width: "100%",
            }}
          >
            <text style={{ fontSize: "16px" }}>Tháng: </text>
            <select
              style={{
                width: "60px",
                height: "25px",
                position: "relative",
              }}
              value={selectMonth}
              onChange={(e) => {
                setSelectMonth(e.target.value);
              }}
            >
              {optionsMonth}
            </select>
          </div>

          <div
            style={{
              marginTop: 30,
              width: "100%",
            }}
          >
            <text style={{ fontSize: "16px" }}>Quý: </text>
            <select
              style={{
                width: "60px",
                height: "25px",
                position: "relative",
              }}
              value={selectQuarter}
              onChange={(e) => {
                setSelectQuarter(e.target.value);
              }}
            >
              {optionsQuarter}
            </select>
          </div>
        </div>
        <div className="areachart" style={{ height: "350px" }}>
          <div className="chart">
            <div className="title">
              <text className="title_text">
                SỐ MÃ GIẢM GIÁ ĐƯỢC DÙNG TRÊN TỪNG LOẠI SẢN PHẨM
              </text>
            </div>
            <ResponsiveContainer width="90%" height="90%">
              <BarChart data={categoriesVoucherUsage} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productCategory.name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalDiscountUsage"
                  name="Tổng số lượng mã sản phẩm đã được dùng theo từng tháng"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="donvi">
              <text className="text_donvi">Đơn vị: mã</text>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default ReportVoucherUsage;
