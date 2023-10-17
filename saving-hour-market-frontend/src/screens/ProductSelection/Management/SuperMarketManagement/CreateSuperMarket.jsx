import React from "react";
import "./CreateSuperMarket.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CreateSuperMarket = ({ handleClose }) => {
  return (
    // modal header
    <div className="modal__container ">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm siêu thị</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div className="modal__container-body">
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên siêu thị
          </h4>
          <input
            placeholder="Nhập tên siêu thị"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
        </div>

        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Số điện thoại
          </h4>
          <input
            placeholder="Nhập số điện thoại"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Địa chỉ</h4>
          <input
            placeholder="Nhập địa chỉ"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
      </div>
      {/* ********************** */}

      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button className="modal__container-footer-buttons-close">
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

export default CreateSuperMarket;
