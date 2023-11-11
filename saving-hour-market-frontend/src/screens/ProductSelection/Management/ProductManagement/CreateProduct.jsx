import React, { useEffect, useRef, useState } from "react";
import "./CreateProduct.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCaretDown,
  faRepeat,
  faPlusCircle,
  faMinus,
  faX,
  faPlus,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import dayjs from "dayjs";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { Slide } from "react-slideshow-image";
import CreateProductImageSlider from "./CreateProductImageSlider";
import { Dialog, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CreateProduct = ({
  handleClose,
  setProducts,
  setTotalPage,
  page,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
}) => {
  const [image, setImage] = useState([]);
  const [imgToFirebase, setImgToFirebase] = useState([]);

  const [openImageUrlList, setOpenImageUrlList] = useState(false);
  const handleOpenImageUrlList = () => setOpenImageUrlList(true);
  const handleCloseImageUrlList = () => setOpenImageUrlList(false);

  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );
  const [imgSubCateToFirebase, setImgSubCateToFirebase] = useState("");

  const [supermarkets, setSupermarkets] = useState([]);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [selectedDropdownItem, setSelectedDropdownItem] =
    useState("Chọn siêu thị");

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

  const [allowableDate, setAllowableDate] = useState("");

  const [addressList, setAddressList] = useState([
    {
      isFocused: false,
      selectAddress: "",
      searchAddress: "",
      isCreateNew: true,
    },
  ]);

  const typingTimeoutRef = useRef(null);

  // validate data
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [priceOriginal, setPriceOriginal] = useState(0);
  const [description, setDescription] = useState("");
  const [expiredDate, setExpiredDate] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [supermarketId, setSupermarketId] = useState("");
  const [supermarket, setSupermarket] = useState("");
  const [supermarketHotline, setSuperMarketHotline] = useState("");
  const [supermarketAddress, setSupermarketAddress] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState("");
  const [subCategoryId, setSubcategoryId] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(0);
  const [imageUrlSubCate, setImageUrlSubCate] = useState("");

  const [unit, setUnit] = useState("");
  const [productBatchAddresses, setProductBatchAddresses] = useState([
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
  ]);

  const [productBatchs, setProductBatchs] = useState([
    {
      price: 0,
      priceOriginal: 0,
      expiredDate: null,
      productBatchAddresses: productBatchAddresses,
      error: {
        price: "",
        priceOriginal: "",
        expiredDate: "",
      },
    },
  ]);

  const [loading, setLoading] = useState(false);

  // check error
  const [checkCategorySelected, setCheckCategorySelected] = useState(false);
  const [checkSupermarketSelected, setCheckSupermarketSelected] =
    useState(false);
  const [error, setError] = useState({
    productName: "",
    unit: "",
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
        })
        .catch((err) => {
          console.log(err);
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

  const getDateAfterToday = (numberOfDays) => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + numberOfDays);
    return nextDate;
  };

  const dayDiffFromToday = (expDate) => {
    return Math.ceil((expDate - new Date()) / (1000 * 3600 * 24));
  };

  const handleSubmit = async () => {
    if (supermarket === "") {
      setError({ ...error, supermarket: "Vui lòng không chọn siêu thị" });
      return;
    }

    if (supermarketHotline === "") {
      setError({
        ...error,
        supermarketHotline: "Vui lòng không để trống số điện thoại",
      });
      return;
    }

    if (
      !/^[(]{0,1}[0-9]{3}[)]{0,1}[-s.]{0,1}[0-9]{3}[-s.]{0,1}[0-9]{4}$/.test(
        supermarketHotline
      )
    ) {
      setError({ ...error, supermarketHotline: "Số điện thoại không hợp lệ" });
      return;
    }
    const addressListValidate = addressList.some(
      (item) => !item.selectAddress && item.isCreateNew === true
    );
    if (addressListValidate) {
      setError({ ...error, supermarketAddress: "Địa chỉ không hợp lệ" });
      return;
    }

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
            price: "Giá sản phẩm không thể bỏ trống",
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
            priceOriginal: "Giá sản phẩm không thể bỏ trống",
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
      return true;
    });
    if (productbatchValidate.some((item) => item === false)) {
      setProductBatchs(newProductBatchs);
      return;
    }

    // validate product batch address
    let newProductBatchAddress = [...productBatchAddresses];
    const productBatchAddressesValidate = productBatchAddresses.map(
      (batch, index) => {
        // validate supermarketstore
        if (
          !batch.supermarketAddress ||
          !supermarketAddress.some(
            (item) => item.address === batch?.supermarketAddress?.address
          )
        ) {
          newProductBatchAddress[index] = {
            ...productBatchs[index],
            error: {
              ...productBatchs[index].error,
              supermarketStores: "Vui lòng chọn chi nhánh",
            },
          };
          return false;
        }
        // validate quantity
        if (batch.quantity === "") {
          newProductBatchAddress[index] = {
            ...productBatchs[index],
            error: {
              ...productBatchs[index].error,
              quantity: "Số lượng sản phẩm không thể bỏ trống",
            },
          };
          return false;
        }
        if (batch.quantity <= 0) {
          newProductBatchAddress[index] = {
            ...productBatchs[index],
            error: {
              ...productBatchs[index].error,
              quantity: "Số lượng sản phẩm không thể bé hơn 0",
            },
          };
          return false;
        }

        return true;
      }
    );
    if (productBatchAddressesValidate.some((item) => item === false)) {
      setProductBatchAddresses(newProductBatchAddress);
      return;
    }

    // const uniqueValues = new Set(
    //   productBatchs.map((v) => v?.supermarketAddress?.address)
    // );

    // if (uniqueValues.size < productBatchs.length) {
    //   setOpenValidateSnackbar({
    //     ...openValidateSnackbar,
    //     open: true,
    //     severity: "error",
    //     text: "Tồn tại lô hàng trùng chi nhánh siêu thị",
    //   });
    //   return;
    // }

    let newImageUrlSubCate = await uploadSubCateImgToFireBase();
    if (newImageUrlSubCate === null) {
      setError({ ...error, imageUrlSubCate: "Chưa có ảnh sản phẩm" });
      return;
    }

    let imageUrls = await uploadProductImagesToFireBase(imgToFirebase);
    if (imageUrls.length === 0) {
      setError({ ...error, imageUrl: "Chưa có ảnh sản phẩm" });
      return;
    }

    // Create Product
    let listAddress = addressList.map((item) => item.selectAddress);
    listAddress = listAddress.map((item) => ({
      id: "",
      address: item,
    }));

    let listSupermarketAddress = supermarketAddress.map((item) => item.address);
    listSupermarketAddress = listSupermarketAddress.map((item) => ({
      id: "",
      address: item,
    }));
    const submitSupermarket = {
      id: supermarketId ? supermarketId : "",
      name: supermarket,
      status: 1,
      phone: supermarketHotline,
      supermarketAddressList:
        listSupermarketAddress.length !== 0
          ? listSupermarketAddress
          : listAddress,
    };
    // -----------------------------------------------------------------
    // Category & Subcategory Data
    const submitProductSubCategory = {
      id: subCategoryId ? subCategoryId : "",
      name: subCateName,
      imageUrl: newImageUrlSubCate ? newImageUrlSubCate : imageUrlSubCate,
      allowableDisplayThreshold: allowableDisplayThreshold,
      productCategory: {
        id: categoryId ? categoryId : "",
        name: category,
        totalDiscountUsage: 0,
      },
      totalDiscountUsage: 0,
    };
    // -----------------------------------------------------------------
    // ProductBatchAddresses
    const submitProductBatchListAddress = productBatchAddresses.map((item) => {
      return {
        quantity: item.quantity,
        supermarketAddressId: item.supermarketAddressId,
      };
    });

    // -----------------------------------------------------------------
    // ProductBatchList
    const submitProductBatchList = newProductBatchs.map((item) => {
      return {
        price: item.price,
        priceOriginal: item.priceOriginal,
        expiredDate: item.expiredDate,
        productBatchAddresses: submitProductBatchListAddress,
      };
    });
    // -----------------------------------------------------------------
    const productToCreate = {
      name: productName,
      description: description,
      unit: unit,
      imageUrls: imageUrls,
      supermarketId: supermarketId,
      productBatchList: submitProductBatchList,
      productSubCategory: submitProductSubCategory,
    };
    const tokenId = await auth.currentUser.getIdToken();
    setLoading(true);
    fetch(`${API.baseURL}/api/product/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(productToCreate),
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
            setMsg("Thêm sản phẩm thành công");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <div
        className="modal__container"
        style={{
          width: "650px",
        }}
      >
        <div className="modal__container-header">
          <h3 className="modal__container-header-title">Thêm sản phẩm mới</h3>
          <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
        </div>
        {/* ****************** */}

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
                <div
                  className="dropdown"
                  style={{
                    width: "400px",
                  }}
                >
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
                            const tempArrAddressList = addressList.map(
                              (data) => {
                                return { ...data, isCreateNew: false };
                              }
                            );
                            setAddressList(tempArrAddressList);
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
          {isCreateNewCate === false && (
            <>
              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Tên loại sản phẩm
                </h4>
                <div>
                  <div style={{ display: "flex" }}>
                    <div className="dropdown">
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
                                setSubCategories(item.productSubCategories);
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
                    <button
                      style={{
                        width: "120px",
                      }}
                      className="buttonSwitchSelectSuperMarket"
                      onClick={(e) => {
                        setIsCreateNewCate(true);
                        setCategory("");
                        setSubCateName("");
                        setAllowableDisplayThreshold(0);
                        setImageUrlSubCate("");
                        setImageSubCate(null);
                        setFileNameSubCate(
                          "Chưa có hình ảnh loại sản phẩm phụ"
                        );
                      }}
                    >
                      Thêm mới
                      <FontAwesomeIcon
                        icon={faRepeat}
                        style={{ paddingLeft: 10 }}
                      />
                    </button>
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
              {isCreateNewSubCate === false && (
                <>
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
                        <div className="dropdown">
                          <div
                            className="dropdown-btn"
                            onClick={(e) => {
                              const isSelected = categories.some(
                                (item) => item.name === selectedDropdownItemCate
                              );
                              setCheckCategorySelected(isSelected);
                              if (isSelected === true) {
                                setIsActiveDropdownSubCate(
                                  !isActiveDropdownSubCate
                                );
                              }
                            }}
                          >
                            {selectedDropdownItemSubCate}
                            <FontAwesomeIcon icon={faCaretDown} />
                          </div>
                          {!checkCategorySelected && (
                            <span
                              style={{
                                color: "red",
                                fontSize: "14px",
                              }}
                              className="text-danger"
                            >
                              Hãy chọn loại sản phẩm trước
                            </span>
                          )}
                          {isActiveDropdownSubCate && (
                            <div className="dropdown-content">
                              {subCategories.map((item, index) => (
                                <div
                                  onClick={(e) => {
                                    setSelectedDropdownItemSubCate(item.name);
                                    setIsActiveDropdownSubCate(false);
                                    setSubcategoryId(item.id);
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
                        <button
                          style={{ width: "120px" }}
                          className="buttonSwitchSelectSuperMarket"
                          onClick={(e) => {
                            setIsCreateNewSubCate(true);
                            setImageSubCate(null);
                            setFileNameSubCate(
                              "Chưa có hình ảnh loại sản phẩm phụ"
                            );
                            setSubcategoryId(null);
                            setSubCateName("");
                            setError({ ...error, subCateName: "" });
                            setImageUrlSubCate("");
                            setAllowableDisplayThreshold(0);
                          }}
                        >
                          Thêm mới
                          <FontAwesomeIcon
                            icon={faRepeat}
                            style={{ paddingLeft: 10 }}
                          />
                        </button>
                      </div>
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
                </>
              )}
              {/* Create SubCategories */}
              {isCreateNewSubCate && (
                <>
                  <button
                    className="buttonSwitchSelectSuperMarket"
                    onClick={(e) => {
                      setIsCreateNewSubCate(false);
                      setSubCateName("");
                      setAllowableDisplayThreshold(0);
                      setImageUrlSubCate("");
                      setSelectedDropdownItemSubCate("Chọn loại sản phẩm phụ");
                      setImageSubCate(null);
                    }}
                  >
                    Thêm loại sản phẩm phụ có sẵn
                    <FontAwesomeIcon
                      icon={faRepeat}
                      style={{ paddingLeft: 10 }}
                    />
                  </button>
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
                          if (category === "") {
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
                </>
              )}
            </>
          )}
          {/* Create Categories */}
          {isCreateNewCate && (
            <>
              <button
                className="buttonSwitchSelectSuperMarket"
                onClick={(e) => {
                  setIsCreateNewCate(false);
                  setCategory("");
                  setSubCateName("");
                  setAllowableDisplayThreshold(0);
                  setImageUrlSubCate("");
                  setSelectedDropdownItemCate("Chọn loại sản phẩm");
                  setSelectedDropdownItemSubCate("Chọn loại sản phẩm phụ");
                  setImageSubCate(null);
                }}
              >
                Thêm loại sản phẩm có sẵn
                <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
              </button>
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
              {/* Create Sub categories */}
              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Tên loại sản phẩm phụ
                </h4>
                <div>
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
                  {error.imageUrlSubCate && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {error.imageUrlSubCate}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

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
          {/* unit */}
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
          {/* Product Batch */}
          {productBatchs.map((item, index) => (
            <>
              <div
                style={{ textAlign: "center" }}
                className="buttonSwitchSelectSuperMarket"
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
                              {data?.supermarketAddress?.address
                                ? data?.supermarketAddress?.address
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
                          value={item?.quantity}
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
                    expiredDate: null,
                    price: 0,
                    priceOriginal: 0,
                    productBatchAddresses: productBatchAddresses,
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
                    src={image[0]}
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
        {/* ********************** */}

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
              onClick={handleSubmit}
              className="modal__container-footer-buttons-create"
            >
              Tạo mới
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
      <Snackbar
        open={openValidateSnackbar.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseValidateSnackbar}
      >
        <Alert
          onClose={handleCloseValidateSnackbar}
          severity={openValidateSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openValidateSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </>
  );
};

export default CreateProduct;
