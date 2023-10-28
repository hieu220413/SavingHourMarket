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
} from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import dayjs from "dayjs";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

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
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("Chưa có hình ảnh sản phẩm");
  const [imgToFirebase, setImgToFirebase] = useState("");

  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );
  const [imgSubCateToFirebase, setImgSubCateToFirebase] = useState("");

  const [supermarkets, setSupermarkets] = useState([]);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [selectedDropdownItem, setSelectedDropdownItem] =
    useState("Chọn siêu thị");
  const [isCreateNewSupermarket, setIsCreateNewSupermarket] = useState(false);

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

  const [locationData, setLocationData] = useState([]);

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

  const uploadProductImgToFirebase = async () => {
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

  const getDateAfterToday = (numberOfDays) => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + numberOfDays);
    return nextDate;
  };

  const handleSubmit = async () => {
    if (supermarket === "") {
      setError({ ...error, supermarket: "Vui lòng không để trống" });
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
    if (allowableDate < allowableDisplayThreshold) {
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

    let imageUrlSubCate = await uploadSubCateImgToFireBase();
    if (imageUrlSubCate === "") {
      setError({ ...error, imageUrlSubCate: "Chưa có ảnh sản phẩm" });
      return;
    }

    let imageUrl = await uploadProductImgToFirebase();
    if (imageUrl === "") {
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
      imageUrl: imageUrlSubCate,
      allowableDisplayThreshold: allowableDisplayThreshold,
      productCategory: {
        id: categoryId ? categoryId : "",
        name: category,
        totalDiscountUsage: 0,
      },
      totalDiscountUsage: 0,
    };
    // -----------------------------------------------------------------
    const productToCreate = {
      name: productName,
      price: price,
      priceOriginal: priceOriginal,
      description: description,
      expiredDate: expiredDate,
      quantity: quantity,
      imageUrl: imageUrl,
      productSubCategory: submitProductSubCategory,
      supermarket: submitSupermarket,
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
      <div className="modal__container">
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
          {isCreateNewSupermarket === false && (
            <>
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
                    <div className="dropdown">
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
                                setSupermarketAddress(
                                  item.supermarketAddressList
                                );
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
                    <button
                      style={{
                        width: "120px",
                      }}
                      className="buttonSwitchSelectSuperMarket"
                      onClick={(e) => {
                        setIsCreateNewSupermarket(true);
                        setSupermarket("");
                        setSuperMarketHotline("");
                        setSupermarketAddress([]);
                        setAddressList([
                          {
                            isFocused: false,
                            selectAddress: "",
                            searchAddress: "",
                          },
                        ]);
                      }}
                    >
                      Thêm mới
                      <FontAwesomeIcon
                        icon={faRepeat}
                        style={{ paddingLeft: 10 }}
                      />
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
            </>
          )}
          {/* Create Supermarket */}
          {isCreateNewSupermarket && (
            <>
              <button
                className="buttonSwitchSelectSuperMarket"
                onClick={(e) => {
                  setIsCreateNewSupermarket(false);
                  setSupermarket("");
                  setSelectedDropdownItem("Chọn siêu thị");
                }}
              >
                Thêm siêu thị có sẵn
                <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
              </button>
              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Tên siêu thị
                </h4>
                <div>
                  <input
                    placeholder="Nhập tên siêu thị"
                    type="text"
                    className="modal__container-body-inputcontrol-input"
                    value={supermarket}
                    onChange={(e) => {
                      setSupermarket(e.target.value);
                      setError({ ...error, supermarket: "" });
                    }}
                  />
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

              <div className="modal__container-body-inputcontrol">
                <h4 className="modal__container-body-inputcontrol-label">
                  Hotline siêu thị
                </h4>
                <div>
                  <input
                    placeholder="Nhập Hotline siêu thị"
                    type="text"
                    className="modal__container-body-inputcontrol-input"
                    value={supermarketHotline}
                    onChange={(e) => {
                      setSuperMarketHotline(e.target.value);
                      setError({ ...error, supermarketHotline: "" });
                    }}
                  />
                  {error.supermarketHotline && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {error.supermarketHotline}
                    </p>
                  )}
                </div>
              </div>

              {addressList.map((item, i) => {
                return (
                  <div className="modal__container-body-inputcontrol input-address">
                    <div className="modal__container-body-inputcontrol-label-icon">
                      {addressList.length !== 1 && (
                        <div
                          onClick={() => {
                            setAddressList(
                              addressList.filter((address) => address !== item)
                            );
                            setError({ ...error, supermarketAddress: "" });
                          }}
                          className="button__minus"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </div>
                      )}

                      <h4 className="modal__container-body-inputcontrol-label">
                        Chi nhánh {i + 1}
                      </h4>
                    </div>

                    <div>
                      <input
                        style={{ paddingRight: 20 }}
                        value={item.searchAddress}
                        onChange={(e) => {
                          const newAddressList1 = addressList.map(
                            (data, index) => {
                              if (index === i) {
                                return {
                                  ...data,
                                  searchAddress: e.target.value,
                                  selectAddress: "",
                                };
                              }
                              return data;
                            }
                          );
                          setAddressList(newAddressList1);
                          setError({ ...error, supermarketAddress: "" });

                          if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                          }
                          typingTimeoutRef.current = setTimeout(() => {
                            fetch(
                              `https://rsapi.goong.io/Place/AutoComplete?api_key=${API.GoongAPIKey}&limit=4&input=${item.searchAddress}`
                            )
                              .then((res) => res.json())
                              .then((respond) => {
                                if (!respond.predictions) {
                                  setLocationData([]);
                                  return;
                                }
                                setLocationData(respond.predictions);
                              })
                              .catch((err) => console.log(err));
                          }, 400);
                        }}
                        onFocus={() => {
                          setLocationData([]);
                          const newAddressList1 = addressList.map(
                            (data, index) => {
                              if (index === i) {
                                return { ...data, isFocused: true };
                              }
                              return { ...data, isFocused: false };
                            }
                          );
                          setAddressList(newAddressList1);
                        }}
                        placeholder="Nhập địa chỉ"
                        type="text"
                        className="modal__container-body-inputcontrol-input"
                      />
                      {item.searchAddress && (
                        <FontAwesomeIcon
                          onClick={() => {
                            const newAddressList1 = addressList.map(
                              (data, index) => {
                                if (index === i) {
                                  return {
                                    ...data,
                                    searchAddress: "",
                                    selectAddress: "",
                                  };
                                }
                                return data;
                              }
                            );
                            setAddressList(newAddressList1);
                          }}
                          className="input-icon-x"
                          icon={faX}
                        />
                      )}

                      {item.isFocused && locationData.length !== 0 && (
                        <div
                          className="suggest-location"
                          style={{
                            left: "155px",
                          }}
                        >
                          {locationData.map((data) => (
                            <div
                              onClick={() => {
                                const newAddressList1 = addressList.map(
                                  (address, index) => {
                                    if (index === i) {
                                      return {
                                        isFocused: false,
                                        searchAddress: data.description,
                                        selectAddress: data.description,
                                      };
                                    }
                                    return address;
                                  }
                                );
                                setAddressList(newAddressList1);
                              }}
                              className="suggest-location-item"
                            >
                              <h4>{data.description}</h4>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {error.supermarketAddress && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.supermarketAddress}
                </p>
              )}

              <div className="modal__container-body-inputcontrol">
                <button
                  onClick={() => {
                    setAddressList([
                      ...addressList,
                      {
                        isFocused: false,
                        selectAddress: "",
                        searchAddress: "",
                      },
                    ]);
                    setError({ ...error, supermarketAddress: "" });
                  }}
                  className="buttonAddSupermarkerAddress"
                >
                  Thêm chi nhánh mới
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    style={{ paddingLeft: 10 }}
                  />
                </button>
              </div>
            </>
          )}

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
          {/* Price */}
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Giá tiền
            </h4>
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
            <h4 className="modal__container-body-inputcontrol-label">
              Giá gốc
            </h4>

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
                  let allowableThresholdDate = dayjs(
                    getDateAfterToday(allowableDisplayThreshold)
                  ).format("DD/MM/YYYY");

                  if (currentDate > e.target.value) {
                    setError({
                      ...error,
                      expiredDate: "Ngày hết hạn không thể trước ngày hiện tại",
                    });
                  } else if (
                    dayjs(e.target.value).$D - day <
                    allowableDisplayThreshold
                  ) {
                    setError({
                      ...error,
                      expiredDate: `Ngày hết hạn bạn nhập đã bé hơn giới hạn số ngày trước HSD. \n Số ngày tổi thiểu của ${subCateName} là ${allowableThresholdDate}`,
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
            <h4 className="modal__container-body-inputcontrol-label">
              Số lượng
            </h4>
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
            <h4 className="modal__container-body-inputcontrol-label">
              Tải ảnh
            </h4>
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
      {loading && <LoadingScreen />}
    </>
  );
};

export default CreateProduct;
