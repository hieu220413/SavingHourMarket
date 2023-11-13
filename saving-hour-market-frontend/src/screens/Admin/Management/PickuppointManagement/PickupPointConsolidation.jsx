import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const PickupPointConsolidation = ({ handleClose, consolidationList }) => {
  const ConsolidationItem = ({ item, index }) => {
    return (
      <tr key={index} className="table-body-row">
        <td>{index + 1}</td>

        <td>{item?.address}</td>
      </tr>
    );
  };
  return (
    <div className="modal__container " style={{ width: "max-content" }}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chi tiết điểm tập kết</h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>
      <div
        style={{ height: "40vh", overflowY: "scroll" }}
        className="modal__container-body"
      >
        <div style={{ width: 600 }} className="table__container">
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              {consolidationList.map((item, index) => (
                <ConsolidationItem item={item} key={index} index={index} />
              ))}
            </tbody>
          </table>
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
        </div>
      </div>
    </div>
  );
};

export default PickupPointConsolidation;
