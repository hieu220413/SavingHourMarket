import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../../../firebase/firebase.config";
import { API } from "../../../contanst/api";
import "./Configuration.scss";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { child, get, ref, set } from "firebase/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Configuration = () => {
  const [loading, setLoading] = useState(false);
  const [initialShippingFee, setInitialShippingFee] = useState(0);
  const [
    minKmDistanceForExtraShippingFee,
    setMinKmDistanceForExtraShippingFee,
  ] = useState(0);
  const [extraShippingFeePerKilometer, setExtraShippingFeePerKilometer] =
    useState(0);
  const [limitOfOrders, setLimitOfOrders] = useState(0);
  const [timeAllowedForOrderCancellation, setTimeAllowedForOrderCancellation] =
    useState(0);
  const [deleteUnpaidOrderTime, setDeleteUnpaidOrderTime] = useState(0);
  const [limitMeterPerMiniute, setLimitMeterPerMiniute] = useState(0);
  const [allowableOrderDateThreshold, setAllowableOrderDateThreshold] =
    useState(0);
  const [systemStatus, setSystemStatus] = useState({
    display: "Hoạt động",
    value: 1,
  });
  const [openSystemStatus, setOpenSystemStatus] = useState(false);

  const selectSystemStatus = [
    { display: "Hoạt động", value: 1 },
    { display: "Bảo trì", value: 0 },
  ];

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
    text: "",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const userState = useAuthState(auth);
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();

        fetch(`${API.baseURL}/api/configuration/getConfiguration`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then((res) => res.json())
          .then((respond) => {
            console.log(respond);
            if (respond?.code === 404 || respond.status === 500) {
              setLoading(false);
              return;
            }
            setInitialShippingFee(respond.initialShippingFee);
            setMinKmDistanceForExtraShippingFee(
              respond.minKmDistanceForExtraShippingFee
            );
            setExtraShippingFeePerKilometer(
              respond.extraShippingFeePerKilometer
            );
            setLimitOfOrders(respond.limitOfOrders);

            setTimeAllowedForOrderCancellation(
              respond.timeAllowedForOrderCancellation
            );
            setDeleteUnpaidOrderTime(respond.deleteUnpaidOrderTime);
            setLimitMeterPerMiniute(respond.limitMeterPerMinute);
            const currentStatus = selectSystemStatus.find(
              (item) => item.value === respond.systemStatus
            );
            setSystemStatus(currentStatus);
            setAllowableOrderDateThreshold(respond.allowableOrderDateThreshold);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchStaff();
  }, [userState[1]]);

  const handleKeypress = (e) => {
    const characterCode = e.key;
    if (characterCode === "Backspace") return;

    const characterNumber = Number(characterCode);
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return;
      }
    } else {
      e.preventDefault();
    }
  };

  const handleSave = async () => {
    let isSystemDisable = true;
    await get(child(ref(database), "systemStatus")).then((snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        if (data === 1) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
            text: "Hệ thống không trong trạng thái bảo trì !",
          });
          isSystemDisable = false;
        }
      }
    });
    if (!isSystemDisable) {
      setLoading(false);
      return;
    }
    if (!initialShippingFee) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Vui lòng không để trống phí giao hàng khởi điểm",
      });
      return;
    }
    if (initialShippingFee < 1000) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Phí giao hàng khởi điểm không thể bé hơn 1000đ",
      });
      return;
    }
    if (minKmDistanceForExtraShippingFee == 0) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Khoảng cách tối thiểu tính thêm phí giao hàng không được bỏ trống hoặc bằng 0",
      });
      return;
    }
    if (!extraShippingFeePerKilometer) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Vui lòng không để trống phí cộng thêm mỗi km",
      });
      return;
    }
    if (extraShippingFeePerKilometer < 1000) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Phí cộng thêm mỗi km không thể bé hơn 1000đ",
      });
      return;
    }
    if (limitOfOrders == 0) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Số đơn hàng chờ xác nhận tối đa không được bỏ trống hoặc bằng 0",
      });
      return;
    }

    if (timeAllowedForOrderCancellation == 0) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Thời gian để hủy đơn hàng không được bỏ trống hoặc bằng 0",
      });
      return;
    }
    if (deleteUnpaidOrderTime == 0) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Thời gian tự động xóa đơn hàng lỗi thanh toán không được bỏ trống hoặc bằng 0",
      });
      return;
    }
    if (limitMeterPerMiniute == 0) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Giới hạn khoảng cách mỗi phút không được bỏ trống hoặc bằng 0",
      });
      return;
    }
    if (allowableOrderDateThreshold == 0) {
      setOpenSnackbar({
        ...openSnackbar,
        severity: "error",
        open: true,
        text: "Số ngày giao tối thiểu sau ngày đặt hàng không được bỏ trống hoặc bằng 0",
      });
      return;
    }
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/configuration/updateConfiguration`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify({
        limitOfOrders: parseInt(limitOfOrders),
        deleteUnpaidOrderTime: parseInt(deleteUnpaidOrderTime),
        initialShippingFee: parseInt(initialShippingFee),
        minKmDistanceForExtraShippingFee: parseInt(
          minKmDistanceForExtraShippingFee
        ),
        extraShippingFeePerKilometer: parseInt(extraShippingFeePerKilometer),
        timeAllowedForOrderCancellation: parseInt(
          timeAllowedForOrderCancellation
        ),
        limitMeterPerMinute: parseInt(limitMeterPerMiniute),
        allowableOrderDateThreshold: parseInt(allowableOrderDateThreshold),
      }),
    })
      .then((res) => res.json())
      .then((respond) => {
        console.log(respond);
        if (respond?.code === 422) {
          setLoading(false);
          return;
        }
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
          text: "Lưu thay đổi thành công",
        });
        setLoading(false);
      })
      .catch((err) => {});
  };

  const handleSaveSystemStatus = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/configuration/updateSystemState?systemState=${
        selectSystemStatus === 1 ? "ACTIVE" : "MAINTAINING"
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      }
    )
      .then((res) => res.json())
      .then((respond) => {
        console.log(respond);
        if (respond?.code === 422) {
          setLoading(false);
          return;
        }

        set(ref(database, "systemStatus"), systemStatus.value);
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
          text: "Lưu thay đổi thành công",
        });
        setLoading(false);
      })
      .catch((err) => {});
  };

  return (
    <div className="configuration__container">
      <div className="configuration__content">
        <div className="configuration__content-header">Cấu hình hệ thống</div>
        <div className="configuration__content-line">
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Phí giao hàng khởi điểm (VNĐ)
            </div>
            <input
              value={initialShippingFee}
              onChange={(e) => {
                setInitialShippingFee(e.target.value);
              }}
              min={0}
              step={1}
              onKeyDown={(e) => handleKeypress(e)}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Khoảng cách tối thiểu tính thêm phí giao hàng (km)
            </div>
            <input
              onChange={(e) => {
                setMinKmDistanceForExtraShippingFee(e.target.value);
              }}
              value={minKmDistanceForExtraShippingFee}
              onKeyDown={(e) => handleKeypress(e)}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Phí cộng thêm mỗi km (VNĐ)
            </div>
            <input
              onChange={(e) => {
                setExtraShippingFeePerKilometer(e.target.value);
              }}
              value={extraShippingFeePerKilometer}
              onKeyDown={(e) => handleKeypress(e)}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
        </div>
        <div className="configuration__content-line">
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Số đơn hàng chờ xác nhận tối đa
            </div>
            <input
              onChange={(e) => {
                setLimitOfOrders(e.target.value);
              }}
              onKeyDown={(e) => handleKeypress(e)}
              value={limitOfOrders}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>

          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Thời gian để hủy đơn hàng (giờ)
            </div>
            <input
              onChange={(e) => {
                setTimeAllowedForOrderCancellation(e.target.value);
              }}
              onKeyDown={(e) => handleKeypress(e)}
              value={timeAllowedForOrderCancellation}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Thời gian tự động xóa đơn hàng lỗi thanh toán (giờ)
            </div>
            <input
              onKeyDown={(e) => handleKeypress(e)}
              onChange={(e) => {
                setDeleteUnpaidOrderTime(e.target.value);
              }}
              value={deleteUnpaidOrderTime}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
        </div>

        <div className="configuration__content-line">
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Giới hạn khoảng cách mỗi phút ( m )
            </div>
            <input
              onKeyDown={(e) => handleKeypress(e)}
              onChange={(e) => {
                setLimitMeterPerMiniute(e.target.value);
              }}
              value={limitMeterPerMiniute}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
          <div className="configuration__content-line-item">
            <div className="configuration__content-line-item-title">
              Số ngày giao tối thiểu sau ngày đặt hàng ( ngày )
            </div>
            <input
              onKeyDown={(e) => handleKeypress(e)}
              onChange={(e) => {
                setAllowableOrderDateThreshold(e.target.value);
              }}
              value={allowableOrderDateThreshold}
              type="number"
              className="configuration__content-line-item-input"
            />
          </div>
          <div className="configuration__content-line-item"></div>
        </div>
        <button onClick={handleSave} className="configuration__content-button ">
          Lưu
        </button>

        <div className="configuration__systemstatus">
          <div className="configuration__content-header">
            Trạng thái hệ thống
          </div>
          <div className="configuration__content-line-item">
            {/* <h3 className="configuration__content-line-item-title">
              Trạng thái hệ thống :
            </h3> */}
            <div
              style={{ marginTop: "-10px" }}
              onClick={() => {
                setOpenSystemStatus(!openSystemStatus);
              }}
              className="feedback__select-button"
            >
              <h3 className="feedback__select-button-label">
                {systemStatus.display}
              </h3>
              <FontAwesomeIcon icon={faCaretDown} />
              {openSystemStatus && (
                <div className="feedback__select-dropdown">
                  {selectSystemStatus.map((item, i) => (
                    <p
                      onClick={() => {
                        setSystemStatus(item);
                        setOpenSystemStatus(!openSystemStatus);
                      }}
                      key={i}
                    >
                      {item.display}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSaveSystemStatus}
              className="configuration__content-button"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default Configuration;
