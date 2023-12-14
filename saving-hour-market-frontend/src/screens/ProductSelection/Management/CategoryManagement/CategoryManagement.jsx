import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faMagnifyingGlass,
  faPlus,
  faTrashCanArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import { auth, database } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import ViewSubCategory from "./ViewSubCategory";
import EditCategory from "./EditCategory";
import CreateCategory from "./CreateCategory";
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { child, get, ref } from "firebase/database";
import Empty from "../../../../assets/Empty.png";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [msg, setMsg] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [idToDelete, setIdToDelete] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [openView, setOpenView] = useState(false);
  const handleOpenView = () => setOpenView(true);
  const handleCloseView = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${
        API.baseURL
      }/api/product/getCategoryForStaff?name=${searchValue}&page=${
        page - 1
      }&limit=5${isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"}`,
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
        setCategories(data.productCategoryList);
        setTotalPage(data.totalPage);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    setOpenView(false);
  };
  const [subCategoryToView, setSubCategoryToView] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const userState = useAuthState(auth);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${
            API.baseURL
          }/api/product/getCategoryForStaff?name=${searchValue}&page=${
            page - 1
          }&limit=5${isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"}`,
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
            console.log(data);
            setCategories(data.productCategoryList);
            setTotalPage(data.totalPage);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    };
    fetchCategory();
  }, [isSwitchRecovery, page, searchValue, userState[1]]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchValue(textSearch);
    setPage(1);
    setTextPage(1);
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

  const handleDelete = async (id) => {
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
          handleCloseDelete();
          isSystemDisable = false;
        }
      }
    });
    if (!isSystemDisable) {
      setLoading(false);
      return;
    }
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/product/updateCategoryStatus?status=DISABLE&categoryId=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setMsg(res.error);
          return;
        }
        fetch(
          `${
            API.baseURL
          }/api/product/getCategoryForStaff?name=${searchValue}&page=${
            page - 1
          }&limit=5${isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"}`,
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
            setCategories(data.productCategoryList);
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
        setMsg("Xóa loại sản phẩm thành công");
      });
  };

  const handleSwitchRecoveryTable = (check) => {
    onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true);
      setTextPage(1);
      if (userAuth) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${
            API.baseURL
          }/api/product/getCategoryForStaff?name=${searchValue}&page=${
            page - 1
          }&limit=5${check ? "&status=DISABLE" : "&status=ENABLE"}`,
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
            setCategories(data.productCategoryList);
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

  const handleRecoveryCategory = async (id) => {
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
    fetch(
      `${
        API.baseURL
      }/api/product/updateCategoryStatus?status=ENABLE&categoryId=${id}${
        isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setMsg(res.error);
          return;
        }
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
            setCategories(data.productCategoryList);
            setTotalPage(data.totalPage);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Phục hồi loại sản phẩm thành công");
      });
  };

  const CategoryRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>
            <i
              onClick={() => {
                setSubCategoryToView(item);
                handleOpenView();
                setCategoryName(item.name);
              }}
              className="bi bi-eye"
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
                setCategoryToEdit(item);
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

  const CategoryRowRecovery = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>
            <i
              onClick={() => {
                setSubCategoryToView(item);
                handleOpenView();
                setCategoryName(item.name);
              }}
              className="bi bi-eye"
            ></i>
          </td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                handleRecoveryCategory(item.id);
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
      <div>
        {/* Table */}
        <div className="supermarket__container">
          <div className="supermarket__header">
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
            {/* ****************** */}
            {!isSwitchRecovery && (
              <div onClick={handleOpen} className="supermarket__header-button">
                <FontAwesomeIcon icon={faPlus} />
                Thêm loại sản phẩm
              </div>
            )}
          </div>

          {/* data table + pagination*/}
          {!isSwitchRecovery && (
            <div className="table__container table-box-shadow">
              {/* data table */}
              <table class="table ">
                <thead>
                  <tr className="table-header-row">
                    {categories.length !== 0 && (
                      <>
                        <th>No.</th>
                        <th>Tên loại sản phẩm</th>
                        <th>Loại sản phẩm phụ</th>
                        <th>Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <CategoryRow item={item} index={index} key={index} />
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
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
                    Không có loại sản phẩm nào
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
                  Danh sách loại sản phẩm đã xóa
                  <FontAwesomeIcon icon={faTrashCanArrowUp} />
                </button>
              </div>

              {/* pagination */}
              {categories.length !== 0 && (
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
          )}

          {isSwitchRecovery && (
            <div className="table__container table-box-shadow">
              {/* data table */}
              <table class="table ">
                <thead>
                  <tr className="table-header-row">
                    {categories.length !== 0 && (
                      <>
                        <th>No.</th>
                        <th>Tên loại sản phẩm</th>
                        <th>Loại sản phẩm phụ</th>
                        <th>Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <CategoryRowRecovery
                      item={item}
                      index={index}
                      key={index}
                    />
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
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
                    Không có loại sản phẩm bị xóa nào
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
                  Danh sách loại sản phẩm
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
              </div>

              {/* pagination */}
              {categories.length !== 0 && (
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
          )}

          {/* ***************** */}
        </div>

        <Dialog
          onClose={handleCloseView}
          aria-labelledby="customized-dialog-title"
          open={openView}
        >
          <ViewSubCategory
            handleClose={handleCloseView}
            setSubCategoryToView={setSubCategoryToView}
            subCategoryToView={subCategoryToView}
            categoryName={categoryName}
          />
        </Dialog>

        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <CreateCategory
            handleClose={handleClose}
            setCategory={setCategories}
            setSubCategory={setSubCategory}
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
          <EditCategory
            handleClose={handleCloseEdit}
            categoryToEdit={categoryToEdit}
            setCategory={setCategories}
            page={page}
            setTotalPage={setTotalPage}
            searchValue={searchValue}
            setSubCategory={setSubCategory}
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
                onClick={() => handleDelete(idToDelete)}
                className="modal__container-footer-buttons-create"
              >
                Xóa
              </button>
            </div>
          </div>
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
      </div>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default CategoryManagement;
