import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";
import "./TimeframeManagement.scss";
import { format } from "date-fns";
import dayjs from "dayjs";
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import { API } from "../../../../contanst/api";
import { auth, database } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { child, get, ref } from "firebase/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditTimeframe = ({
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setTimeframeList,
  searchValue,
  page,
  setTotalPage,
  timeframeItem,
}) => {
  const deliveryMethods = [
    { display: "Điểm giao hàng", value: "PICKUP_POINT" },
    { display: "Giao tận nhà", value: "DOOR_TO_DOOR" },
    { display: "Tất cả", value: "ALL" },
  ];
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods.find(
      (item, index) => index === timeframeItem.allowableDeliverMethod
    )
  );
  const [openDayOfWeekDropdown, setOpenDayOfWeekDropdown] = useState(false);
  const [fromHour, setFromHour] = useState(null);
  const [toHour, setToHour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    deliveryMethods: "",
    fromHour: "",
    toHour: "",
  });
  const [openValidateSnackbar, setOpenValidateSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
    text: "",
  });
  const { vertical, horizontal } = openValidateSnackbar;
  const handleCloseValidateSnackbar = () => {
    setOpenValidateSnackbar({ ...openValidateSnackbar, open: false });
  };

  const handleCreate = async () => {
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
    if (!selectedDeliveryMethod) {
      setError({ ...error, deliveryMethods: "Vui lòng không để trống" });
      return;
    }

    if (fromHour && toHour && fromHour >= toHour) {
      setOpenValidateSnackbar({
        ...openValidateSnackbar,
        open: true,
        text: "Giờ kết thúc không thể sớm hơn giờ bắt đầu",
      });
      return;
    }
    if (fromHour && !toHour && fromHour >= timeframeItem.toHour) {
      setOpenValidateSnackbar({
        ...openValidateSnackbar,
        open: true,
        text: "Giờ kết thúc không thể sớm hơn giờ bắt đầu",
      });
      return;
    }
    if (!fromHour && toHour && timeframeItem.fromHour >= toHour) {
      setOpenValidateSnackbar({
        ...openValidateSnackbar,
        open: true,
        text: "Giờ kết thúc không thể sớm hơn giờ bắt đầu",
      });
      return;
    }
    let submitCreate = {
      fromHour: fromHour ? fromHour : timeframeItem.fromHour,
      toHour: toHour ? toHour : timeframeItem.toHour,
      allowableDeliverMethod: selectedDeliveryMethod.value,
    };

    console.log(submitCreate);

    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/timeframe/update?timeFrameId=${timeframeItem.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify(submitCreate),
      }
    )
      .then((res) => res.json())
      .then((respond) => {
        console.log(respond);
        if (respond.code === 403) {
          setOpenValidateSnackbar({
            ...openValidateSnackbar,
            open: true,
            severity: "error",
            text: "Khung giờ có đơn hàng chờ xử lí !",
          });
          setLoading(false);
          return;
        }

        fetch(
          `${API.baseURL}/api/timeframe/getAllForAdmin?page=${
            page - 1
          }&limit=6&enableDisableStatus=ENABLE
          `,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((respond) => {
            if (respond?.code === 404 || respond.status === 500) {
              setLoading(false);
              return;
            }
            setTimeframeList(respond.pickupPointList);
            setTotalPage(respond.totalPage);
            handleClose();
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
              text: "Chỉnh sửa thành công !",
            });
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {});
  };
  return (
    <div style={{ width: 450 }} className={`modal__container `}>
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chỉnh sửa khung giờ</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      <div className={`modal__container-body `}>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Phương thức giao hàng
          </h4>
          <div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{ width: 169, marginRight: "-2px" }}
                className="dropdown"
              >
                <div
                  className="dropdown-btn"
                  onClick={(e) =>
                    setOpenDayOfWeekDropdown(!openDayOfWeekDropdown)
                  }
                >
                  {selectedDeliveryMethod
                    ? selectedDeliveryMethod.display
                    : "Phương thức giao hàng"}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {openDayOfWeekDropdown && (
                  <div style={{ width: 169 }} className="dropdown-content">
                    {deliveryMethods.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedDeliveryMethod(item);
                          setOpenDayOfWeekDropdown(false);
                          setError({ ...error, deliveryMethods: "" });
                        }}
                        className="dropdown-item"
                        key={index}
                      >
                        {item.display}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {error.deliveryMethods && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.deliveryMethods}
              </p>
            )}
          </div>
        </div>

        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Giờ bắt đầu
          </h4>
          <div className="timepicker-control">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                defaultValue={dayjs(
                  format(dayjs(new Date()).$d, "yyyy-MM-dd").concat(
                    timeframeItem.fromHour
                  )
                )}
                onChange={(e) => {
                  setFromHour(format(e.$d, "HH:mm:ss"));
                  setError({ ...error, fromHour: "" });
                }}
              />
            </LocalizationProvider>
            {error.fromHour && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.fromHour}
              </p>
            )}
          </div>
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Giờ kết thúc
          </h4>
          <div className="timepicker-control">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                defaultValue={dayjs(
                  format(dayjs(new Date()).$d, "yyyy-MM-dd").concat(
                    timeframeItem.toHour
                  )
                )}
                onChange={(e) => {
                  setToHour(format(e.$d, "HH:mm:ss"));
                  setError({ ...error, toHour: "" });
                }}
              />
            </LocalizationProvider>
            {error.toHour && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.toHour}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button
            onClick={handleClose}
            className="modal__container-footer-buttons-close"
          >
            Đóng
          </button>
          <button
            onClick={handleCreate}
            className="modal__container-footer-buttons-create"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
      {/* *********************** */}
      <Snackbar
        open={openValidateSnackbar.open}
        autoHideDuration={1500}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseValidateSnackbar}
      >
        <Alert
          onClose={handleCloseValidateSnackbar}
          severity={openValidateSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openValidateSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default EditTimeframe;
