import React, { useEffect, useState } from "react";
import "./CreateProduct.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCaretDown,
  faPlusCircle,
  faCircleMinus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import dayjs from "dayjs";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { format } from "date-fns";
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import CreateProductImageSlider from "./CreateProductImageSlider";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditProduct = ({
  handleClose,
  product,
  productBatchAddressList,
  setProducts,
  setTotalPage,
  page,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
}) => {
  const [image, setImage] = useState(
    product.imageUrlImageList.map((item) => {
      return {
        ...item,
        error: {
          image: "",
        },
      };
    })
  );
  const [openImageUrlList, setOpenImageUrlList] = useState(false);
  const handleOpenImageUrlList = () => setOpenImageUrlList(true);
  const handleCloseImageUrlList = () => setOpenImageUrlList(false);
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

  const [openValidateSnackbar, setOpenValidateSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
    text: "",
  });
  const { vertical, horizontal } = openValidateSnackbar;
  const handleCloseValidateSnackbar = () => {
    setOpenValidateSnackbar({ ...openValidateSnackbar, open: false });
  };

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
  const [unit, setUnit] = useState(product.unit);
  // console.log("product batch", productBatch);

  const [productBatchAddresses, setProductBatchAddresses] = useState(
    productBatchAddressList.map((productBatchAddress) => {
      return {
        ...productBatchAddress,
        error: {
          quantity: "",
          supermarketStores: "",
        },
        isActiveDropdownSupermarketStore: false,
      };
    })
  );
  // console.log("productBatchAddresses", productBatchAddresses);
  const [productBatchs, setProductBatchs] = useState(
    product.productBatchList.map((item) => {
      return {
        ...item,
        expiredDate: item.expiredDate
          ? format(new Date(item.expiredDate), "yyyy-MM-dd")
          : null,
        error: {
          price: "",
          priceOriginal: "",
          expiredDate: "",
        },
      };
    })
  );

  const [loading, setLoading] = useState(false);

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

      fetch(`${API.baseURL}/api/product/getCategoryForStaff`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.productCategoryList);
        });
    };
    fetchData();
  }, []);

  const uploadProductImgToFirebase = async (image) => {
    const imgRef = ref(imageDB, `productImage/${v4()}`);
    await uploadBytes(imgRef, image);
    try {
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadProductImagesToFireBase = async (images) => {
    const imageList = Array.from(images, (image) =>
      uploadProductImgToFirebase(image)
    );
    const imageUrls = await Promise.all(imageList);
    return imageUrls;
  };

  const getDateAfterToday = (numberOfDays) => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + numberOfDays);
    return nextDate;
  };

  const dayDiffFromToday = (expDate) => {
    return Math.ceil((expDate - new Date()) / (1000 * 3600 * 24));
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
    if (description === "") {
      setError({ ...error, description: "Vui lòng không để trống" });
      return;
    }
    // validate product batch
    let newProductBatchs = [...productBatchs];
    const productbatchValidate = productBatchs.map((batch, index) => {
      // validate price
      if (batch.price === "") {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            price: "Giá sản phẩm không thể là bỏ trống",
          },
        };
        return false;
      }
      if (batch.price <= 0) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            price: "Giá sản phẩm không thể bé hơn 0",
          },
        };
        return false;
      }
      // validate priceOriginal
      if (batch.priceOriginal === "") {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            priceOriginal: "Giá gốc sản phẩm không thể là bỏ trống",
          },
        };
        return false;
      }
      if (batch.priceOriginal <= 0) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            priceOriginal: "Giá gốc sản phẩm không thể bé hơn 0",
          },
        };
        return false;
      }
      // validate expiredDate
      if (!batch.expiredDate) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            expiredDate: "Vui lòng nhập ngày hết hạn",
          },
        };
        return false;
      }
      if (
        new Date(batch.expiredDate).getTime() <
        getDateAfterToday(allowableDisplayThreshold).getTime()
      ) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            expiredDate:
              "Ngày hết hạn bạn nhập đã bé hơn giới hạn số ngày trước HSD",
          },
        };
        return false;
      }
      // validate quantity
      if (batch.quantity === "") {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            quantity: "Số lượng sản phẩm không thể là bỏ trống",
          },
        };
        return false;
      }
      if (batch.quantity <= 0) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            quantity: "Số lượng sản phẩm không thể bé hơn 0",
          },
        };
        return false;
      }
      // validate supermarketstore
      if (
        !batch.supermarketAddress?.id ||
        !batch.supermarketAddress ||
        !supermarketAddress.some(
          (item) => item.address === batch?.supermarketAddress?.address
        )
      ) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            supermarketStores: "Vui lòng chọn chi nhánh",
          },
        };
        return false;
      }

      return true;
    });
    if (productbatchValidate.some((item) => item === false)) {
      setProductBatchs(newProductBatchs);
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
    let imageUrlNew = await uploadProductImagesToFireBase(imgToFirebase);
    if (imageUrlNew.length === 0 && product.productImageList.length === 0) {
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
    // ProductBatchList
    const submitProductBatchList = newProductBatchs.map((item) => {
      return {
        id: item.id,
        price: item.price,
        priceOriginal: item.priceOriginal,
        sellingDate: null,
        expiredDate: item.expiredDate,
        quantity: item.quantity,
        supermarketAddress: item.supermarketAddress,
      };
    });
    // ProductImageList
    const productImageList = Object.entries(imageUrlNew).map(
      ([index, value]) => {
        return { id: null, imageUrl: value };
      }
    );

    // -----------------------------------------------------------------
    const productToEdit = {
      id: product.id,
      name: productName,
      description: description,
      unit: unit,
      status: 1,
      productSubCategory: submitProductSubCategory,
      supermarket: submitSupermarket,
      productBatchList: submitProductBatchList,
      productImageList:
        productImageList.length !== 0
          ? productImageList
          : product.productImageList,
    };
    // console.log(JSON.stringify(productToEdit));

    const tokenId = await auth.currentUser.getIdToken();
    setLoading(true);
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
            setLoading(false);
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setMsg("Sửa sản phẩm thành công");
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <>
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
          {/* unit name */}
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Đơn vị bán
            </h4>
            <div>
              <input
                value={unit}
                placeholder="Nhập tên sản phẩm"
                type="text"
                className="modal__container-body-inputcontrol-input"
                onChange={(e) => {
                  setUnit(e.target.value);
                  setError({ ...error, unit: "" });
                }}
              />
              {error.unit && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.unit}
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
          {productBatchs.map((item, index) => (
            <>
              <div
                style={{ textAlign: "center" }}
                className="buttonSwitchSelectSuperMarket"
                onClick={(e) => {}}
              >
                Lô hàng {index + 1}
              </div>
              {/* Price */}
              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Giá tiền
                </h4>
                <div>
                  <input
                    value={item?.price}
                    min={0}
                    placeholder="Nhập số giá tiền"
                    type="number"
                    className="modal__container-body-inputcontrol-input"
                    onChange={(e) => {
                      const newProductBatchs = [...productBatchs];
                      newProductBatchs[index] = {
                        ...productBatchs[index],
                        price: e.target.value,
                        error: { ...productBatchs[index].error, price: "" },
                      };
                      setProductBatchs(newProductBatchs);
                    }}
                  />
                  {item.error.price && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.error.price}
                    </p>
                  )}
                </div>
              </div>
              {/* PriceOriginal */}
              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Giá gốc
                </h4>

                <div>
                  <input
                    value={item?.priceOriginal}
                    min={0}
                    placeholder="Nhập giá gốc"
                    type="number"
                    className="modal__container-body-inputcontrol-input"
                    onChange={(e) => {
                      const newProductBatchs = [...productBatchs];
                      newProductBatchs[index] = {
                        ...productBatchs[index],
                        priceOriginal: e.target.value,
                        error: {
                          ...productBatchs[index].error,
                          priceOriginal: "",
                        },
                      };
                      setProductBatchs(newProductBatchs);
                    }}
                  />
                  {item.error.priceOriginal && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.error.priceOriginal}
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
                    value={item?.expiredDate}
                    onChange={(e) => {
                      const newProductBatchs = [...productBatchs];
                      newProductBatchs[index] = {
                        ...productBatchs[index],
                        expiredDate: e.target.value,
                        error: {
                          ...productBatchs[index].error,
                          expiredDate: "",
                        },
                      };
                      const date = new Date();
                      let day = date.getDate();
                      let month = date.getMonth() + 1;
                      let year = date.getFullYear();
                      let currentDate = `${year}-${month}-${day}`;
                      let allowableThresholdDate = dayjs(
                        getDateAfterToday(allowableDisplayThreshold)
                      ).format("DD/MM/YYYY");
                      const daysFromToday = dayDiffFromToday(
                        dayjs(e.target.value).$d
                      );
                      if (daysFromToday < allowableDisplayThreshold) {
                        setError({
                          ...error,
                          expiredDate: `Ngày hết hạn bạn nhập đã bé hơn giới hạn số ngày trước HSD. \n Số ngày tổi thiểu của ${subCateName} là ${allowableThresholdDate}`,
                        });
                      } else {
                        console.log("eles");
                        setError({ ...error, expiredDate: "" });
                      }
                      setProductBatchs(newProductBatchs);
                    }}
                  />
                  {item.error.expiredDate && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.error.expiredDate}
                    </p>
                  )}
                  {error.expiredDate && (
                    <p
                      style={{
                        fontSize: "14px",
                        marginBottom: "-10px",
                        maxWidth: "400px",
                        marginTop: 5,
                      }}
                      className="text-danger"
                    >
                      {error.expiredDate}
                    </p>
                  )}
                </div>
              </div>
              {productBatchAddresses.map((data, index) => {
                console.log(index, data);
                return (
                  <>
                    {/* Store */}
                    <div className="modal__container-body-inputcontrol">
                      {productBatchAddresses.length !== 1 && (
                        <div
                          onClick={() => {
                            setProductBatchAddresses(
                              productBatchAddresses.filter(
                                (address) => address !== data
                              )
                            );
                          }}
                          className="button__minus"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </div>
                      )}
                      <h4 className="modal__container-body-inputcontrol-label">
                        Chi nhánh {index + 1}
                      </h4>
                      <div>
                        <div style={{ display: "flex" }}>
                          <div
                            style={{ width: "350px", marginRight: "-2px" }}
                            className="dropdown"
                          >
                            <div
                              className="dropdown-btn"
                              onClick={(e) => {
                                if (selectedDropdownItem !== "Chọn siêu thị") {
                                  const newProductBatchAddresses = [
                                    ...productBatchAddresses,
                                  ];
                                  newProductBatchAddresses[index] = {
                                    ...productBatchAddresses[index],
                                    isActiveDropdownSupermarketStore:
                                      !productBatchAddresses[index]
                                        .isActiveDropdownSupermarketStore,
                                  };
                                  setProductBatchAddresses(
                                    newProductBatchAddresses
                                  );
                                }
                              }}
                            >
                              {data[index]?.supermarketAddress?.address
                                ? data[index]?.supermarketAddress?.address
                                : "Chọn chi nhánh"}
                              <FontAwesomeIcon icon={faCaretDown} />
                            </div>
                            {selectedDropdownItem === "Chọn siêu thị" && (
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "14px",
                                }}
                                className="text-danger"
                              >
                                Hãy chọn siêu thị trước
                              </span>
                            )}

                            {data.isActiveDropdownSupermarketStore && (
                              <div className="dropdown-content">
                                {supermarketAddress.map((item, i) => (
                                  <div
                                    onClick={(e) => {
                                      const newProductBatchAddresses = [
                                        ...productBatchAddresses,
                                      ];
                                      newProductBatchAddresses[index] = {
                                        ...productBatchAddresses[index],
                                        isActiveDropdownSupermarketStore: false,
                                        supermarketAddressId: item.id,
                                        supermarketAddress: item,
                                        error: {
                                          ...productBatchAddresses[index].error,
                                          supermarketStores: "",
                                        },
                                      };
                                      setProductBatchAddresses(
                                        newProductBatchAddresses
                                      );
                                    }}
                                    className="dropdown-item"
                                    key={i}
                                  >
                                    {item.address}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <FontAwesomeIcon
                            className="iconCreateStoresAddress"
                            icon={faPlusCircle}
                            size="4x"
                            style={{ paddingLeft: 10, paddingTop: 5 }}
                            onClick={() => {
                              if (
                                supermarketAddress.length ===
                                productBatchAddresses.length
                              ) {
                                setOpenValidateSnackbar({
                                  ...openValidateSnackbar,
                                  open: true,
                                  severity: "error",
                                  text: `Siêu thị này chỉ có ${supermarketAddress.length} chi nhánh! Không thể tạo thêm`,
                                });
                                return;
                              }
                              if (selectedDropdownItem === "Chọn siêu thị") {
                                setOpenValidateSnackbar({
                                  ...openValidateSnackbar,
                                  open: true,
                                  severity: "error",
                                  text: `Chọn siêu thị trước`,
                                });
                                return;
                              }
                              const newProductBatchAddresses = [
                                ...productBatchAddresses,
                                {
                                  quantity: 0,
                                  supermarketAddress: null,
                                  error: {
                                    expiredDate: "",
                                    supermarketStores: "",
                                  },
                                  isActiveDropdownSupermarketStore: false,
                                },
                              ];
                              setProductBatchAddresses(
                                newProductBatchAddresses
                              );
                            }}
                          />
                        </div>
                        {data.error.supermarketStores && (
                          <p
                            style={{ fontSize: "14px", marginBottom: "-10px" }}
                            className="text-danger"
                          >
                            {data.error.supermarketStores}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="modal__container-body-inputcontrol">
                      <h4 className="modal__container-body-inputcontrol-label">
                        Số lượng
                      </h4>
                      <div>
                        <input
                          min={0}
                          placeholder="Nhập số lượng"
                          type="number"
                          className="modal__container-body-inputcontrol-input"
                          value={data[index]?.quantity}
                          onChange={(e) => {
                            const newProductBatchAddresses = [
                              ...productBatchAddresses,
                            ];
                            newProductBatchAddresses[index] = {
                              ...productBatchAddresses[index],
                              quantity: e.target.value,
                              error: {
                                ...productBatchAddresses[index].error,
                                quantity: "",
                              },
                            };
                            setProductBatchAddresses(newProductBatchAddresses);
                          }}
                        />
                        {data.error.quantity && (
                          <p
                            style={{ fontSize: "14px", marginBottom: "-10px" }}
                            className="text-danger"
                          >
                            {data.error.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}

              {productBatchs.length !== 1 && (
                <div className="modal__container-body-inputcontrol">
                  <button
                    onClick={() => {
                      setProductBatchs(
                        productBatchs.filter((item, i) => i !== index)
                      );
                    }}
                    className="buttonAddSupermarkerAddress"
                  >
                    Xóa lô hàng
                    <FontAwesomeIcon
                      icon={faCircleMinus}
                      style={{ paddingLeft: 10 }}
                    />
                  </button>
                </div>
              )}

              {/* Quantity */}
              {/* <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Số lượng
                </h4>
                <div>
                  <input
                    min={0}
                    placeholder="Nhập số lượng"
                    type="number"
                    className="modal__container-body-inputcontrol-input"
                    value={item?.quantity}
                    onChange={(e) => {
                      const newProductBatchs = [...productBatchs];
                      newProductBatchs[index] = {
                        ...productBatchs[index],
                        quantity: e.target.value,
                        error: { ...productBatchs[index].error, quantity: "" },
                      };
                      setProductBatchs(newProductBatchs);
                    }}
                  />
                  {item.error.quantity && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.error.quantity}
                    </p>
                  )}
                </div>
              </div> */}
              {/* Store */}
              {/* <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Chi nhánh
                </h4>
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{ width: "401px", marginRight: "-2px" }}
                      className="dropdown"
                    >
                      <div
                        className="dropdown-btn"
                        onClick={(e) => {
                          if (selectedDropdownItem) {
                            const newProductBatchs = [...productBatchs];
                            newProductBatchs[index] = {
                              ...productBatchs[index],
                              isActiveDropdownSupermarketStore:
                                !productBatchs[index]
                                  .isActiveDropdownSupermarketStore,
                            };
                            setProductBatchs(newProductBatchs);
                          }
                        }}
                      >
                        {item?.supermarketAddress?.id && selectedDropdownItem
                          ? item?.supermarketAddress?.address
                          : "Chọn chi nhánh"}
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      {!selectedDropdownItem && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "14px",
                          }}
                          className="text-danger"
                        >
                          Hãy chọn siêu thị trước
                        </span>
                      )}

                      {item.isActiveDropdownSupermarketStore && (
                        <div className="dropdown-content">
                          {supermarketAddress.map((item, i) => (
                            <div
                              onClick={(e) => {
                                const newProductBatchs = [...productBatchs];
                                newProductBatchs[index] = {
                                  ...productBatchs[index],
                                  isActiveDropdownSupermarketStore: false,
                                  supermarketAddress: item,
                                  error: {
                                    ...productBatchs[index].error,
                                    supermarketStores: "",
                                  },
                                };
                                setProductBatchs(newProductBatchs);
                              }}
                              className="dropdown-item"
                              key={i}
                            >
                              {item.address}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.error.supermarketStores && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.error.supermarketStores}
                    </p>
                  )}
                </div>
              </div>
              <div className="modal__container-body-inputcontrol">
                <button
                  onClick={() => {
                    setProductBatchs(
                      productBatchs.filter((item, i) => i !== index)
                    );
                  }}
                  className="buttonAddSupermarkerAddress"
                >
                  Xóa lô hàng
                  <FontAwesomeIcon
                    icon={faCircleMinus}
                    style={{ paddingLeft: 10 }}
                  />
                </button>
              </div> */}
            </>
          ))}

          {/* Button add Batch */}
          <div className="modal__container-body-inputcontrol">
            <button
              style={{ width: "100%" }}
              onClick={() => {
                const newProductBatchs = [
                  ...productBatchs,
                  {
                    id: null,
                    expiredDate: null,
                    price: 0,
                    priceOriginal: 0,
                    productBatchAddresses: [
                      {
                        quantity: 0,
                        supermarketAddressId: null,
                        supermarketAddress: null,
                        error: {
                          quantity: "",
                          supermarketStores: "",
                        },
                        isActiveDropdownSupermarketStore: false,
                      },
                    ],
                    error: {
                      price: "",
                      priceOriginal: "",
                      expiredDate: "",
                    },
                  },
                ];

                setProductBatchs(newProductBatchs);
              }}
              className="buttonAddSupermarkerAddress"
            >
              Thêm lô hàng mới
              <FontAwesomeIcon
                icon={faPlusCircle}
                style={{ paddingLeft: 10 }}
              />
            </button>
          </div>

          {/* Image Upload */}
          <div
            className="modal__container-body-inputcontrol"
            style={{
              position: "relative",
            }}
          >
            <div className="modal__container-body-inputcontrol-label-icon">
              <h4 className="modal__container-body-inputcontrol-label">
                Tải ảnh
              </h4>
            </div>

            <div style={{ maxWidth: "400px" }}>
              <div
                className="imgWrapper"
                onClick={() => document.querySelector("#imgUpload").click()}
              >
                <input
                  id="imgUpload"
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={({ target: { files } }) => {
                    if (files) {
                      const fileArray = Object.entries(files).map(
                        ([key, value]) => {
                          return { index: key, value: value };
                        }
                      );
                      let imageUrlListToShow = [];
                      let imageUrlListToFireBase = [];
                      fileArray.map((item) => {
                        imageUrlListToShow.push(
                          URL.createObjectURL(item.value)
                        );
                        imageUrlListToFireBase.push(item.value);
                      });
                      setImage(imageUrlListToShow);
                      setImgToFirebase(
                        imageUrlListToFireBase
                          ? imageUrlListToFireBase
                          : files[0]
                      );
                      setError({ ...error, imageUrl: "" });
                    }
                  }}
                />
                {image.length !== 0 ? (
                  <img
                    src={image[0].imageUrl ? image[0].imageUrl : image[0]}
                    width={360}
                    height={160}
                    style={{ borderRadius: "5px", maxWidth: 360 }}
                  />
                ) : (
                  <>
                    <MdCloudUpload color="#37a65b" size={60} />
                    <p style={{ fontSize: "14px" }}>Tải ảnh sản phẩm</p>
                  </>
                )}
              </div>
              {image.length > 1 && (
                <section
                  className="uploaded-row"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    {
                      handleOpenImageUrlList();
                    }
                  }}
                >
                  <h4>Xem tất cả hình đã tải lên</h4>
                </section>
              )}
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
      <Dialog
        onClose={handleCloseImageUrlList}
        aria-labelledby="customized-dialog-title"
        open={openImageUrlList}
      >
        <CreateProductImageSlider
          handleClose={handleCloseImageUrlList}
          imageUrlList={image}
        />
      </Dialog>
      {loading && <LoadingScreen />}
    </>
  );
};

export default EditProduct;
