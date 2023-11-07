import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import EditConfirmProduct from "./EditConfirmProduct";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import NullImage from "../../../../assets/Null-Image.png";
import ProductBatchUploadByExcel from "./ProductBatchUploadByExcel";
import ErrorProductUploadByExcel from "./ErrorProductUploadByExcel";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ConfirmProductUploadByExcel = ({
  handleClose,
  confirmProductList,
  setConfirmProductList,
  setOpenSuccessSnackbar,
  openSuccessSnackbar,
  setMsg,
  setProducts,
  searchValue,
  page,
  setTotalPage,
  setIsSwitchRecovery,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState(
    Object.entries(confirmProductList.errorFields).map(([key, value]) => {
      return { index: key, value: value };
    })
  );

  const handleConfirm = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/product/create/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(confirmProductList),
    })
      .then((res) => res.json())
      .then(async (res) => {
        fetch(
          `${API.baseURL}/api/product/getProductsForStaff?page=${
            page - 1
          }&limit=5&name=${searchValue}&status=ENABLE`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setProducts(data.productList);
            setTotalPage(data.totalPage);
            setLoading(false);
            handleClose();
            setIsSwitchRecovery(false);
            setMsg("Thêm mới thành công");
            setOpenSuccessSnackbar({
              ...openSuccessSnackbar,
              open: true,
              severity: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      })
      .catch((err) => console.log(err));
  };

  const ProductRow = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openProductBatch, setOpenProductBatch] = useState(false);
    const handleOpenProductBatch = () => setOpenProductBatch(true);
    const handleCloseProductBatch = () => setOpenProductBatch(false);

    const [openErrorList, setOpenErrorList] = useState(false);
    const handleOpenErrorList = () => setOpenErrorList(true);
    const handleCloseErrorList = () => setOpenErrorList(false);

    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const errorField = errorList.find(
      (item) => parseInt(item.index) === index + 1
    );

    return (
      <>
        <tr key={index} className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            {item.productImageList ? (
              <img
                alt="hình"
                width="80px"
                height="60px"
                src={item?.productImageList[0]?.image}
              />
            ) : (
              <img alt="hình" width="80px" height="60px" src={NullImage} />
            )}
          </td>
          <td style={{ paddingTop: 30 }}>{item?.name}</td>

          <td style={{ paddingTop: 30 }}>
            {item?.productSubCategory?.id ? (
              item?.productSubCategory?.name
            ) : (
              <p style={{ fontWeight: 600 }} className="text-danger">
                Không tồn tại
              </p>
            )}
          </td>
          <td style={{ paddingTop: 30 }}>
            {item?.supermarket?.id ? (
              item?.supermarket?.name
            ) : (
              <p style={{ fontWeight: 600 }} className="text-danger">
                Không tồn tại
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
            <i onClick={handleOpen} class="bi bi-pencil-square"></i>
            <i onClick={handleOpenDelete} class="bi bi-trash-fill"></i>
          </td>
          <td style={{ paddingTop: 30 }}>
            {errorList.some((item) => parseInt(item.index) === index + 1) ? (
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
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <EditConfirmProduct
            confirmProductList={confirmProductList}
            setConfirmProductList={setConfirmProductList}
            handleClose={handleClose}
            product={item}
            index={index}
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseDelete}
          aria-labelledby="customized-dialog-title"
          open={openDelete}
        >
          <div className="modal__container">
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">Xóa sản phẩm</h3>
              <FontAwesomeIcon onClick={handleCloseDelete} icon={faXmark} />
            </div>
          </div>
          <div className="modal__container-body">
            <h4> Bạn có chắc muốn xóa sản phẩm này</h4>
          </div>
          {/* modal footer */}
          <div className="modal__container-footer">
            <div className="modal__container-footer-buttons">
              <button
                onClick={handleCloseDelete}
                className="modal__container-footer-buttons-close"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setConfirmProductList(
                    confirmProductList.filter((item, i) => i !== index)
                  );
                  setOpenSnackbar({
                    ...openSnackbar,
                    open: true,
                    severity: "success",
                  });
                }}
                className="modal__container-footer-buttons-create"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          onClose={handleCloseProductBatch}
          aria-labelledby="customized-dialog-title"
          open={openProductBatch}
        >
          <ProductBatchUploadByExcel
            handleClose={handleCloseProductBatch}
            productBatch={item.productBatchList}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseErrorList}
          aria-labelledby="customized-dialog-title"
          open={openErrorList}
        >
          <ErrorProductUploadByExcel
            handleClose={handleCloseErrorList}
            errorList={errorField ? errorField.value : []}
          />
        </Dialog>
      </>
    );
  };

  return (
    <div style={{ width: "1150px" }} className="modal__container modal-scroll">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Xác nhận danh sách sản phẩm
        </h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="modal__container-body"
      >
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Hình ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Loại sản phẩm phụ</th>
                <th>Siêu thị</th>
                <th>Lô hàng</th>
                <th>Thao tác</th>
                <th>Lỗi</th>
              </tr>
            </thead>
            <tbody>
              {confirmProductList.productList.map((item, index) => (
                <ProductRow item={item} index={index} />
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
          <button
            onClick={handleConfirm}
            className="modal__container-footer-buttons-create"
          >
            Xác nhận
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
          Chỉnh sửa thành công
        </Alert>
      </Snackbar>

      {loading && <LoadingScreen />}
    </div>
  );
};

export default ConfirmProductUploadByExcel;
