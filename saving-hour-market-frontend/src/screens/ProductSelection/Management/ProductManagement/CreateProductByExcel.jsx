import { faXmark } from "@fortawesome/free-solid-svg-icons";
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateProductByExcel = ({
  handleClose,
  handleOpenConfirmCreate,
  setConfirmProductList,
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
        if (res.code === 422) {
          setLoading(false);
          const listError = Object.entries(res.errorFields).map(
            ([key, value]) => {
              return `${key}: ${value}`;
            }
          );
          setErrorList(listError);
          return;
        }
        setLoading(false);
        setConfirmProductList({
          productList: res.productList,
          errorFields: res.errorFields,
        });
        handleClose();
        handleOpenConfirmCreate();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className={`modal__container ${
        errorList.length >= 8 ? "modal-scroll" : ""
      }`}
    >
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm sản phẩm</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      <div className={`modal__container-body `}>
        <div className="modal__container-body-wrapper">
          <div className="template-wrapper">
            <h3>Tải bản mẫu tại đây :</h3>
            <a href="https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/ExcelTemplate%2FProductUploadTemplate.xlsx?alt=media&token=109b0aad-c298-4d1c-a9ca-fb449b2a229a&_gl=1*gg9veo*_ga*MTYxMzkwMjU5MC4xNjg4NDU2Mzc5*_ga_CW55HF8NVT*MTY5Nzc4MzgxNC4zNC4xLjE2OTc3ODM4NzYuNjAuMC4w">
              Bản mẫu
            </a>
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
                    setErrorList([]);
                  }}
                  size={25}
                />
              </span>
            </section>
          )}
          {errorList.length !== 0 && (
            <div className="list-error">
              {errorList.map((item) => (
                <p style={{ fontSize: "14px" }} className="text-danger">
                  {item}
                </p>
              ))}
            </div>
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
            Tạo mới
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

export default CreateProductByExcel;
