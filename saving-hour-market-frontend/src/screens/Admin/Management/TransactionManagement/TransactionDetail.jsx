import React from "react";
import "./TransactionDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

const TransactionDetail = ({ handleClose, item, refund }) => {
  return (
    <div
      style={{ width: "max-content" }}
      className={`modal__container modal-scroll`}
    >
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chi tiết giao dịch</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      <div className={`modal__container-body `}>
        <div className="transaction__information">
          <h2 className="transaction__information-title">
            Thông tin giao dịch
          </h2>
          <div className="transaction__information-body">
            <div className="transaction__information-body-item">
              <h3 className="transaction__information-body-item-title">
                Thời điểm giao dịch
              </h3>
              <h3 className="transaction__information-body-item-desc">
                {format(new Date(item?.paymentTime.slice(0, 10)), "dd-MM-yyyy")}{" "}
                {item?.paymentTime.slice(11, 16)}H
              </h3>
            </div>
            <div className="transaction__information-body-item">
              <h3 className="transaction__information-body-item-title">
                Phương thức thanh toán
              </h3>
              <h3 className="transaction__information-body-item-desc">
                VN Pay
              </h3>
            </div>
            <div className="transaction__information-body-item">
              <h3 className="transaction__information-body-item-title">
                Trạng thái thanh toán
              </h3>
              <h3 className="transaction__information-body-item-desc">
                {refund ? "Đã hủy" : "Thành công"}
              </h3>
            </div>
          </div>
        </div>
        <div className="order__information">
          <h2 className="order__information-title">Thông tin đơn hàng</h2>
          <div className="order__information-body">
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Tên khách hàng :
              </h3>
              <h3 className="order__information-body-item-desc">
                {item.order.receiverName}
              </h3>
            </div>
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Số điện thoại :
              </h3>
              <h3 className="order__information-body-item-desc">
                {item.order.receiverPhone}
              </h3>
            </div>
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Địa chỉ giao hàng :
              </h3>
              <h3 className="order__information-body-item-desc">
                {item.order.addressDeliver}
              </h3>
            </div>
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Tổng tiền :
              </h3>
              <h3 className="order__information-body-item-desc">
                {item?.amountOfMoney.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h3>
            </div>
          </div>
        </div>
        <div style={{ height: "fit-content" }} className="table__container">
          {/* data table */}
          <table class="table ">
            <>
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Hình ảnh</th>
                  <th>Tên</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {item.order.orderDetailList.map((product, index) => (
                  <tr className="table-body-row">
                    <td style={{ paddingTop: "30px" }}>1</td>
                    <td>
                      <img
                        width="80px"
                        height="60px"
                        src={product.product.productImageList[0].imageUrl}
                      />
                    </td>

                    <td style={{ paddingTop: "30px" }}>
                      {product.product.name}
                    </td>
                    <td style={{ paddingTop: "30px" }}>
                      x{product.boughtQuantity}
                    </td>
                    <td style={{ paddingTop: "30px" }}>
                      {product.productPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
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
      {/* *********************** */}
    </div>
  );
};

export default TransactionDetail;
