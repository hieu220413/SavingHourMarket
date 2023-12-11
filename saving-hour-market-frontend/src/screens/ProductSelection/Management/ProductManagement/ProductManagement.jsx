import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./ProductManagement.scss";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faXmark,
  faTrashCanArrowUp,
  faClipboard,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { auth, database } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import { Dialog, Menu, MenuItem } from "@mui/material";
import CreateProductByExcel from "./CreateProductByExcel";
import { onAuthStateChanged } from "firebase/auth";
import ConfirmProductUploadByExcel from "./ConfirmProductUploadByExcel";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Empty from "../../../../assets/Empty.png";
import { useAuthState } from "react-firebase-hooks/auth";
import ViewProductBatch from "./ViewProductBatch";
import ProductImageSlider from "./ProductImageSlider";
import FilterModal from "./FilterModal";
import { child, get, ref } from "firebase/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [msg, setMsg] = useState("Thêm mới thành công");
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productBatchAddressList, setProductAddressList] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [idToDelete, setIdToDelete] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [confirmProductList, setConfirmProductList] = useState([]);

  const [openCreateByExcel, setOpenCreateByExcel] = useState(false);
  const handleOpenCreateByExcel = () => setOpenCreateByExcel(true);
  const handleCloseCreateByExcel = () => setOpenCreateByExcel(false);

  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const handleOpenConfirmCreate = () => setOpenConfirmCreate(true);
  const handleCloseConfirmCreate = () => setOpenConfirmCreate(false);

  const [productBatch, setProductBatch] = useState(null);
  const [openProductBatch, setOpenProductBatch] = useState(false);
  const handleOpenProductBatch = () => setOpenProductBatch(true);
  const handleCloseProductBatch = () => setOpenProductBatch(false);

  const [imageUrlList, setImageUrlList] = useState(null);
  const [openImageUrlList, setOpenImageUrlList] = useState(false);
  const handleOpenImageUrlList = () => setOpenImageUrlList(true);
  const handleCloseImageUrlList = () => setOpenImageUrlList(false);

  const [openFilter, setOpenFilter] = useState(false);
  const handleOpenFilter = () => setOpenFilter(true);
  const handleCloseFilter = () => setOpenFilter(false);

  const expiredShownOptions = [
    {
      display: "Có",
      value: "&isHiddenBatchShown=true",
    },
    {
      display: "Không",
      value: "&isHiddenBatchShown=false",
    },
  ];
  const [supermarkets, setSupermarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [initialSubCategories, setInitialSubCategories] = useState([]);

  const [isExpiredShown, setIsExpiredShown] = useState("");
  const [supermarketId, setSupermarketId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productSubCategoryId, setProductSubCategoryId] = useState("");

  const [productName, setProductName] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const userState = useAuthState(auth);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (!userState[1]) {
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
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    };
    const fetchDataForFilter = async () => {
      setLoading(true);
      if (!userState[1]) {
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
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
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
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
        fetch(`${API.baseURL}/api/product/getAllSubCategoryForStaff`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setSubCategories(data);
            setInitialSubCategories(data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    };
    fetchDataForFilter();
    fetchProduct();
  }, [isSwitchRecovery, page, searchValue, userState[1]]);

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    let isSystemDisable = true;
    await get(child(ref(database), "systemStatus")).then((snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        if (data === 1) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
          });
          setMsg("Hệ thống không trong trạng thái bảo trì !");
          isSystemDisable = false;
        }
      }
    });
    if (!isSystemDisable) {
      setLoading(false);
      return;
    }
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/product/disable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(id),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setMsg(res.error);
          return;
        }
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
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
        handleCloseDelete();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Xóa sản phẩm thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSwitchRecoveryTable = (check) => {
    onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true);
      setIsExpiredShown("");
      setSupermarketId("");
      setProductCategoryId("");
      setProductSubCategoryId("");
      setTextPage(1);
      if (userAuth) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${API.baseURL}/api/product/getProductsForStaff?page=${
            page - 1
          }&limit=5&name=${searchValue}${
            check ? "&status=DISABLE" : "&status=ENABLE"
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
            setIsSwitchRecovery(!isSwitchRecovery);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    });
  };

  const handleRecoveryProduct = async (id) => {
    setLoading(true);
    let isSystemDisable = true;
    await get(child(ref(database), "systemStatus")).then((snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        if (data === 1) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
          });
          setMsg("Hệ thống không trong trạng thái bảo trì !");
          isSystemDisable = false;
        }
      }
    });
    if (!isSystemDisable) {
      setLoading(false);
      return;
    }
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/product/enable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(id),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setMsg(res.error);
          setLoading(false);
          return;
        }
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
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
        handleCloseDelete();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Phục hồi sản phẩm thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const menuTabs = [
    {
      display: "Siêu thị",
      to: "/supermarketmanagement",
    },
    {
      display: "Sản phẩm",
      to: "/productmanagement",
    },
    {
      display: "Loại sản phẩm",
      to: "/categorymanagement",
    },
  ];

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchValue(textSearch);
    setPage(1);
    setTextPage(1);
  };

  const ProductRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <div style={{ position: "relative" }}>
              <img
                style={{
                  cursor: "pointer",
                }}
                className="img-scale"
                onClick={() => {
                  setImageUrlList(item.imageUrlImageList);
                  handleOpenImageUrlList();
                }}
                width="80px"
                height="60px"
                src={item.imageUrlImageList[0].imageUrl}
              />
              <div className="image-number">
                1/{item.imageUrlImageList.length}
              </div>
            </div>
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30 }}>
            {item.priceListed.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td style={{ paddingTop: 30 }}>{item.unit}</td>
          <td style={{ paddingTop: 30 }}>{item.productSubCategory.name}</td>

          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                setProductBatch(item.productBatchList);
                setProductName(item.name);
                handleOpenProductBatch();
              }}
              className="bi bi-list"
            ></i>
          </td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={async () => {
                let isSystemDisable = true;
                await get(child(ref(database), "systemStatus")).then(
                  (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                      if (data === 1) {
                        setOpenSnackbar({
                          ...openSnackbar,
                          open: true,
                          severity: "error",
                        });
                        setMsg("Hệ thống không trong trạng thái bảo trì !");
                        isSystemDisable = false;
                      }
                    }
                  }
                );
                if (!isSystemDisable) {
                  setLoading(false);
                  return;
                }
                setProductToEdit(item);
                const arr = [];
                item.productBatchList.map((item) => {
                  arr.push(item.productBatchAddressList);
                });
                setProductAddressList(arr);
                handleOpenEdit();
              }}
              class="bi bi-pencil-square"
            ></i>
            <i
              onClick={() => {
                setIdToDelete(item.id);
                handleOpenDelete();
              }}
              class="bi bi-trash-fill"
            ></i>
          </td>
        </tr>
      </>
    );
  };

  const ProductRowRecovery = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <div style={{ position: "relative" }}>
              <img
                width="80px"
                height="60px"
                className="img-scale"
                onClick={() => {
                  setImageUrlList(item.imageUrlImageList);
                  handleOpenImageUrlList();
                }}
                src={item.imageUrlImageList[0].imageUrl}
              />
              <div className="image-number">
                1/{item.imageUrlImageList.length}
              </div>
            </div>
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30 }}>
            {item.priceListed.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td style={{ paddingTop: 30 }}>{item.unit}</td>
          <td style={{ paddingTop: 30 }}>{item.productSubCategory.name}</td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                setProductBatch(item.productBatchList);
                handleOpenProductBatch();
              }}
              className="bi bi-eye"
            ></i>
          </td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                handleRecoveryProduct(item.id);
              }}
              class="bi bi-arrow-repeat"
            ></i>
          </td>
        </tr>
      </>
    );
  };
  return (
    <div>
      {/* Table */}
      <div className="supermarket__container">
        <div className="supermarket__header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* search bar */}
            <div className="search">
              <form onSubmit={(e) => onSubmitSearch(e)}>
                <div onClick={(e) => onSubmitSearch(e)} className="search-icon">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <input
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  type="text"
                  placeholder="Từ khóa tìm kiếm"
                />
              </form>
            </div>
            {/* Filter */}
            <div>
              <button className="filter_button" onClick={handleOpenFilter}>
                <FontAwesomeIcon icon={faFilter} />
                Bộ lọc
              </button>
            </div>
          </div>
          {/* ****************** */}
          {!isSwitchRecovery && (
            <div onClick={handleClick} className="supermarket__header-button">
              <FontAwesomeIcon icon={faPlus} />
              Thêm sản phẩm
            </div>
          )}

          <Menu
            style={{ top: "5px" }}
            id="basic-menu"
            anchorEl={anchorEl}
            open={openDropdown}
            onClose={handleCloseDropdown}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              style={{ fontSize: "14px" }}
              onClick={() => {
                handleOpen();
                handleCloseDropdown();
              }}
            >
              Thêm thủ công
            </MenuItem>
            <MenuItem
              style={{ fontSize: "14px" }}
              onClick={() => {
                handleOpenCreateByExcel();
                handleCloseDropdown();
              }}
            >
              Thêm bằng file excel
            </MenuItem>
          </Menu>
        </div>

        {/* data table + pagination*/}
        {!isSwitchRecovery && (
          <div
            className="table__container table-box-shadow"
            style={{ height: "650px" }}
          >
            {/* data table */}
            <table class="table ">
              <thead>
                <tr className="table-header-row">
                  {products.length !== 0 && (
                    <>
                      <th>No.</th>
                      <th>Hình ảnh</th>
                      <th>Tên Sản phẩm</th>
                      <th>Giá niêm yết</th>
                      <th>Đơn vị</th>
                      <th>Tên loại sản phẩm phụ </th>
                      <th>Lô hàng</th>
                      <th>Thao tác</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <ProductRow item={item} index={index} key={index} />
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={Empty} alt="" />
                </div>
                <p
                  style={{
                    textAlign: "center",
                    color: "grey",
                    fontSize: 24,
                  }}
                >
                  Không có sản phẩm nào
                </p>
              </div>
            )}
            {/* ********************** */}

            <div>
              <button
                onClick={() => {
                  setPage(1);
                  handleSwitchRecoveryTable(!isSwitchRecovery);
                }}
                className=" buttonRecovery"
              >
                Những sản phẩm đã xóa
                <FontAwesomeIcon icon={faTrashCanArrowUp} />
              </button>
            </div>

            {/* pagination */}
            {products.length !== 0 && (
              <div className="row pageBtn">
                <div className="col" style={{ textAlign: "right" }}>
                  <br />
                  <form action="">
                    <button
                      type="submit"
                      disabled={page === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(1);
                        setTextPage(1);
                      }}
                      className="btn btn-success  "
                      name="op"
                      value="FirstPage"
                      title="First Page"
                    >
                      <i className="bi bi-chevron-bar-left"></i>
                    </button>
                    <button
                      type="submit"
                      disabled={page === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page - 1);
                        setTextPage(page - 1);
                      }}
                      className="btn btn-success  "
                      name="op"
                      value="PreviousPage"
                      title="Previous Page"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                      type="submit"
                      disabled={page === totalPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                        setTextPage(page + 1);
                      }}
                      className="btn btn-success  "
                      name="op"
                      value="NextPage"
                      title="Next Page"
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                    <button
                      type="submit"
                      disabled={page === totalPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(totalPage);
                        setTextPage(totalPage);
                      }}
                      className="btn btn-success  "
                      name="op"
                      value="LastPage"
                      title="Last Page"
                    >
                      <i className="bi bi-chevron-bar-right"></i>
                    </button>
                    <input
                      type="number"
                      name="gotoPage"
                      value={textPage}
                      onChange={(e) => {
                        setTextPage(e.target.value);
                      }}
                      className=" "
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#000",
                        width: "40px",
                      }}
                      title="Enter page number"
                    />
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        if (textPage >= 1 && textPage <= totalPage) {
                          setPage(parseInt(textPage));
                        } else {
                          setTextPage(page);
                        }
                      }}
                      className="btn btn-success  "
                      name="op"
                      value="GotoPage"
                      title="Goto Page"
                    >
                      <i className="bi bi-arrow-up-right-circle"></i>
                    </button>
                  </form>
                  Page {page}/{totalPage}
                </div>
              </div>
            )}
            {/* ********************** */}
          </div>
        )}

        {isSwitchRecovery && (
          <>
            <div className="table__container" style={{ height: "650px" }}>
              {/* data table */}
              <table class="table ">
                <thead>
                  <tr className="table-header-row">
                    {products.length !== 0 && (
                      <>
                        <th>No.</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Giá niêm yết</th>
                        <th>Đơn vị</th>
                        <th>Tên Sản phẩm</th>
                        <th>Lô hàng</th>
                        <th>Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <ProductRowRecovery item={item} index={index} key={index} />
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={Empty} alt="" />
                  </div>
                  <p
                    style={{
                      textAlign: "center",
                      color: "grey",
                      fontSize: 24,
                    }}
                  >
                    Không có sản phẩm bị xóa nào
                  </p>
                </div>
              )}

              {/* ********************** */}

              <div>
                <button
                  onClick={() => {
                    setPage(1);
                    handleSwitchRecoveryTable(!isSwitchRecovery);
                  }}
                  className=" buttonRecovery"
                >
                  Danh sách sản phẩm
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
              </div>

              {/* pagination */}
              {products.length !== 0 && (
                <div className="row pageBtn">
                  <div className="col" style={{ textAlign: "right" }}>
                    <br />
                    <form action="">
                      <button
                        type="submit"
                        disabled={page === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(1);
                        }}
                        className="btn btn-success  "
                        name="op"
                        value="FirstPage"
                        title="First Page"
                      >
                        <i className="bi bi-chevron-bar-left"></i>
                      </button>
                      <button
                        type="submit"
                        disabled={page === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page - 1);
                        }}
                        className="btn btn-success  "
                        name="op"
                        value="PreviousPage"
                        title="Previous Page"
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <button
                        type="submit"
                        disabled={page === totalPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                        className="btn btn-success  "
                        name="op"
                        value="NextPage"
                        title="Next Page"
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                      <button
                        type="submit"
                        disabled={page === totalPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(totalPage);
                        }}
                        className="btn btn-success  "
                        name="op"
                        value="LastPage"
                        title="Last Page"
                      >
                        <i className="bi bi-chevron-bar-right"></i>
                      </button>
                      <input
                        type="number"
                        name="gotoPage"
                        value={textPage}
                        onChange={(e) => {
                          if (
                            e.target.value >= page &&
                            e.target.value <= totalPage
                          )
                            setTextPage(e.target.value);
                        }}
                        className=" "
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          color: "#000",
                          width: "40px",
                        }}
                        title="Enter page number"
                      />
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(textPage);
                        }}
                        className="btn btn-success  "
                        name="op"
                        value="GotoPage"
                        title="Goto Page"
                      >
                        <i className="bi bi-arrow-up-right-circle"></i>
                      </button>
                    </form>
                    Page {page}/{totalPage}
                  </div>
                </div>
              )}
              {/* ********************** */}
            </div>
          </>
        )}

        {/* ***************** */}
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <CreateProduct
          handleClose={handleClose}
          setProducts={setProducts}
          page={page}
          setTotalPage={setTotalPage}
          searchValue={searchValue}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseEdit}
        aria-labelledby="customized-dialog-title"
        open={openEdit}
      >
        <EditProduct
          handleClose={handleCloseEdit}
          product={productToEdit}
          productBatchAddressList={productBatchAddressList}
          setProducts={setProducts}
          page={page}
          setTotalPage={setTotalPage}
          searchValue={searchValue}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseDelete}
        aria-labelledby="customized-dialog-title"
        open={openDelete}
      >
        <div className={`modal__container `}>
          <div className="modal__container-header">
            <h3 className="modal__container-header-title">Xóa sản phẩm</h3>
            <FontAwesomeIcon onClick={handleCloseDelete} icon={faXmark} />
          </div>
        </div>

        <div className={`modal__container-body `}>
          <p style={{ fontSize: "16px", color: "#212B36" }}>
            Bạn có chắc muốn xóa sản phẩm này
          </p>
        </div>
        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              onClick={handleCloseDelete}
              className="modal__container-footer-buttons-close"
            >
              Đóng
            </button>
            <button
              onClick={() => handleDeleteProduct(idToDelete)}
              className="modal__container-footer-buttons-create"
            >
              Xóa
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        onClose={handleCloseCreateByExcel}
        aria-labelledby="customized-dialog-title"
        open={openCreateByExcel}
      >
        <CreateProductByExcel
          handleOpenConfirmCreate={handleOpenConfirmCreate}
          setConfirmProductList={setConfirmProductList}
          handleClose={handleCloseCreateByExcel}
        />
      </Dialog>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={openConfirmCreate}
      >
        <ConfirmProductUploadByExcel
          setMsg={setMsg}
          confirmProductList={confirmProductList}
          setConfirmProductList={setConfirmProductList}
          handleClose={handleCloseConfirmCreate}
          setOpenSuccessSnackbar={setOpenSnackbar}
          openSuccessSnackbar={openSnackbar}
          setProducts={setProducts}
          setIsSwitchRecovery={setIsSwitchRecovery}
          page={page}
          searchValue={searchValue}
          setTotalPage={setTotalPage}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseProductBatch}
        aria-labelledby="customized-dialog-title"
        open={openProductBatch}
      >
        <ViewProductBatch
          handleClose={handleCloseProductBatch}
          productBatch={productBatch}
          productName={productName}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseImageUrlList}
        aria-labelledby="customized-dialog-title"
        open={openImageUrlList}
      >
        <ProductImageSlider
          handleClose={handleCloseImageUrlList}
          imageUrlList={imageUrlList}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseFilter}
        aria-labelledby="customized-dialog-title"
        open={openFilter}
      >
        <FilterModal
          handleClose={handleCloseFilter}
          setProducts={setProducts}
          isSwitchRecovery={isSwitchRecovery}
          page={page}
          setPage={setPage}
          setTextPage={setTextPage}
          setTotalPage={setTotalPage}
          searchValue={searchValue}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
          expiredShownOptions={expiredShownOptions}
          supermarkets={supermarkets}
          categories={categories}
          subCategories={subCategories}
          isExpiredShown={isExpiredShown}
          setIsExpiredShown={setIsExpiredShown}
          supermarketId={supermarketId}
          setSupermarketId={setSupermarketId}
          productCategoryId={productCategoryId}
          setProductCategoryId={setProductCategoryId}
          productSubCategoryId={productSubCategoryId}
          setProductSubCategoryId={setProductSubCategoryId}
          setSubCategories={setSubCategories}
          initialSubCategories={initialSubCategories}
        />
      </Dialog>

      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {msg}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default ProductManagement;
