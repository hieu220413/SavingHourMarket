import {
  faCaretDown,
  faRepeat,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { API } from "../../../../contanst/api";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { MdCloudUpload } from "react-icons/md";
import { format } from "date-fns";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const EditConfirmProduct = ({
  product,
  index,
  handleClose,
  confirmProductList,
  setConfirmProductList,
  setOpenSnackbar,
  openSnackbar,
}) => {
  const [supermarkets, setSupermarkets] = useState([]);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [selectedSupermarketDropdownItem, setSelectedSupermarketDropdownItem] =
    useState(product.supermarket);
  const [categories, setCategories] = useState([]);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] = useState(
    product.productSubCategory.productCategory
  );
  const [subCategories, setSubCategories] = useState([]);
  const [isActiveDropdownSubCate, setIsActiveDropdownSubCate] = useState(false);
  const [selectedDropdownItemSubCate, setSelectedDropdownItemSubCate] =
    useState(product.productSubCategory);
  const [productName, setProductName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [priceOriginal, setPriceOriginal] = useState(product.priceOriginal);
  const [quantity, setQuantity] = useState(product.quantity);
  const [expiredDate, setExpiredDate] = useState(
    format(new Date(product.expiredDate), "yyyy-MM-dd")
  );
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(product.imageUrl);
  const [imageToFireBase, setImageToFireBase] = useState("");

  const [error, setError] = useState({
    productName: "",
    price: "",
    priceOriginal: "",
    description: "",
    expiredDate: "",
    quantity: "",
    imageUrl: "",
    supermarket: "",
    supermarketHotline: "",
    supermarketAddress: "",
    category: "",
    subCateName: "",
    allowableDisplayThreshold: "",
    imageUrlSubCate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/supermarket/getSupermarketForStaff`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSupermarkets(data.supermarketList);
        });

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
          const currentCate = data.find(
            (item) => item.name === selectedDropdownItemCate.name
          );
          setSubCategories(currentCate.productSubCategories);
        });
    };
    fetchData();
  }, []);

  const onConfirm = async () => {
    if (productName === "") {
      setError({ ...error, productName: "Vui lòng không để trống" });
      return;
    }
    if (price < 0 || !price) {
      setError({ ...error, price: "Số tiền nhập vào phải lớn hớn 0" });
      return;
    }
    if (priceOriginal < 0 || !priceOriginal) {
      setError({ ...error, priceOriginal: "Số tiền nhập vào phải lớn hớn 0" });
      return;
    }
    if (description === "") {
      setError({ ...error, description: "Vui lòng không để trống" });
      return;
    }
    if (quantity < 0 || !quantity) {
      setError({ ...error, quantity: "Số lượng nhập vào phải lớn hớn 0" });
      return;
    }
    let submitUpdate = {};
    if (!imageToFireBase) {
      submitUpdate = {
        id: null,
        name: productName,
        price: parseInt(price),
        priceOriginal: priceOriginal,
        description: description,
        expiredDate: format(new Date(expiredDate), "yyyy-MM-dd").concat(
          "T00:00:00Z"
        ),
        quantity: quantity,
        status: 1,
        imageUrl: image,
        productSubCategory: {
          ...selectedDropdownItemSubCate,
          productCategory: {
            id: selectedDropdownItemCate.id,
            name: selectedDropdownItemCate.name,
          },
        },
        supermarket: selectedSupermarketDropdownItem,
      };
    }
    if (imageToFireBase) {
      const imgRef = ref(imageDB, `productImage/${v4()}`);
      await uploadBytes(imgRef, imageToFireBase);
      try {
        const url = await getDownloadURL(imgRef);
        submitUpdate = {
          id: null,
          name: productName,
          price: parseInt(price),
          priceOriginal: priceOriginal,
          description: description,
          expiredDate: format(new Date(expiredDate), "yyyy-MM-dd").concat(
            "T00:00:00Z"
          ),
          quantity: quantity,
          status: 1,
          imageUrl: url,
          productSubCategory: {
            ...selectedDropdownItemSubCate,
            productCategory: {
              id: selectedDropdownItemCate.id,
              name: selectedDropdownItemCate.name,
            },
          },
          supermarket: selectedSupermarketDropdownItem,
        };
      } catch (error) {
        console.log(error);
      }
    }
    const newList = confirmProductList.map((item, i) => {
      if (index === i) {
        return submitUpdate;
      }
      return item;
    });
    console.log(newList);
    setOpenSnackbar({ ...openSnackbar, open: true, severity: "success" });
    setConfirmProductList(newList);
  };

  return (
    // modal header
    <div className="modal__container ">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chỉnh sửa sản phẩm</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      <div
        style={{ height: "65vh", overflowY: "scroll" }}
        className="modal__container-body"
      >
        {/* Siêu Thị */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên siêu thị
          </h4>
          <div style={{ display: "flex" }}>
            <div className="dropdown">
              <div
                className="dropdown-btn"
                onClick={(e) => setIsActiveDropdown(!isActiveDropdown)}
              >
                {selectedSupermarketDropdownItem.name}
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
              {isActiveDropdown && (
                <div className="dropdown-content">
                  {supermarkets.map((item, index) => (
                    <div
                      onClick={(e) => {
                        setSelectedSupermarketDropdownItem(item);
                        setIsActiveDropdown(false);
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
            <button
              disabled
              style={{
                width: "120px",
              }}
              className="buttonSwitchSelectSuperMarket disabled"
            >
              Thêm mới
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
          </div>
        </div>
        {/* * * */}

        {/* Category */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên loại sản phẩm
          </h4>
          <div style={{ display: "flex" }}>
            <div className="dropdown">
              <div
                className="dropdown-btn"
                onClick={(e) => setIsActiveDropdownCate(!isActiveDropdownCate)}
              >
                {selectedDropdownItemCate.name}
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
              {isActiveDropdownCate && (
                <div className="dropdown-content">
                  {categories.map((item, index) => (
                    <div
                      onClick={(e) => {
                        setSelectedDropdownItemCate(item);
                        setIsActiveDropdownCate(false);
                        setSubCategories(item.productSubCategories);
                        setSelectedDropdownItemSubCate(
                          item.productSubCategories[0]
                        );
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
            <button
              disabled
              style={{
                width: "120px",
              }}
              className="buttonSwitchSelectSuperMarket disabled"
            >
              Thêm mới
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
          </div>
        </div>
        {/* * * */}

        {/* Subcategory */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên loại sản phẩm phụ
          </h4>
          <div style={{ display: "flex" }}>
            <div className="dropdown">
              <div
                className="dropdown-btn"
                onClick={(e) => {
                  const isSelected = categories.some(
                    (item) => item.name === selectedDropdownItemCate.name
                  );

                  if (isSelected === true) {
                    setIsActiveDropdownSubCate(!isActiveDropdownSubCate);
                  }
                }}
              >
                {selectedDropdownItemSubCate?.name}
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
              {isActiveDropdownSubCate && (
                <div className="dropdown-content">
                  {subCategories.map((item, index) => (
                    <div
                      onClick={(e) => {
                        setSelectedDropdownItemSubCate(item);
                        setIsActiveDropdownSubCate(false);
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
            <button
              disabled
              style={{
                width: "120px",
              }}
              className="buttonSwitchSelectSuperMarket disabled"
            >
              Thêm mới
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
          </div>
        </div>
        {/* * * */}

        {/* product name */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên sản phẩm
          </h4>
          <div>
            <input
              value={productName}
              placeholder="Nhập tên sản phẩm"
              type="text"
              className="modal__container-body-inputcontrol-input"
              onChange={(e) => {
                setProductName(e.target.value);
                setError({ ...error, productName: "" });
              }}
            />
            {error.productName && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.productName}
              </p>
            )}
          </div>
        </div>
        {/* * * */}

        {/* Price */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Giá tiền</h4>
          <div>
            <input
              value={price}
              min={0}
              placeholder="Nhập số giá tiền"
              type="number"
              className="modal__container-body-inputcontrol-input"
              onChange={(e) => {
                setPrice(e.target.value);
                setError({ ...error, price: "" });
              }}
            />
            {error.price && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.price}
              </p>
            )}
          </div>
        </div>
        {/* PriceOriginal */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Giá gốc</h4>

          <div>
            <input
              value={priceOriginal}
              min={0}
              placeholder="Nhập giá gốc"
              type="number"
              className="modal__container-body-inputcontrol-input"
              onChange={(e) => {
                setPriceOriginal(e.target.value);
                setError({ ...error, priceOriginal: "" });
              }}
            />
            {error.priceOriginal && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.priceOriginal}
              </p>
            )}
          </div>
        </div>
        {/* Description */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Thông tin sản phẩm
          </h4>
          <div>
            <textarea
              className="modal__container-body-inputcontrol-input textareaFocus"
              placeholder="Nhập thông tin sản phẩm"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError({ ...error, description: "" });
              }}
            ></textarea>
            {error.description && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.description}
              </p>
            )}
          </div>
        </div>
        {/* ExpiredDate */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Ngày hết hạn
          </h4>
          <input
            placeholder="Nhập Ngày hết hạn"
            type="date"
            className="modal__container-body-inputcontrol-input"
            value={expiredDate}
            onChange={(e) => {
              // console.log("format", dayjs(e.target.value).$d);
              setExpiredDate(e.target.value);
            }}
          />
        </div>
        {/* Quantity */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Số lượng</h4>
          <div>
            <input
              min={0}
              placeholder="Nhập số lượng"
              type="number"
              className="modal__container-body-inputcontrol-input"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError({ ...error, quantity: "" });
              }}
            />
            {error.quantity && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.quantity}
              </p>
            )}
          </div>
        </div>
        {/* Image Upload */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Tải ảnh</h4>
          <div>
            <div
              className="imgWrapper"
              onClick={() => document.querySelector("#imgUpload").click()}
            >
              <input
                id="imgUpload"
                type="file"
                accept="image/*"
                hidden
                onChange={({ target: { files } }) => {
                  if (files && files[0]) {
                    console.log(files[0]);
                    setImage(URL.createObjectURL(files[0]));
                    setImageToFireBase(files[0]);
                    setError({ ...error, imageUrl: "" });
                  }
                }}
              />
              {image ? (
                <img
                  src={image}
                  width={360}
                  height={160}
                  alt={productName}
                  style={{ borderRadius: "5px" }}
                />
              ) : (
                <>
                  <MdCloudUpload color="#37a65b" size={60} />
                  <p style={{ fontSize: "14px" }}>Tải ảnh sản phẩm</p>
                </>
              )}
            </div>
            {/* <section className="uploaded-row">
              <AiFillFileImage color="#37a65b" size={25} />
              <span className="upload-content">
                {fileName} -
                <MdDelete
                  color="#37a65b"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setFileName("Chưa có hình ảnh sản phẩm");
                    setImage(null);
                    setImgToFirebase("");
                  }}
                  size={25}
                />
              </span>
            </section> */}
            {error.imageUrl && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.imageUrl}
              </p>
            )}
          </div>
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
            onClick={onConfirm}
            className="modal__container-footer-buttons-create"
          >
            Cập nhật
          </button>
        </div>
      </div>
      {/* *********************** */}
    </div>
  );
};

export default EditConfirmProduct;
