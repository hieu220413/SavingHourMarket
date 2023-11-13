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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateTimeframe = ({ handleClose }) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
  const [openDayOfWeekDropdown, setOpenDayOfWeekDropdown] = useState(false);
  const [fromHour, setFromHour] = useState(null);
  const [toHour, setToHour] = useState(null);
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
  const deliveryMethods = [
    { display: "Điểm giao hàng", value: "PICKUP_POINT" },
    { display: "Giao tận nhà", value: "DOOR__TO_DOOR" },
    { display: "Tất cả", value: "ALL" },
  ];

  const handleCreate = async () => {
    if (!selectedDeliveryMethod) {
      setError({ ...error, deliveryMethods: "Vui lòng không để trống" });
      return;
    }
    if (!fromHour) {
      setError({ ...error, fromHour: "Vui lòng không để trống" });
      return;
    }
    if (!toHour) {
      setError({ ...error, toHour: "Vui lòng không để trống" });
      return;
    }
    const fromHourCompare = format(dayjs(new Date()).$d, "yyyy-MM-dd").concat(
      fromHour
    );
    const toHourCompare = format(dayjs(new Date()).$d, "yyyy-MM-dd").concat(
      toHour
    );
    console.log(fromHour < toHour);
  };
  return (
    <div style={{ width: 450 }} className={`modal__container `}>
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm khung giờ</h3>
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
                // defaultValue={dayjs(
                //   format(dayjs(new Date()).$d, "yyyy-MM-dd").concat("10:15:00")
                // )}
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
            Tạo mới
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
    </div>
  );
};

export default CreateTimeframe;
