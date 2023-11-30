import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { auth } from "../../../../firebase/firebase.config";

const FilterModal = ({
  handleClose,
  setProducts,
  isSwitchRecovery,
  page,
  expiredShownOptions,
  supermarkets,
  categories,
  subCategories,
  setTotalPage,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
  isExpiredShown,
  setIsExpiredShown,
  supermarketId,
  setSupermarketId,
  productCategoryId,
  setProductCategoryId,
  productSubCategoryId,
  setProductSubCategoryId,
  setSubCategories,
  initialSubCategories,
}) => {
  const supermarket = supermarkets.find((item) => item.id === supermarketId);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState(
    supermarket ? supermarket.name : "Chọn chi nhánh"
  );

  const category = categories.find((item) => item.id === productCategoryId);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] = useState(
    category ? category.name : "Chọn loại sản phẩm"
  );

  const subCategory = subCategories.find(
    (item) => item.id === productSubCategoryId
  );
  const [isActiveDropdownSubCate, setIsActiveDropdownSubCate] = useState(false);
  const [selectedDropdownItemSubCate, setSelectedDropdownItemSubCate] =
    useState(subCategory ? subCategory.name : "Chọn loại sản phẩm phụ");

  const expiredShown = expiredShownOptions.find(
    (item) => item.display === isExpiredShown.display
  );
  const [isActiveExpiredShownDropdown, setIsActiveExpiredShownDropdown] =
    useState(false);
  const [
    selectedExpiredShownDropdownItem,
    setSelectedExpiredShownDropdownItem,
  ] = useState(
    expiredShown ? expiredShown.display : "Hiển thị lô hàng đã bị ẩn"
  );

  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/product/getProductsForStaff?page=${
        page - 1
      }&limit=5&name=${searchValue}${
        isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"
      }`,
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
        setIsExpiredShown("");
        setSupermarketId("");
        setProductCategoryId("");
        setProductSubCategoryId("");
        setSelectedExpiredShownDropdownItem(null);
        setSelectedDropdownItem(null);
        setSelectedDropdownItemCate("Chọn loại sản phẩm");
        setSelectedDropdownItemSubCate("Chọn loại sản phẩm phụ");
        setSubCategories(initialSubCategories);
        handleClose();
        setLoading(false);
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Đã thiết lập lại");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleFilter = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/product/getProductsForStaff?page=${
        page - 1
      }&limit=5&name=${searchValue}${
        isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"
      }${isExpiredShown === "" ? "" : isExpiredShown.value}${
        supermarketId === "" ? "" : `&supermarketId=${supermarketId}`
      }${
        productCategoryId === ""
          ? ""
          : `&productCategoryId=${productCategoryId}`
      }${
        productSubCategoryId === ""
          ? ""
          : `&productSubCategoryId=${productSubCategoryId}`
      }`,
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
        setLoading(false);
        handleClose();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Đã lọc theo bộ lọc");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="modal__container" style={{ width: "650px" }}>
        <div className="modal__container-header">
          <h3 className="modal__container-header-title">Bộ lọc tìm kiếm</h3>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => {
              setIsExpiredShown("");
              setSupermarketId("");
              setProductCategoryId("");
              setProductSubCategoryId("");
              handleClose();
            }}
          />
        </div>
        <div
          className="modal__container-body"
          style={{ height: "55vh", overflowY: "scroll" }}
        >
          {/* isExpiredShown */}
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Hiện thị lô hàng đã bị ẩn
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
                    onClick={(e) =>
                      setIsActiveExpiredShownDropdown(
                        !isActiveExpiredShownDropdown
                      )
                    }
                  >
                    {selectedExpiredShownDropdownItem}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {isActiveExpiredShownDropdown && (
                    <div className="dropdown-content">
                      {expiredShownOptions.map((item, index) => (
                        <div
                          onClick={(e) => {
                            setSelectedExpiredShownDropdownItem(item.display);
                            setIsActiveExpiredShownDropdown(false);
                            setIsExpiredShown(item);
                          }}
                          className="dropdown-item"
                          key={index}
                        >
                          {item.display}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
            </div>
          </div>
          {/* Category */}
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Tên loại sản phẩm
            </h4>
            <div>
              <div style={{ display: "flex" }}>
                <div
                  className="dropdown"
                  style={{
                    width: "400px",
                  }}
                >
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
                            setProductCategoryId(item.id);
                            setSubCategories(item.productSubCategories);
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
            </div>
          </div>
          {/* SubCategory */}
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Tên loại sản phẩm
            </h4>
            <div>
              <div style={{ display: "flex" }}>
                <div
                  className="dropdown"
                  style={{
                    width: "400px",
                  }}
                >
                  <div
                    className="dropdown-btn"
                    onClick={(e) =>
                      setIsActiveDropdownSubCate(!isActiveDropdownSubCate)
                    }
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
                            setProductSubCategoryId(item.id);
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
            </div>
          </div>
        </div>
        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              className="modal__container-footer-buttons-close"
              onClick={handleClear}
            >
              Thiết lập lại
            </button>
            <button
              onClick={handleFilter}
              className="modal__container-footer-buttons-create"
            >
              Thiết lập
            </button>
          </div>
        </div>
      </div>
      {loading && <LoadingScreen />}
    </>
  );
};

export default FilterModal;
