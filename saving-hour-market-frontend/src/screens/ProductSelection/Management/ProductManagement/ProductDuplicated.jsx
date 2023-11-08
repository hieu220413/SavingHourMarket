import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import NullImage from "../../../../assets/Null-Image.png";

const ProductDuplicated = ({ handleClose, item, confirmProductList }) => {
  const [openProductBatch, setOpenProductBatch] = useState(false);
  const handleOpenProductBatch = () => setOpenProductBatch(true);
  const handleCloseProductBatch = () => setOpenProductBatch(false);

  console.log(item);

  const [openErrorList, setOpenErrorList] = useState(false);
  const handleOpenErrorList = () => setOpenErrorList(true);
  const handleCloseErrorList = () => setOpenErrorList(false);
  const [errorList, setErrorList] = useState(
    Object.entries(confirmProductList.errorFields).map(([key, value]) => {
      return { index: key, value: value };
    })
  );

  return (
    <div style={{ width: "fit-content" }} className="modal__container">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Sản phẩm đã tồn tại</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      <div className="modal__container-body">
        <div style={{ height: "fit-content" }} className="table__container">
          {/* data table */}
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Hình ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Đơn vị</th>
                <th>Loại sản phẩm phụ</th>
                <th>Siêu thị</th>
                <th>Lô hàng</th>

                <th>Lỗi</th>
              </tr>
            </thead>
            <tbody>
              <tr key={item?.index} className="table-body-row">
                <td style={{ paddingTop: 30 }}>{item?.index + 1}</td>
                <td>
                  {item?.productImageList ? (
                    <img
                      alt="hình"
                      width="80px"
                      height="60px"
                      src={item?.productImageList[0]?.image}
                    />
                  ) : (
                    <img
                      alt="hình"
                      width="80px"
                      height="60px"
                      src={NullImage}
                    />
                  )}
                </td>
                <td style={{ paddingTop: 30 }}>
                  {" "}
                  {item?.name ? (
                    item?.name
                  ) : (
                    <p style={{ fontWeight: 700 }} className="text-danger">
                      Lỗi tên
                    </p>
                  )}
                </td>
                <td style={{ paddingTop: 30 }}>{item?.unit}</td>

                <td style={{ paddingTop: 30 }}>
                  {item?.productSubCategory?.id ? (
                    item?.productSubCategory?.name
                  ) : (
                    <p style={{ fontWeight: 700 }} className="text-danger">
                      Lỗi loại sản phẩm phụ
                    </p>
                  )}
                </td>
                <td style={{ paddingTop: 30 }}>
                  {item?.supermarket?.id ? (
                    item?.supermarket?.name
                  ) : (
                    <p style={{ fontWeight: 700 }} className="text-danger">
                      Lỗi siêu thị
                    </p>
                  )}
                </td>
                <td style={{ paddingTop: 30 }}>
                  <i
                    onClick={() => {
                      handleOpenProductBatch();
                    }}
                    class="bi bi-eye-fill"
                  ></i>
                </td>

                <td style={{ paddingTop: 30 }}>
                  {errorList.some(
                    (data) => parseInt(data?.index) === item.index + 1
                  ) || !item.productImageList ? (
                    <i
                      onClick={handleOpenErrorList}
                      style={{ marginLeft: "-3px" }}
                      class="bi bi-exclamation-circle-fill text-danger"
                    ></i>
                  ) : (
                    <i
                      style={{ marginLeft: "-3px" }}
                      class="bi bi-check-circle-fill"
                    ></i>
                  )}
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
            className="modal__container-footer-buttons-create"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDuplicated;
