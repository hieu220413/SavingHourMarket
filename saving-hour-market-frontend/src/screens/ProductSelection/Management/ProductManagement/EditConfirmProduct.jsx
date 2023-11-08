import {
  faCaretDown,
  faCircleMinus,
  faPlusCircle,
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
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import ProductDuplicated from "./ProductDuplicated";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
    useState(product?.supermarket.id ? product?.supermarket : null);
  const [categories, setCategories] = useState([]);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] = useState(
    product?.productSubCategory?.productCategory
  );
  const [subCategories, setSubCategories] = useState([]);
  const [isActiveDropdownSubCate, setIsActiveDropdownSubCate] = useState(false);
  const [selectedDropdownItemSubCate, setSelectedDropdownItemSubCate] =
    useState(
      product?.productSubCategory.id ? product?.productSubCategory : null
    );

  const [openProductDuplicated, setOpenProductDuplicated] = useState(false);
  const handleOpenProductDuplicated = () => setOpenProductDuplicated(true);
  const handleCloseProductDuplicated = () => setOpenProductDuplicated(false);
  const [productDuplicated, setProductDuplicated] = useState(null);

  const [productName, setProductName] = useState(product?.name);
  const [unit, setUnit] = useState(product?.unit);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState("");
  const [imageToFireBase, setImageToFireBase] = useState("");
  const [supermarketStores, setSupermarketStores] = useState([]);
  const [productBatchs, setProductBatchs] = useState(
    product.productBatchList.map((item) => {
      return {
        ...item,
        isActiveDropdownSupermarketStore: false,
        expiredDate: item.expiredDate
          ? format(new Date(item.expiredDate), "yyyy-MM-dd")
          : null,
        error: {
          price: "",
          priceOriginal: "",
          quantity: "",
          expiredDate: "",
          supermarketStores: "",
        },
      };
    })
  );

  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(
    selectedDropdownItemSubCate.allowableDisplayThreshold
  );
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

  const [error, setError] = useState({
    productName: "",
    description: "",
    imageUrl: "",
    supermarket: "",
    category: "",
    subCateName: "",
    allowableDisplayThreshold: "",
    imageUrlSubCate: "",
    unit: "",
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
          const currentSupermarket = data?.supermarketList.find(
            (item) => item.name === selectedSupermarketDropdownItem?.name
          );
          setSupermarketStores(currentSupermarket?.supermarketAddressList);
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

          const currentCate = data.productCategoryList.find(
            (item) => item.name === selectedDropdownItemCate?.name
          );
          setSubCategories(currentCate?.productSubCategories);
        });
    };
    fetchData();
  }, []);

  const getDateAfterToday = (numberOfDays) => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + numberOfDays);
    return nextDate;
  };

  const onConfirm = async () => {
    if (productName === "") {
      setError({ ...error, productName: "Vui lòng không để trống" });
      return;
    }

    if (!unit) {
      setError({ ...error, unit: "Vui lòng không để trống" });
      return;
    }

    if (!selectedSupermarketDropdownItem) {
      setError({ ...error, supermarket: "Vui lòng chọn siêu thị" });
      return;
    }

    if (!selectedDropdownItemCate) {
      setError({ ...error, category: "Vui lòng chọn loại sản phẩm" });
      return;
    }

    if (!selectedDropdownItemSubCate) {
      setError({ ...error, subCateName: "Vui lòng chọn loại sản phẩm phụ" });
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
      if (batch.price === 0) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            price: "Giá sản phẩm không thể là 0",
          },
        };
        return false;
      }
      // validate priceOriginal
      if (batch.priceOriginal === 0) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            priceOriginal: "Giá gốc sản phẩm không thể là 0",
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
      if (batch.quantity === 0) {
        newProductBatchs[index] = {
          ...productBatchs[index],
          error: {
            ...productBatchs[index].error,
            quantity: "Số lượng sản phẩm không thể là 0",
          },
        };
        return false;
      }
      // validate supermarketstore
      if (
        !batch.supermarketAddress?.id ||
        !supermarketStores.some(
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
      return;
    }

    setProductBatchs(newProductBatchs);
    const uniqueValues = new Set(
      productBatchs.map((v) => v?.supermarketAddress?.address)
    );

    if (uniqueValues.size < productBatchs.length) {
      setOpenValidateSnackbar({
        ...openValidateSnackbar,
        open: true,
        severity: "error",
        text: "Tồn tại lô hàng trùng chi nhánh siêu thị",
      });
      return;
    }
    //  **************************
    let isProductDuplicated = confirmProductList.productList.find(
      (item, index) => {
        if (
          item.name === productName &&
          item.productSubCategory.id === selectedDropdownItemSubCate.id &&
          item.unit === unit &&
          item.supermarket.id === selectedSupermarketDropdownItem.id
        ) {
          return Object.assign(item, { index: index });
        }
        return null;
      }
    );
    if (isProductDuplicated) {
      setProductDuplicated(isProductDuplicated);
      handleOpenProductDuplicated();

      return;
    }

    let submitUpdate = {};
    if (!imageToFireBase) {
      submitUpdate = {
        id: null,
        name: productName,
        description: description,
        unit: unit,
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
        productBatchList: productBatchs,
        productImageList: null,
      };
    }
    console.log(submitUpdate);
    // if (imageToFireBase) {
    //   const imgRef = ref(imageDB, `productImage/${v4()}`);
    //   await uploadBytes(imgRef, imageToFireBase);
    //   try {
    //     const url = await getDownloadURL(imgRef);
    //     submitUpdate = {
    //       id: null,
    //       name: productName,
    //       price: parseInt(price),
    //       priceOriginal: priceOriginal,
    //       description: description,
    //       expiredDate: format(new Date(expiredDate), "yyyy-MM-dd"),
    //       quantity: quantity,
    //       status: 1,
    //       imageUrl: url,
    //       productSubCategory: {
    //         ...selectedDropdownItemSubCate,
    //         productCategory: {
    //           id: selectedDropdownItemCate.id,
    //           name: selectedDropdownItemCate.name,
    //         },
    //       },
    //       supermarket: selectedSupermarketDropdownItem,
    //     };
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    const newProductList = confirmProductList.productList.map((item, i) => {
      if (index === i) {
        return submitUpdate;
      }
      return item;
    });

    const newErrorList = { ...confirmProductList.errorFields };
    delete newErrorList[index + 1];

    setOpenSnackbar({ ...openSnackbar, open: true, severity: "success" });
    setConfirmProductList({
      productList: newProductList,
      errorFields: newErrorList,
    });
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
          <div>
            <div style={{ display: "flex" }}>
              <div className="dropdown">
                <div
                  className="dropdown-btn"
                  onClick={(e) => setIsActiveDropdown(!isActiveDropdown)}
                >
                  {selectedSupermarketDropdownItem?.name
                    ? selectedSupermarketDropdownItem?.name
                    : "Chọn siêu thị"}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {isActiveDropdown && (
                  <div className="dropdown-content">
                    {supermarkets.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedSupermarketDropdownItem(item);
                          setIsActiveDropdown(false);
                          setSupermarketStores(item.supermarketAddressList);
                          setError({ ...error, supermarket: "" });
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
        {/* * * */}

        {/* Category */}
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
                  {selectedDropdownItemCate?.name
                    ? selectedDropdownItemCate?.name
                    : "Chọn loại sản phẩm"}
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
        {/* * * */}

        {/* Subcategory */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên loại sản phẩm phụ
          </h4>
          <div>
            <div style={{ display: "flex" }}>
              <div className="dropdown">
                <div
                  className="dropdown-btn"
                  onClick={(e) => {
                    const isSelected = categories.some(
                      (item) => item.name === selectedDropdownItemCate?.name
                    );

                    if (isSelected === true) {
                      setIsActiveDropdownSubCate(!isActiveDropdownSubCate);
                    }
                  }}
                >
                  {selectedDropdownItemSubCate?.name
                    ? selectedDropdownItemSubCate?.name
                    : "Chọn sản phẩm phụ"}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {!selectedDropdownItemCate && (
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
                          setSelectedDropdownItemSubCate(item);
                          setIsActiveDropdownSubCate(false);
                          setError({ ...error, subCateName: "" });
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

        {/* product name */}
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
        {/* * * */}

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
                      error: { ...productBatchs[index].error, expiredDate: "" },
                    };
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
            </div>
            {/* Store */}
            <div className="modal__container-body-inputcontrol">
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
                        if (selectedSupermarketDropdownItem) {
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
                      {item?.supermarketAddress?.id &&
                      selectedSupermarketDropdownItem
                        ? item?.supermarketAddress?.address
                        : "Chọn chi nhánh"}
                      <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                    {!selectedSupermarketDropdownItem && (
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
                        {supermarketStores.map((item, i) => (
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
            </div>
          </>
        ))}

        <div className="modal__container-body-inputcontrol">
          <button
            style={{ width: "100%" }}
            onClick={() => {
              const newProductBatchs = [
                ...productBatchs,
                {
                  expiredDate: null,
                  id: null,
                  price: 0,
                  priceOriginal: 0,
                  quantity: 0,
                  sellingDate: 0,
                  supermarketAddress: null,
                  error: {
                    price: "",
                    priceOriginal: "",
                    quantity: "",
                    expiredDate: "",
                    supermarketStores: "",
                  },
                  isActiveDropdownSupermarketStore: false,
                },
              ];

              setProductBatchs(newProductBatchs);
            }}
            className="buttonAddSupermarkerAddress"
          >
            Thêm lô hàng mới
            <FontAwesomeIcon icon={faPlusCircle} style={{ paddingLeft: 10 }} />
          </button>
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
                multiple
                onChange={({ target: { files } }) => {
                  if (files && files[0]) {
                    // setImage(URL.createObjectURL(files[0]));
                    // setImageToFireBase(files[0]);
                    // setError({ ...error, imageUrl: "" });
                    console.log(URL.createObjectURL(files[0]));
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
      <Dialog
        onClose={handleCloseProductDuplicated}
        aria-labelledby="customized-dialog-title"
        open={openProductDuplicated}
      >
        <ProductDuplicated
          handleClose={handleCloseProductDuplicated}
          item={productDuplicated}
          confirmProductList={confirmProductList}
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
    </div>
  );
};

export default EditConfirmProduct;
