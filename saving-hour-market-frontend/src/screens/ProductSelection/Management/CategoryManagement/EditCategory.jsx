import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
const EditCategory = ({
  handleClose,
  categoryToEdit,
  setCategory,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
  searchValue,
  setTotalPage,
  page,
}) => {
  //validate data
  const [categoryId, setCategoryId] = useState(categoryToEdit.id);
  const [categoryName, setCategoryName] = useState(categoryToEdit.name);
  const [error, setError] = useState({
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmitCategory = async () => {
    if (categoryName === "") {
      setError({ ...error, category: "Vui lòng không để trống" });
      return;
    }

    // Category Data
    const submitProductCategory = {
      name: categoryName,
    };

    const tokenId = await auth.currentUser.getIdToken();
    setLoading(true);
    fetch(
      `${API.baseURL}/api/product/updateCategory?categoryId=${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify(submitProductCategory),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        fetch(
          `${
            API.baseURL
          }/api/product/getCategoryForStaff?name=${searchValue}&page=${
            page - 1
          }&limit=5`,
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
            setCategory(data.productCategoryList);
            setTotalPage(data.totalPage);
            handleClose();
            setLoading(false);
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setMsg("Sửa loại sản phẩm thành công");
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
          <h3 className="modal__container-header-title">Sửa loại sản phẩm</h3>
          <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
        </div>
        <div className="modal__container-body" style={{ height: "100%" }}>
          {/* Create Categories */}

          <>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên loại sản phẩm
              </h4>
              <div>
                <input
                  placeholder="Nhập tên loại sản phẩm"
                  type="text"
                  className="modal__container-body-inputcontrol-input"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setError({ ...error, category: "" });
                  }}
                />
                {error.category && (
                  <p
                    style={{ fontSize: "14px", marginBottom: "-10px" }}
                    className="text-danger"
                  >
                    {error.category}
                  </p>
                )}
              </div>
            </div>
          </>
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
              onClick={handleSubmitCategory}
              className="modal__container-footer-buttons-create"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>
      {loading && <LoadingScreen />}
    </>
  );
};

export default EditCategory;
