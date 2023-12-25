import React, { useEffect, useState } from "react";
import {
  faMagnifyingGlass,
  faPlus,
  faTrashCanArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { API } from "../../../../contanst/api";
import { auth, database } from "../../../../firebase/firebase.config";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import CreateVoucher from "./CreateVoucher";
import EditVoucher from "./EditVoucher";
import { useAuthState } from "react-firebase-hooks/auth";
import Empty from "../../../../assets/Empty.png";
import { child, get, ref } from "firebase/database";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [voucherToEdit, setVoucherToEdit] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const [idToDelete, setIdToDelete] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchValue(textSearch);
    setPage(1);
    setTextPage(1);
  };

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

  useEffect(() => {
    const fetchVouchers = async () => {
      onAuthStateChanged(auth, async (userAuth) => {
        setLoading(true);
        if (userAuth) {
          const tokenId = await auth.currentUser.getIdToken();
          fetch(
            `${
              API.baseURL
            }/api/discount/getDiscountsForStaff?name=${searchValue}&page=${
              page - 1
            }&limit=5${
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
              setVouchers(data.discountList);
              setTotalPage(data.totalPage);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
      });
    };
    fetchVouchers();
  }, [isSwitchRecovery, page, searchValue]);
  const handleFetchVouchers = async () => {
    onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true);
      if (userAuth) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${
            API.baseURL
          }/api/discount/getDiscountsForStaff?name=${searchValue}&page=${
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
            setVouchers(data.discountList);
            setTotalPage(data.totalPage);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    });
  };

  const handleDisableDiscount = async (id) => {
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
    setLoading(true);
    fetch(`${API.baseURL}/api/discount/disableDiscount/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        handleFetchVouchers();
        handleCloseDelete();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Xóa mã giảm giá thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSwitchRecoveryTable = (check) => {
    onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true);
      if (userAuth) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${
            API.baseURL
          }/api/discount/getDiscountsForStaff?name=${searchValue}&page=${
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
            setVouchers(data.discountList);
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

  const handleRecovery = async (id) => {
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
    setLoading(true);
    fetch(`${API.baseURL}/api/discount/enableDiscount/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setMsg(res.error);
          setLoading(false);
          return;
        }
        handleFetchVouchers();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Phục hồi mã giảm giá thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const VoucherRow = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{(page - 1) * 5 + index + 1}</td>
          <td style={{ paddingTop: 30 }}>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30 }}>
            {dayjs(item.expiredDate).format("DD/MM/YYYY")}
          </td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>{item.quantity}</td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>
            {item.spentAmountRequired.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
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
                setVoucherToEdit(item);
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

  const VoucherRowToRecovery = ({ item, index }) => {
    return (
      <>
        <tr className="table-body-row">
          <td style={{ paddingTop: 30 }}>{(page - 1) * 5 + index + 1}</td>
          <td style={{ paddingTop: 30 }}>
            <img width="80px" height="60px" src={item.imageUrl} />
          </td>
          <td style={{ paddingTop: 30 }}>{item.name}</td>
          <td style={{ paddingTop: 30 }}>
            {dayjs(item.expiredDate).format("DD/MM/YYYY")}
          </td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>{item.quantity}</td>
          <td style={{ paddingTop: 30, paddingLeft: 30 }}>
            {item.spentAmountRequired.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                handleRecovery(item.id);
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
                Thêm mã giảm giá
              </div>
            )}
          </div>

          {/* data table + pagination*/}
          {!isSwitchRecovery && (
            <div
              className="table__container table-box-shadow"
              style={{ height: "700px" }}
            >
              {/* data table */}
              <table class="table ">
                <thead>
                  <tr className="table-header-row">
                    {vouchers.length !== 0 && (
                      <>
                        <th>No.</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Ngày hết hạn</th>
                        <th>Số lượng</th>
                        <th>Số tiền để dùng mã</th>
                        <th>Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((item, index) => (
                    <VoucherRow item={item} index={index} key={index} />
                  ))}
                </tbody>
              </table>
              {vouchers.length === 0 && (
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
                    Không có mã giảm giá nào
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
                  Những mã giảm giá đã xóa
                  <FontAwesomeIcon icon={faTrashCanArrowUp} />
                </button>
              </div>

              {/* pagination */}
              {vouchers.length !== 0 && (
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
            <div
              className="table__container table-box-shadow"
              style={{ height: "700px" }}
            >
              {/* data table */}
              <table class="table ">
                <thead>
                  <tr className="table-header-row">
                    {vouchers.length !== 0 && (
                      <>
                        <th>No.</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Ngày hết hạn</th>
                        <th>Số lượng</th>
                        <th>Số tiền để dùng mã</th>
                        <th>Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((item, index) => (
                    <VoucherRowToRecovery
                      item={item}
                      index={index}
                      key={index}
                    />
                  ))}
                </tbody>
              </table>
              {vouchers.length === 0 && (
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
                    Không có mã giảm giá bị xóa nào
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
                  Danh sách mã giảm giá
                  <FontAwesomeIcon icon={faTrashCanArrowUp} />
                </button>
              </div>

              {/* pagination */}
              {vouchers.length !== 0 && (
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
      </div>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <CreateVoucher
          handleClose={handleClose}
          setVouchers={setVouchers}
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
        <EditVoucher
          handleClose={handleCloseEdit}
          voucherToEdit={voucherToEdit}
          setVouchers={setVouchers}
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
            <h3 className="modal__container-header-title">Xóa mã giảm giá</h3>
            <FontAwesomeIcon onClick={handleCloseDelete} icon={faXmark} />
          </div>
        </div>

        <div className={`modal__container-body `}>
          <p style={{ fontSize: "16px", color: "#212B36" }}>
            Bạn có chắc muốn xóa mã giảm giá này
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
              onClick={() => handleDisableDiscount(idToDelete)}
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

      {loading && <LoadingScreen />}
    </>
  );
};

export default VoucherManagement;
