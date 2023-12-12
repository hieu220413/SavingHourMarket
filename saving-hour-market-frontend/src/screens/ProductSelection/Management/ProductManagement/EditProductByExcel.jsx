import {
  faFileExport,
  faTable,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import "./CreateProductByExcel.scss";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import { AiFillFileImage } from "react-icons/ai";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import dayjs from "dayjs";
import { format } from "date-fns";
const ExcelJS = require("exceljs");

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditProductByExcel = ({
  handleClose,
  setConfirmProductList,
  confirmProductList,
  setPageProduct,
  setSearchProductValue,
}) => {
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
  });
  const { vertical, horizontal } = openSnackbar;
  const [loading, setLoading] = useState(false);
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const handleSelectFile = (e) => {
    setErrorList([]);
    let selectedFile = e.target.files[0];
    setExcelFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!excelFile) {
      setError("Vui lòng chọn file trước");
      setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
      return;
    }
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    let formData = new FormData();
    formData.append("file", excelFile);
    fetch(`${API.baseURL}/api/product/uploadExcelFile`, {
      method: "POST",
      headers: {
        // Accept: "application/json, application/xml, text/plain, text/html, *.*",
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${tokenId}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.status === 500) {
          setLoading(false);
          setError("File không đúng với bản mẫu");
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          return;
        }

        setLoading(false);
        setConfirmProductList({
          productList: res.productList,
          errorFields: res.errorFields,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toImageUrl = async (url) => {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = () => {
          resolve({ base64Url: reader.result });
        };
      };

      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
    return promise;
  };

  const handleExportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("EditProductUpload");
    sheet.properties.defaultRowHeight = 150;
    sheet.properties.defaultColWidth = 40;
    sheet.columns = [
      { header: "STT", key: "stt", width: 6 },
      { header: "Tên", key: "name", width: 20 },
      { header: "Mô tả sản phẩm", key: "description", width: 35 },
      { header: "Giá niêm yết", key: "priceListed", width: 15 },
      { header: "Đơn vị", key: "unit", width: 15 },
      { header: "Danh mục phụ", key: "subCategory", width: 30 },
      { header: "Siêu thị", key: "supermarket", width: 15 },
      { header: "HSD", key: "expDate", width: 15 },
      { header: "Giá bán", key: "price", width: 15 },
      { header: "Giá gốc", key: "priceOriginal", width: 15 },
      {
        header: "Địa chỉ kho lưu giữ + số lượng",
        key: "batchAddress",
        width: 70,
      },
      {
        header: "Hình ảnh",
        key: "imageUrls",
        width: 40,
      },
    ];
    const promise = Promise.all(
      confirmProductList.productList.map(async (product, i) => {
        if (product.productBatchList.length !== 0) {
          product.productBatchList.map(async (batch, numBatch) => {
            const batchAddressAndQuantity = batch.productBatchAddresses.reduce(
              (start, address) => {
                if (address.supermarketAddress) {
                  return start.concat(
                    start !== "" ? " \n" : "",
                    address.supermarketAddress.address.concat(
                      ";",
                      address?.quantity ? address?.quantity : "Lỗi số lượng !"
                    )
                  );
                } else {
                  return start.concat(
                    start !== "" ? " \n" : "",
                    "Lỗi địa chỉ".concat(
                      ";",
                      address?.quantity ? address?.quantity : "Lỗi số lượng !"
                    )
                  );
                }
              },
              ""
            );
            sheet.addRow({
              stt: i + 1,
              name: product?.name ? product?.name : "Lỗi tên !",
              description: product?.description
                ? product?.description
                : "Lỗi mô tả !",
              priceListed: product?.priceListed
                ? product?.priceListed
                : "Lỗi giá niêm yết",
              unit: product?.unit ? product?.unit : "Lỗi đơn vị !",
              subCategory: product?.productSubCategory?.id
                ? product?.productSubCategory?.name
                : "Lỗi loại sản phẩm phụ !",
              supermarket: product?.supermarket?.id
                ? product?.supermarket?.name
                : "Lỗi siêu thị !",
              expDate: batch?.expiredDate
                ? new Date(batch.expiredDate)
                : "Lỗi HSD !",
              price: batch?.price ? batch?.price : "Lỗi giá tiền !",
              priceOriginal: batch?.priceOriginal
                ? batch?.priceOriginal
                : "Lỗi giá tiền !",
              batchAddress: batchAddressAndQuantity,
              imageUrls:
                product.imageUrls?.length === 0 || product.imageUrls === null
                  ? "Lỗi hình ảnh !"
                  : "",
            });
          });
        } else {
          sheet.addRow({
            stt: i + 1,
            name: product?.name ? product?.name : "Lỗi tên !",
            description: product?.description
              ? product?.description
              : "Lỗi mô tả !",
            priceListed: product?.priceListed
              ? product?.priceListed
              : "Lỗi giá niêm yết",
            unit: product?.unit ? product?.unit : "Lỗi đơn vị !",
            subCategory: product?.productSubCategory?.id
              ? product?.productSubCategory?.name
              : "Lỗi loại sản phẩm phụ !",
            supermarket: product?.supermarket?.id
              ? product?.supermarket?.name
              : "Lỗi siêu thị !",
            expDate: "Lỗi lô hàng !",
            price: "Lỗi lô hàng !",
            priceOriginal: "Lỗi lô hàng !",
            batchAddress: "Lỗi lô hàng !",
            imageUrls:
              product.imageUrls?.length === 0 || product.imageUrls === null
                ? "Lỗi hình ảnh !"
                : "",
          });
        }
        const temProductList = [...confirmProductList.productList];

        if (product.imageUrls?.length !== 0 && product.imageUrls !== null) {
          for (let j = 0; j < product.imageUrls.length; j++) {
            const imageUrl = await toImageUrl(product.imageUrls[j]);
            console.log(imageUrl);
            const imageId = workbook.addImage({
              base64: imageUrl.base64Url,
              extension: "png",
            });
            sheet.addImage(imageId, {
              tl: {
                col: j + 11,
                row:
                  i > 0
                    ? i +
                      1 +
                      (temProductList[i - 1]?.productBatchList.length - 1)
                    : i + 1,
              },
              ext: { width: 100, height: 100 },
              editAs: "oneCell",
            });
          }
        }
      })
    );

    promise.then(() => {
      sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell(function (cell, colNumber) {
          if (colNumber !== 8) {
            cell.font = {
              name: "Helvetica",
              bold: false,
              size: 12,
            };
          }

          if (rowNumber === 1) {
            row.height = 20;
            row.font = {
              name: "Helvetica",
              bold: true,
              size: 12,
            };
          } else {
            row.height = 150;
          }

          if (row.getCell(colNumber).toString().includes("Lỗi")) {
            cell.border = {
              top: { style: "thick", color: { argb: "dc3545" } },
              left: { style: "thick", color: { argb: "dc3545" } },
              bottom: { style: "thick", color: { argb: "dc3545" } },
              right: { style: "thick", color: { argb: "dc3545" } },
            };
            cell.font = {
              name: "Helvetica",
              bold: true,
              size: 12,
              color: { argb: "dc3545" },
            };
          }
        });
      });

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "EditProductUpload.xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <div className={`modal__container `}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Chỉnh sửa danh sách sản phẩm
        </h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      <div className={`modal__container-body `}>
        <div className="modal__container-body-wrapper">
          <div style={{ marginBottom: 20 }} className="template-wrapper">
            <h3>Tệp excel đã xác định lỗi :</h3>
            <div
              onClick={handleExportExcel}
              style={{ width: "fit-content", padding: "0 15px" }}
              className="supermarket__header-button"
            >
              <FontAwesomeIcon icon={faFileExport} />
              Xuất excel
            </div>
          </div>

          <div
            className="imgWrapper"
            onClick={() =>
              document.querySelector("#excelUploadProducts").click()
            }
          >
            <input
              onChange={(e) => handleSelectFile(e)}
              id="excelUploadProducts"
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
            />
            <MdCloudUpload color="#37a65b" size={60} />
            <p style={{ fontSize: "14px" }}>
              {excelFile ? excelFile.name : "Tải lên file excel"}
            </p>
          </div>
          {excelFile && (
            <section className="uploaded-row">
              {excelFile.name}
              <span className="upload-content">
                <MdDelete
                  color="#37a65b"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setExcelFile(null);
                    document.getElementById("excelUploadProducts").value = null;
                  }}
                  size={25}
                />
              </span>
            </section>
          )}
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
          <button
            onClick={handleSubmit}
            className="modal__container-footer-buttons-create"
          >
            Cập nhật
          </button>
        </div>
      </div>
      {/* *********************** */}
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {error}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default EditProductByExcel;
