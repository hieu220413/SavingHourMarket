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
const CreateCategory = ({
  handleClose,
  setCategory,
  page,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
}) => {
  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );
  const [imgSubCateToFirebase, setImgSubCateToFirebase] = useState("");

  const [categories, setCategories] = useState([]);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] =
    useState("Chọn loại sản phẩm");

  const [loading, setLoading] = useState(false);

  //validate data
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(0);
  // check error
  const [isSwitch, setIsSwitch] = useState(false);
  const [error, setError] = useState({
    category: "",
    subCateName: "",
    allowableDisplayThreshold: "",
    imageUrlSubCate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/product/getCategoryForStaff?page=0&limit=99`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.productCategoryList);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

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
    fetch(`${API.baseURL}/api/product/createCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitProductCategory),
    })
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
            setLoading(false);
            handleClose();
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setMsg("Thêm loại sản phẩm thành công");
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      });
  };

  const handleSubmitSubCategory = async () => {
    if (categoryName === "") {
      setError({ ...error, category: "Hãy chọn loại sản phẩm trước" });
      return;
    }

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
            setLoading(false);
            handleClose();
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
        {isSwitch === false && (
          <>
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">
                Thêm loại sản phẩm mới
              </h3>
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
            <div
              className="modal__container-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="modal__container-footer-buttons">
                {/* <button
                  className="modal__container-footer-buttons-close"
                  onClick={() => {
                    console.log("click");
                    setIsSwitch(true);
                  }}
                >
                  Thêm loại sản phẩm phụ
                </button> */}
              </div>
              <div className="modal__container-footer-buttons">
                <button
                  onClick={handleSubmitCategory}
                  className="modal__container-footer-buttons-create"
                >
                  Tạo mới
                </button>
              </div>
            </div>
          </>
        )}
        {isSwitch === true && (
          <>
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">
                Thêm loại sản phẩm phụ mới
              </h3>
              <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
            </div>
            <div className="modal__container-body" style={{ height: "100%" }}>
              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Tên loại sản phẩm
                </h4>
                <div>
                  <div style={{ display: "flex" }}>
                    <div className="dropdown" style={{ width: "400px" }}>
                      <div
                        className="dropdown-btn"
                        onClick={(e) =>
                          setIsActiveDropdownCate(!isActiveDropdownCate)
                        }
                      >
                        {selectedDropdownItemCate}
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      {isActiveDropdownCate && (
                        <div className="dropdown-content">
                          {categories.map((item, index) => (
                            <div
                              onClick={(e) => {
                                setSelectedDropdownItemCate(item.name);
                                setIsActiveDropdownCate(false);
                                setCategoryId(item.id);
                                setCategoryName(item.name);
                                setError({ ...error, category: "" });
                              }}
                              className="dropdown-item"
                              key={index}
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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

              {/* Sub Cate*/}
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
                      if (categoryName === "") {
                        setError({
                          ...error,
                          subCateName: "Vui lòng chọn loại sản phẩm trước",
                        });
                      }
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
                          setFileNameSubCate(
                            "Chưa có hình ảnh loại sản phẩm phụ"
                          );
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
            <div
              className="modal__container-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="modal__container-footer-buttons">
                <button
                  className="modal__container-footer-buttons-close"
                  onClick={() => {
                    setIsSwitch(false);
                  }}
                >
                  Thêm loại sản phẩm
                </button>
              </div>
              <div className="modal__container-footer-buttons">
                <button
                  onClick={handleSubmitSubCategory}
                  className="modal__container-footer-buttons-create"
                >
                  Tạo mới
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {loading && <LoadingScreen />}
    </>
  );
};

export default CreateCategory;
