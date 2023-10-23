import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const ViewSubCategory = ({ handleClose, subCategoryToView }) => {
  console.log(subCategoryToView);

  const SubCateRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td
            style={{ paddingTop: 30, textAlign: "center", fontWeight: "bold" }}
          >
            {item.allowableDisplayThreshold}
          </td>
        </tr>
      </>
    );
  };
  return (
    <div className="modal__container">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Chi tiết các loại sản phẩm phụ
        </h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>

      <div className="modal__container-body">
        <div
          className="table__container"
          style={{ width: "100%", height: "100%" }}
        >
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Hình ảnh</th>
                <th>Tên loại sản phẩm phụ</th>
                <th>Ngày trước hạn HSD cho phép</th>
              </tr>
            </thead>
            <tbody>
              {subCategoryToView.map((item, index) => (
                <SubCateRow item={item} index={index} key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewSubCategory;
