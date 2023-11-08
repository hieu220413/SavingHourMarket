import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const ProductBatchUploadByExcel = ({ handleClose, productBatch }) => {
  const ProductBatchRow = ({ item, index }) => {
    return (
      <>
        <tr key={index} className="table-body-row">
          <td>{index + 1}</td>

          <td>
            {item.expiredDate ? (
              dayjs(item.expiredDate).format("DD/MM/YYYY")
            ) : (
              <p style={{ fontWeight: 700 }} className="text-danger">
                Lỗi ngày
              </p>
            )}
          </td>
          <td>{item?.quantity}</td>
          <td>
            {item?.supermarketAddress ? (
              item?.supermarketAddress?.address
            ) : (
              <p style={{ fontWeight: 700 }} className="text-danger">
                Lỗi địa chỉ
              </p>
            )}
          </td>
          <td>
            {item?.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td>
            {item?.priceOriginal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
        </tr>
      </>
    );
  };
  return (
    <div className="modal__container " style={{ width: "100%" }}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chi tiết lô hàng</h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>

      <div
        style={{ height: "65vh", overflowY: "scroll" }}
        className="modal__container-body"
      >
        <div className="table__container">
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Ngày hết hạn</th>
                <th>Số lượng</th>
                <th>Kho</th>
                <th>Giá</th>
                <th>Giá gốc</th>
              </tr>
            </thead>
            <tbody>
              {productBatch.map((item, index) => (
                <ProductBatchRow item={item} key={index} index={index} />
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

export default ProductBatchUploadByExcel;
