import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faTrashCanArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import EditSubCategory from "./EditSubCategory";
import CreateSubCategory from "./CreateSubCategory";
import { child, get, ref } from "firebase/database";
import { auth, database } from "../../../../firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { onAuthStateChanged } from "firebase/auth";
import Empty from "../../../../assets/Empty.png";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ViewSubCategory = ({ handleClose, subCategoryToView, categoryName }) => {
  const categoryId = subCategoryToView.id;
  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [subCategoryToEdit, setSubCategoryToEdit] = useState(null);
  const [msg, setMsg] = useState("");
  const [subCateList, setSubCateList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [idToDelete, setIdToDelete] = useState("");

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
    const fetchSubCategory = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${
            API.baseURL
          }/api/product/getSubCategoryForStaff?productCategoryId=${categoryId}&page=${
            page - 1
          }&limit=4${isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((response) => {
            setSubCateList(response.productSubCategoryList);
            setTotalPage(response.totalPage);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    };
    fetchSubCategory();
  }, [categoryId, isSwitchRecovery, page, userState[1]]);

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
      `${API.baseURL}/api/product/updateSubCategoryStatus?status=DISABLE&subCategoryId=${id}`,
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
          }/api/product/getSubCategoryForStaff?productCategoryId=${categoryId}&page=${
            page - 1
          }&limit=4${isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((response) => {
            setSubCateList(response.productSubCategoryList);
            setTotalPage(response.totalPage);
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
        setMsg("Xóa loại sản phẩm phụ thành công");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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
          }/api/product/getSubCategoryForStaff?productCategoryId=${categoryId}&page=${
            page - 1
          }&limit=4${check ? "&status=DISABLE" : "&status=ENABLE"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((response) => {
            setSubCateList(response.productSubCategoryList);
            setTotalPage(response.totalPage);
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
      `${API.baseURL}/api/product/updateSubCategoryStatus?status=ENABLE&subCategoryId=${id}`,
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
          }/api/product/getSubCategoryForStaff?productCategoryId=${categoryId}&page=${
            page - 1
          }&limit=4${isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
          }
        )
          .then((res) => res.json())
          .then((response) => {
            setSubCateList(response.productSubCategoryList);
            setTotalPage(response.totalPage);
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
        setMsg("Phục hồi loại sản phẩm phụ thành công");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const SubCateRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30, fontWeight: "bold" }}>
            {item.allowableDisplayThreshold}
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
                        setMsg("Hệ thống không trong trạng thái bảo trì");

                        isSystemDisable = false;
                      }
                    }
                  }
                );
                if (!isSystemDisable) {
                  return;
                }
                setSubCategoryToEdit(item);
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

  const SubCateRowRecovery = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{index + 1}</td>
          <td>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30, fontWeight: "bold" }}>
            {item.allowableDisplayThreshold}
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
    <>
      <div>
        <div className="modal__container" style={{ width: "100%" }}>
          <div className="modal__container-header">
            <h3 className="modal__container-header-title">
              Chi tiết các loại sản phẩm phụ cho {categoryName}
            </h3>
            <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
          </div>

          {!isSwitchRecovery && (
            <div className="modal__container-body">
              <div className="table__container">
                <table class="table ">
                  <thead>
                    <tr className="table-header-row">
                      {subCateList.length !== 0 && (
                        <>
                          <th>No.</th>
                          <th>Hình ảnh</th>
                          <th>Tên loại sản phẩm phụ</th>
                          <th>Ngày trước hạn HSD cho phép</th>
                          <th>Thao tác</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {subCateList.map((item, index) => (
                      <SubCateRow item={item} index={index} key={index} />
                    ))}
                  </tbody>
                </table>
                {subCateList.length === 0 && (
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
                      Không có loại sản phẩm phụ nào
                    </p>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => {
                      setPage(1);
                      handleSwitchRecoveryTable(!isSwitchRecovery);
                    }}
                    className=" buttonRecovery"
                  >
                    Danh sách loại sản phẩm phụ đã xóa
                    <FontAwesomeIcon icon={faTrashCanArrowUp} />
                  </button>
                </div>
                {/* pagination */}
                {subCateList.length !== 0 && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}
          {isSwitchRecovery && (
            <div className="modal__container-body">
              <div className="table__container" style={{ height: "650px" }}>
                <table class="table ">
                  <thead>
                    <tr className="table-header-row">
                      {subCateList.length !== 0 && (
                        <>
                          <th>No.</th>
                          <th>Hình ảnh</th>
                          <th>Tên loại sản phẩm phụ</th>
                          <th>Ngày trước hạn HSD cho phép</th>
                          <th>Thao tác</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {subCateList.map((item, index) => (
                      <SubCateRowRecovery
                        item={item}
                        index={index}
                        key={index}
                      />
                    ))}
                  </tbody>
                </table>
                {subCateList.length === 0 && (
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
                      Không có loại sản phẩm phụ nào bị xóa
                    </p>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => {
                      setPage(1);
                      handleSwitchRecoveryTable(!isSwitchRecovery);
                    }}
                    className=" buttonRecovery"
                  >
                    Danh sách loại sản phẩm phụ
                    <FontAwesomeIcon icon={faClipboard} />
                  </button>
                </div>
                {/* pagination */}
                {subCateList.length !== 0 && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}
          {/* modal footer */}
          <div className="modal__container-footer">
            {!isSwitchRecovery && (
              <div className="modal__container-footer-buttons">
                <button
                  onClick={handleOpenCreate}
                  className="modal__container-footer-buttons-create"
                >
                  Thêm loại sản phẩm phụ
                </button>
              </div>
            )}
          </div>
        </div>

        <Dialog
          onClose={handleCloseCreate}
          aria-labelledby="customized-dialog-title"
          open={openCreate}
        >
          <CreateSubCategory
            handleClose={handleCloseCreate}
            setSubCateList={setSubCateList}
            page={page}
            setTotalPage={setTotalPage}
            setPage={setPage}
            categoryId={categoryId}
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
          <EditSubCategory
            handleClose={handleCloseEdit}
            subCategoryToEdit={subCategoryToEdit}
            setSubCateList={setSubCateList}
            categoryId={categoryId}
            setTotalPage={setTotalPage}
            setPage={setPage}
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
    </>
  );
};

export default ViewSubCategory;
