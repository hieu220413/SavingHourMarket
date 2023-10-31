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

    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    return (
      <>
        <tr key={index} className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30 }}>
            {dayjs(item.expiredDate).format("DD/MM/YYYY")}
          </td>
          <td style={{ paddingTop: 30 }}>
            {item.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td style={{ paddingTop: 30 }}>{item.quantity}</td>
          <td style={{ paddingTop: 30 }}>{item.productSubCategory.name}</td>
          <td style={{ paddingTop: 30 }}>{item.supermarket.name}</td>
          <td style={{ paddingTop: 30 }}>
            <i onClick={handleOpen} class="bi bi-pencil-square"></i>
            <i onClick={handleOpenDelete} class="bi bi-trash-fill"></i>
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
      </>
    );
  };

  return (
    <div
      style={{ width: "max-content" }}
      className="modal__container modal-scroll"
    >
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Xác nhận danh sách sản phẩm
        </h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      <div className="modal__container-body">
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Hình ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Ngày hết hạn</th>
                <th>Giá tiền</th>
                <th>Số lượng</th>
                <th>Loại sản phẩm phụ</th>
                <th>Siêu thị</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {confirmProductList.map((item, index) => (
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
