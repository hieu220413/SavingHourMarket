import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const ProductBatchUploadByExcel = ({ handleClose, productBatch }) => {
  const ProductBatchRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td>{index + 1}</td>

          <td>{dayjs(item.expiredDate).format("DD/MM/YYYY")}</td>
          <td>{item.quantity}</td>
          <td>
            {item.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td>
            {item.priceOriginal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td>
            <i class="bi bi-pencil-square"></i>
            <i class="bi bi-trash-fill"></i>
          </td>
        </tr>
      </>
    );
  };
  return (
    <div className="modal__container" style={{ width: "100%" }}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chi tiết lô hàng</h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>

      <div className="modal__container-body">
        <div className="table__container">
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Ngày hết hạn</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Giá gốc</th>
                <th>Thao tác</th>
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
    </div>
  );
};

export default ProductBatchUploadByExcel;
