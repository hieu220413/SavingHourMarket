import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ErrorProductUploadByExcel = ({ handleClose, errorList, imageUrls }) => {
  return (
    <div className="modal__container">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chi tiết lỗi sản phẩm</h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>
      <div style={{}} className="modal__container-body">
        {(imageUrls?.length === 0 || imageUrls === null) && (
          <div className="error__container">
            <i class="bi bi-exclamation-circle-fill text-danger"></i>
            <h3 className="text-danger">Sản phẩm chưa có hình ảnh</h3>
          </div>
        )}

        {errorList.map((item, index) => (
          <div key={index} className="error__container">
            <i class="bi bi-exclamation-circle-fill text-danger"></i>
            <h3 className="text-danger">{item}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorProductUploadByExcel;
