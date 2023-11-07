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

const CreateTimeframe = ({ handleClose }) => {
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(null);
  const [openDayOfWeekDropdown, setOpenDayOfWeekDropdown] = useState(false);
  const [fromHour, setFromHour] = useState(null);
  const [toHour, setToHour] = useState(new Date("10:15"));
  const daysOfWeek = [
    { display: "Thứ hai", value: 1 },
    { display: "Thứ ba", value: 1 },
    { display: "Thứ tư", value: 1 },
    { display: "Thứ năm", value: 1 },
    { display: "Thứ sáu", value: 1 },
    { display: "Thứ bảy", value: 1 },
    { display: "Chủ nhật", value: 1 },
    { display: "Mỗi ngày", value: 1 },
    { display: "Cuối tuần", value: 1 },
  ];
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
            Ngày trong tuần
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
                  {selectedDayOfWeek
                    ? selectedDayOfWeek.display
                    : "Chọn ngày trong tuần"}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {openDayOfWeekDropdown && (
                  <div
                    style={{ height: "180px", overflowY: "scroll" }}
                    className="dropdown-content"
                  >
                    {daysOfWeek.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedDayOfWeek(item);
                          setOpenDayOfWeekDropdown(false);
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
            {/* {error.supermarket && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.supermarket}
                </p>
              )} */}
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
                }}
              />
            </LocalizationProvider>
            {/* {error.name && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.name}
              </p>
            )} */}
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
                }}
              />
            </LocalizationProvider>
            {/* {error.name && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.name}
              </p>
            )} */}
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
          <button className="modal__container-footer-buttons-create">
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
    </div>
  );
};

export default CreateTimeframe;
