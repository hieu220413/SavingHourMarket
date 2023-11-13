import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const ViewProductBatchAddressList = ({
  handleClose,
  productBatchAddressList,
}) => {
  const ProductBatchAddressRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>

          <td style={{ paddingTop: 30 }}>
            {item?.supermarketAddress?.address}
          </td>
          <td style={{ paddingTop: 30, paddingLeft: 20 }}>{item?.quantity}</td>
        </tr>
      </>
    );
  };

  return (
    <div className="modal__container" style={{ width: "100%" }}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Chi tiết kho hàng và số lượng
        </h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>
      <div className="modal__container-body">
        <div className="table__container">
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Kho</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {productBatchAddressList.map((item, index) => (
                <ProductBatchAddressRow item={item} key={index} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
