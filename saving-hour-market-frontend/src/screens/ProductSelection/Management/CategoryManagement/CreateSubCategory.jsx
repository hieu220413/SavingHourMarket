import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const CreateSubCategory = ({
  handleClose,
  setSubCateList,
  categoryId,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
}) => {
  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );
  const [imgSubCateToFirebase, setImgSubCateToFirebase] = useState("");
  const [loading, setLoading] = useState(false);

  //validate data
  const [subCateName, setSubCateName] = useState("");
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(0);
  const [error, setError] = useState({
    subCateName: "",
    allowableDisplayThreshold: "",
    imageUrlSubCate: "",
  });

  const uploadSubCateImgToFireBase = async () => {
    if (imgSubCateToFirebase !== "") {
      const imgRefSubCate = ref(imageDB, `subCateImage/${v4()}`);
      await uploadBytes(imgRefSubCate, imgSubCateToFirebase);
      try {
        const url = await getDownloadURL(imgRefSubCate);
        return url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmitSubCategory = async () => {
    if (error.subCateName !== "") {
      console.log("Chưa chọn loại sản phẩm");
      return;
    }

    if (subCateName === "") {
      setError({ ...error, subCateName: "Vui lòng không để trống" });
      return;
    }

    if (allowableDisplayThreshold <= 0 || !allowableDisplayThreshold) {
      setError({
        ...error,
        allowableDisplayThreshold: "Số ngày trước hạn sử dụng phải lớn hơn 0",
      });
      return;
    }
    let imageUrlSubCate = await uploadSubCateImgToFireBase();
    if (imageUrlSubCate === "") {
      setError({ ...error, imageUrlSubCate: "Chưa có ảnh sản phẩm" });
      return;
    }
    //  Subcategory Data
    const submitProductSubCategory = {
      name: subCateName,
      imageUrl: imageUrlSubCate,
      allowableDisplayThreshold: allowableDisplayThreshold,
      productCategoryId: categoryId,
    };
    const tokenId = await auth.currentUser.getIdToken();
    setLoading(true);
    fetch(`${API.baseURL}/api/product/createSubCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitProductSubCategory),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 422) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
          });
          setMsg(
            "Tạo mới không thành công. \nChỉ được phép nhập kí tự chữ trong bảng chữ cái và dấu cách "
          );
          setLoading(false);
          handleClose();
          return;
        }
        fetch(
          `${API.baseURL}/api/product/getSubCategoryForStaff?productCategoryId=${categoryId}&page=0&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            console.log(res.productSubCategoryList);
            setSubCateList(res.productSubCategoryList);
            handleClose();
            setLoading(false);
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setMsg("Thêm loại sản phẩm phụ thành công");
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      });
  };
  return (
    <>
      <div className="modal__container">
        <div className="modal__container-header">
          <h3 className="modal__container-header-title">
            Thêm loại sản phẩm phụ mới
          </h3>
          <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
        </div>
        <div className="modal__container-body" style={{ height: "100%" }}>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Tên loại sản phẩm phụ
            </h4>
            <div>
              {" "}
              <input
                placeholder="Nhập tên loại sản phẩm phụ"
                type="text"
                className="modal__container-body-inputcontrol-input"
                value={subCateName}
                onChange={(e) => {
                  setSubCateName(e.target.value);
                  setError({ ...error, subCateName: "" });
                }}
              />
              {error.subCateName && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.subCateName}
                </p>
              )}
            </div>
          </div>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Số ngày trước hạn HSD
            </h4>
            <div>
              <input
                min={0}
                placeholder="Nhập số ngày tối thiểu trước HSD"
                type="number"
                className="modal__container-body-inputcontrol-input"
                value={allowableDisplayThreshold}
                onChange={(e) => {
                  setAllowableDisplayThreshold(e.target.value);
                  setError({ ...error, allowableDisplayThreshold: "" });
                }}
              />
              {error.allowableDisplayThreshold && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.allowableDisplayThreshold}
                </p>
              )}
            </div>
          </div>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Tải ảnh
            </h4>
            <div style={{ maxWidth: "400px" }}>
              <div
                className="imgWrapper"
                onClick={() =>
                  document.querySelector("#imgUploadSubCate").click()
                }
              >
                <input
                  id="imgUploadSubCate"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={({ target: { files } }) => {
                    files[0] && setFileNameSubCate(files[0].name);
                    if (files && files[0]) {
                      setImageSubCate(URL.createObjectURL(files[0]));
                      setImgSubCateToFirebase(files[0]);
                      setError({ ...error, imageUrlSubCate: "" });
                    }
                  }}
                />
                {imageSubCate ? (
                  <img
                    src={imageSubCate}
                    width={360}
                    height={160}
                    alt={fileNameSubCate}
                    style={{ borderRadius: "5px" }}
                  />
                ) : (
                  <>
                    <MdCloudUpload color="#37a65b" size={60} />
                    <p style={{ fontSize: "14px" }}>
                      Tải ảnh loại sản phẩm phụ
                    </p>
                  </>
                )}
              </div>
              <section className="uploaded-row">
                <AiFillFileImage color="#37a65b" size={25} />
                <span className="upload-content">
                  {fileNameSubCate} -
                  <MdDelete
                    color="#37a65b"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFileNameSubCate("Chưa có hình ảnh loại sản phẩm phụ");
                      setImageSubCate(null);
                      setImgSubCateToFirebase("");
                    }}
                    size={25}
                  />
                </span>
              </section>
            </div>
          </div>
        </div>
        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              className="modal__container-footer-buttons-close"
              onClick={handleClose}
            >
              Đóng
            </button>
            <button
              onClick={handleSubmitSubCategory}
              className="modal__container-footer-buttons-create"
            >
              Tạo mới
            </button>
          </div>
        </div>
      </div>
      {loading && <LoadingScreen />}
    </>
  );
};

export default CreateSubCategory;
