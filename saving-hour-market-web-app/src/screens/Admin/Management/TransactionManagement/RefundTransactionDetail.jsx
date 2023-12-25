import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

const RefundTransactionDetail = ({ handleClose, transaction }) => {
  return (
    <div className="modal__container " style={{ width: "max-content" }}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Chi tiết giao dịch hoàn trả
        </h3>
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
                <th>Thời điểm thanh toán</th>
                <th>Phương thức</th>
                <th>Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-body-row">
                <td>1</td>
                <td>
                  {format(
                    new Date(transaction?.paymentTime.slice(0, 10)),
                    "dd-MM-yyyy"
                  )}{" "}
                  {transaction?.paymentTime.slice(11, 16)}h
                </td>
                <td>VNPAy</td>
                <td>
                  {transaction?.amountOfMoney.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
              </tr>
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

export default RefundTransactionDetail;
