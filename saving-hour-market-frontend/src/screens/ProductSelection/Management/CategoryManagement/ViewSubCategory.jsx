import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import EditSubCategory from "./EditSubCategory";
import CreateSubCategory from "./CreateSubCategory";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ViewSubCategory = ({ handleClose, subCategoryToView, categoryName }) => {
  const categoryId = subCategoryToView.id;
  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [subCategoryToEdit, setSubCategoryToEdit] = useState(null);
  const [msg, setMsg] = useState("");
  const [subCateList, setSubCateList] = useState(
    subCategoryToView.productSubCategories
  );

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const SubCateRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30, fontWeight: "bold" }}>
            {item.allowableDisplayThreshold}
          </td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                setSubCategoryToEdit(item);
                handleOpenEdit();
              }}
              class="bi bi-pencil-square"
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
            Chi tiết các loại sản phẩm phụ cho {categoryName}
          </h3>
          <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
        </div>

        <div className="modal__container-body">
          <div className="table__container">
            <table class="table ">
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Hình ảnh</th>
                  <th>Tên loại sản phẩm phụ</th>
                  <th>Ngày trước hạn HSD cho phép</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {subCateList.map((item, index) => (
                  <SubCateRow item={item} index={index} key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              onClick={handleOpenCreate}
              className="modal__container-footer-buttons-create"
            >
              Thêm loại sản phẩm phụ
            </button>
          </div>
        </div>
      </div>

      <Dialog
        onClose={handleCloseCreate}
        aria-labelledby="customized-dialog-title"
        open={openCreate}
      >
        <CreateSubCategory
          handleClose={handleCloseCreate}
          setSubCateList={setSubCateList}
          categoryId={categoryId}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseEdit}
        aria-labelledby="customized-dialog-title"
        open={openEdit}
      >
        <EditSubCategory
          handleClose={handleCloseEdit}
          subCategoryToEdit={subCategoryToEdit}
          setSubCateList={setSubCateList}
          categoryId={categoryId}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
        />
      </Dialog>
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
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ViewSubCategory;
