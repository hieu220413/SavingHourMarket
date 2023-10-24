import React, { useEffect, useState } from "react";
import "./CreateProduct.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import dayjs from "dayjs";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";

const EditProduct = ({
  handleClose,
  product,
  setProducts,
  setTotalPage,
  page,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
}) => {
  const [image, setImage] = useState(product.imageUrl);
  const [fileName, setFileName] = useState("Chưa có hình ảnh sản phẩm");
  const [imgToFirebase, setImgToFirebase] = useState("");

  const [supermarkets, setSupermarkets] = useState([]);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState(
    product.supermarket.name
  );

  const [categories, setCategories] = useState([]);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] = useState(
    product.productSubCategory.productCategory.name
  );

  const [subCategories, setSubCategories] = useState([]);
  const [isActiveDropdownSubCate, setIsActiveDropdownSubCate] = useState(false);
  const [selectedDropdownItemSubCate, setSelectedDropdownItemSubCate] =
    useState(product.productSubCategory.name);

  const [allowableDate, setAllowableDate] = useState("");

  // validate data
  const [productName, setProductName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [priceOriginal, setPriceOriginal] = useState(product.priceOriginal);
  const [description, setDescription] = useState(product.description);
  const [expiredDate, setExpiredDate] = useState(
    dayjs(product.expiredDate).format("YYYY-MM-DD")
  );
  const [quantity, setQuantity] = useState(product.quantity);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [supermarketId, setSupermarketId] = useState(product.supermarket.id);
  const [supermarket, setSupermarket] = useState(product.supermarket.name);
  const [supermarketHotline, setSuperMarketHotline] = useState(
    product.supermarket.phone
  );
  const [supermarketAddress, setSupermarketAddress] = useState(
    product.supermarket.supermarketAddressList
  );
  const [categoryId, setCategoryId] = useState(
    product.productSubCategory.productCategory.id
  );
  const [category, setCategory] = useState(
    product.productSubCategory.productCategory.name
  );
  const [subCateId, setSubCateId] = useState(product.productSubCategory.id);
  const [subCateName, setSubCateName] = useState(
    product.productSubCategory.name
  );
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(
    product.productSubCategory.allowableDisplayThreshold
  );
  const [imageUrlSubCate, setImageUrlSubCate] = useState(
    product.productSubCategory.imageUrl
  );

  // check error
  const [checkCategorySelected, setCheckCategorySelected] = useState(false);
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
        });
    };
    fetchData();
  }, []);

  const handleUploadImageToFirebase = async () => {
    if (imgToFirebase !== "") {
      const imgRef = ref(imageDB, `productImage/${v4()}`);
      await uploadBytes(imgRef, imgToFirebase);
      try {
        const url = await getDownloadURL(imgRef);
        return url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = async () => {
    if (supermarket === "") {
      setError({ ...error, supermarket: "Vui lòng không để trống" });
      return;
    }
    if (allowableDisplayThreshold <= 0 || !allowableDisplayThreshold) {
      setError({
        ...error,
        allowableDisplayThreshold: "Số ngày trước hạn sử dụng phải lớn hơn 0",
      });
      return;
    }
    if (productName === "") {
      setError({ ...error, productName: "Vui lòng không để trống" });
      return;
    }
    if (price <= 0 || !price) {
      setError({ ...error, price: "Số tiền nhập vào phải lớn hớn 0" });
      return;
    }
    if (priceOriginal <= 0 || !priceOriginal) {
      setError({ ...error, priceOriginal: "Số tiền nhập vào phải lớn hớn 0" });
      return;
    }
    if (description === "") {
      setError({ ...error, description: "Vui lòng không để trống" });
      return;
    }
    if (error.expiredDate !== "") {
      return;
    }
    if (parseInt(allowableDate) < allowableDisplayThreshold) {
      setError({
        ...error,
        expiredDate: `Ngày hết hạn bạn nhập đã bé hơn giới hạn số ngày trước HSD`,
      });
      return;
    }
    if (quantity <= 0 || !quantity) {
      setError({ ...error, quantity: "Số lượng nhập vào phải lớn hớn 0" });
      return;
    }
    let imageUrlNew = await handleUploadImageToFirebase();
    if (imageUrlNew === "") {
      setError({ ...error, imageUrl: "Chưa có ảnh sản phẩm" });
      return;
    }

    // Edit Product
    const submitSupermarket = {
      id: supermarketId,
      name: supermarket,
      status: 1,
      phone: supermarketHotline,
      supermarketAddressList: supermarketAddress,
    };
    // -----------------------------------------------------------------
    // Category & Subcategory Data
    const submitProductSubCategory = {
      id: subCateId,
      name: subCateName,
      imageUrl: imageUrlSubCate,
      allowableDisplayThreshold: allowableDisplayThreshold,
      productCategory: {
        id: categoryId,
        name: category,
        totalDiscountUsage: 0,
      },
      totalDiscountUsage: 0,
    };
    // -----------------------------------------------------------------
    const productToEdit = {
      id: product.id,
      name: productName,
      price: price,
      priceOriginal: priceOriginal,
      description: description,
      expiredDate: expiredDate,
      quantity: quantity,
      status: 1,
      imageUrl: imageUrlNew ? imageUrlNew : imageUrl,
      productSubCategory: submitProductSubCategory,
      supermarket: submitSupermarket,
    };

    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/product/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(productToEdit),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        fetch(
          `${API.baseURL}/api/product/getProductsForStaff?page=${
            page - 1
          }&limit=5&name=${searchValue}`,
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
            handleClose();
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setMsg("Sửa sản phẩm thành công");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="modal__container">
      {/* modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chỉnh sửa sản phẩm</h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>
      {/* modal body */}
      <div
        className="modal__container-body"
        style={{ height: "65vh", overflowY: "scroll" }}
      >
        {/* Supermarket */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên siêu thị
          </h4>
          <div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div className="dropdown" style={{ width: "400px" }}>
                <div
                  className="dropdown-btn"
                  onClick={(e) => setIsActiveDropdown(!isActiveDropdown)}
                >
                  {selectedDropdownItem}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {isActiveDropdown && (
                  <div className="dropdown-content">
                    {supermarkets.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedDropdownItem(item.name);
                          setIsActiveDropdown(false);
                          setSupermarketId(item.id);
                          setSupermarket(item.name);
                          setError({ ...error, supermarket: "" });
                          setSupermarketAddress(item.supermarketAddressList);
                          setSuperMarketHotline(item.phone);
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
            {error.supermarket && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.supermarket}
              </p>
            )}
          </div>
        </div>

        {/* Categories */}
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
                          setSubCategories(item.productSubCategories);
                          setCategoryId(item.id);
                          setCategory(item.name);
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
        {/* Sub cate */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên loại sản phẩm phụ
          </h4>
          <div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div className="dropdown" style={{ width: "400px" }}>
                <div
                  className="dropdown-btn"
                  onClick={(e) => {
                    const isSelected = categories.some(
                      (item) => item.name === selectedDropdownItemCate
                    );
                    setCheckCategorySelected(isSelected);
                    if (isSelected === true) {
                      setIsActiveDropdownSubCate(!isActiveDropdownSubCate);
                    }
                  }}
                >
                  {selectedDropdownItemSubCate}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {isActiveDropdownSubCate && (
                  <div className="dropdown-content">
                    {subCategories.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedDropdownItemSubCate(item.name);
                          setIsActiveDropdownSubCate(false);
                          setSubCateId(item.id);
                          setSubCateName(item.name);
                          setError({ ...error, subCateName: "" });
                          setImageUrlSubCate(item.imageUrl);
                          setAllowableDisplayThreshold(
                            item.allowableDisplayThreshold
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
            </div>
            <span
              style={{
                color: "#37a65b",
                fontSize: "14px",
              }}
            >
              Hãy chọn loại sản phẩm trước nếu bạn muốn thay đổi
            </span>
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
        {/*  */}
        {/* ProductName */}
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
          <div>
            <input
              placeholder="Nhập Ngày hết hạn"
              type="date"
              className="modal__container-body-inputcontrol-input"
              value={expiredDate}
              onChange={(e) => {
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let currentDate = `${year}-${month}-${day}`;
                setExpiredDate(e.target.value);
                setAllowableDate(dayjs(e.target.value).$D - day);

                let allowableThresholdDate =
                  parseInt(allowableDisplayThreshold) + day;

                // Check day of month
                let dayOfMonth;

                if (currentDate > e.target.value) {
                  setError({
                    ...error,
                    expiredDate: "Ngày hết hạn không thể bé hơn ngày hiện tại",
                  });
                } else if (
                  dayjs(e.target.value).$D - day <
                  allowableDisplayThreshold
                ) {
                  setError({
                    ...error,
                    expiredDate: `Ngày hết hạn bạn nhập đã bé hơn giới hạn số ngày trước HSD. \n Số ngày tổi thiểu của ${subCateName} là ${allowableThresholdDate}/${month}/${year}`,
                  });
                } else {
                  setError({ ...error, expiredDate: "" });
                }
              }}
            />
            {error.expiredDate && (
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: "-10px",
                  maxWidth: "400px",
                }}
                className="text-danger"
              >
                {error.expiredDate}
              </p>
            )}
          </div>
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
          <div style={{ maxWidth: "400px" }}>
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
                  files[0] && setFileName(files[0].name);
                  if (files && files[0]) {
                    setImage(URL.createObjectURL(files[0]));
                    setImgToFirebase(files[0]);
                    console.log(files[0]);
                    setError({ ...error, imageUrl: "" });
                  }
                }}
              />
              {image ? (
                <img
                  src={image}
                  width={360}
                  height={160}
                  alt={fileName}
                  style={{ borderRadius: "5px", maxWidth: 360 }}
                />
              ) : (
                <>
                  <MdCloudUpload color="#37a65b" size={60} />
                  <p style={{ fontSize: "14px" }}>Tải ảnh sản phẩm</p>
                </>
              )}
            </div>
            <section className="uploaded-row">
              <AiFillFileImage color="#37a65b" size={25} />
              <span className="upload-content">
                {/* {fileName} - */}
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
            </section>
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
            className="modal__container-footer-buttons-close"
            onClick={handleClose}
          >
            Đóng
          </button>
          <button
            onClick={handleEdit}
            className="modal__container-footer-buttons-create"
          >
            Sửa
          </button>
        </div>
      </div>
      {/* *********************** */}
    </div>
  );
};

export default EditProduct;
