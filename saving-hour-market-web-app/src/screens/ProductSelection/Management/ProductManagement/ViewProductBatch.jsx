import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { Dialog } from "@mui/material";
import { ViewProductBatchAddressList } from "./ViewProductBatchAddressList";

const ViewProductBatch = ({ handleClose, productBatch, productName }) => {
  const [productBatchAddressList, setProductBatchAddressList] = useState([]);
  const [openAddressList, setOpenAddressList] = useState(false);
  const handleOpenAddressList = () => setOpenAddressList(true);
  const handleCloseAddressList = () => setOpenAddressList(false);

  const ProductBatchRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td style={{ paddingTop: 30 }}>
            {dayjs(item.expiredDate).format("DD/MM/YYYY")}
          </td>
          <td style={{ paddingTop: 30 }}>
            {item.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td style={{ paddingTop: 30 }}>
            {item.priceOriginal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>
            <i
              onClick={() => {
                setProductBatchAddressList(item.productBatchAddressList);
                handleOpenAddressList();
              }}
              class="bi bi-receipt"
            ></i>
          </td>
        </tr>
      </>
    );
  };

  return (
    <>
      <div className="modal__container" style={{ width: "100%" }}>
        <div className="modal__container-header">
          <h3 className="modal__container-header-title">
            Chi tiết lô hàng của {productName}{" "}
          </h3>
          <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
        </div>

        <div className="modal__container-body">
          <div className="table__container">
            <table class="table ">
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Ngày hết hạn</th>
                  <th>Giá</th>
                  <th>Giá gốc</th>
                  <th>Kho & Số lượng</th>
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
      <Dialog
        onClose={handleCloseAddressList}
        aria-labelledby="customized-dialog-title"
        open={openAddressList}
      >
        <ViewProductBatchAddressList
          handleClose={handleCloseAddressList}
          productBatchAddressList={productBatchAddressList}
        />
      </Dialog>
    </>
  );
};

export default ViewProductBatch;
