import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCaretDown,
  faRepeat,
  faPlusCircle,
  faMinus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import dayjs from "dayjs";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";
const CreateCategory = ({ handleClose }) => {
  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );
  const [imgSubCateToFirebase, setImgSubCateToFirebase] = useState("");

  const [categories, setCategories] = useState([]);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] =
    useState("Chọn loại sản phẩm");
  const [isCreateNewCate, setIsCreateNewCate] = useState(false);

  const [subCategories, setSubCategories] = useState([]);
  const [isActiveDropdownSubCate, setIsActiveDropdownSubCate] = useState(false);
  const [selectedDropdownItemSubCate, setSelectedDropdownItemSubCate] =
    useState("Chọn loại sản phẩm phụ");
  const [isCreateNewSubCate, setIsCreateNewSubCate] = useState(false);

  //validate data
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState("");
  const [subCategoryId, setSubcategoryId] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(0);
  const [imageUrlSubCate, setImageUrlSubCate] = useState("");
  // check error
  const [checkCategorySelected, setCheckCategorySelected] = useState(false);
  const [error, setError] = useState({
    category: "",
    subCateName: "",
    allowableDisplayThreshold: "",
    imageUrlSubCate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/product/getAllCategory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
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
        setImageUrlSubCate(url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async () => {
    console.log("click");
    uploadSubCateImgToFireBase();
    if (category === "") {
      setError({ ...error, category: "Vui lòng không để trống" });
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
    // Category Data
    const submitProductCategory = {
      id: categoryId ? categoryId : "",
      name: category,
      totalDiscountUsage: 0,
    };

    //  Subcategory Data
    const submitProductSubCategory = {
      id: subCategoryId ? subCategoryId : "",
      name: subCateName,
      imageUrl: imageUrlSubCate,
      allowableDisplayThreshold: allowableDisplayThreshold,
      productCategory: submitProductCategory,
      totalDiscountUsage: 0,
    };
  };

  return (
    <div className="modal__container">
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
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
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
          <button
            className="modal__container-footer-buttons-close"
            onClick={() => {
              console.log("click");
            }}
          >
            Thêm loại sản phẩm phụ
          </button>
        </div>
        <div className="modal__container-footer-buttons">
          <button
            onClick={handleSubmit}
            className="modal__container-footer-buttons-create"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
