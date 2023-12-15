import {
  faClipboard,
  faMagnifyingGlass,
  faPlus,
  faTrashCanArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, database } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { Dialog } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import Empty from "../../../../assets/Empty.png";
import { useLocation } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { child, get, ref } from "firebase/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomerManagement = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [customerList, setCustomerList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
    text: "",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const userState = useAuthState(auth);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();

        fetch(
          `${API.baseURL}/api/customer/getCustomerForAdmin?page=${
            page - 1
          }&limit=6&name=${searchValue}${
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
          .then((respond) => {
            setCustomerList(respond.customerList);
            setTotalPage(respond.totalPage);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };

    fetchCustomer();
  }, [page, searchValue, isSwitchRecovery, userState[1]]);

  const CustomerItem = ({ customer, index }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleDelete = async () => {
      setLoading(true);
      // let isSystemDisable = true;
      // await get(child(ref(database), "systemStatus")).then((snapshot) => {
      //   const data = snapshot.val();
      //   if (data !== null) {
      //     if (data === 1) {
      //       setOpenSnackbar({
      //         ...openSnackbar,
      //         open: true,
      //         severity: "error",
      //         text: "Hệ thống không trong trạng thái bảo trì !",
      //       });
      //       isSystemDisable = false;
      //     }
      //   }
      // });
      // if (!isSystemDisable) {
      //   setLoading(false);
      //   return;
      // }
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/customer/updateCustomerAccountStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          accountId: customer.id,
          enableDisableStatus: "DISABLE",
        }),
      })
        .then((res) => res.json())
        .then((respond) => {
          console.log(respond);
          if (respond.code === 409) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Hệ thống không trong trạng thái bảo trì !",
            });

            setLoading(false);
            return;
          }
          if (respond.code === 403) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Tài khoản này hiện đang có đơn hàng chưa hoàn thành",
            });

            setLoading(false);
            return;
          }
          if (respond.code === 404) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Tài khoản không tồn tại",
            });

            setLoading(false);
            return;
          }
          if (respond?.error) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: respond.error,
            });

            setLoading(false);
            return;
          }
          fetch(
            `${API.baseURL}/api/customer/getCustomerForAdmin?page=${
              page - 1
            }&limit=6&name=${searchValue}${
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
            .then((respond) => {
              console.log(respond);
              setCustomerList(respond.customerList);
              setTotalPage(respond.totalPage);
              handleCloseDeleteDialog();
              setLoading(false);
              setOpenSnackbar({
                ...openSnackbar,
                open: true,
                severity: "success",
                text: "Vô hiệu hóa thành công",
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };

    const handleReverse = async () => {
      setLoading(true);
      // let isSystemDisable = true;
      // await get(child(ref(database), "systemStatus")).then((snapshot) => {
      //   const data = snapshot.val();
      //   if (data !== null) {
      //     if (data === 1) {
      //       setOpenSnackbar({
      //         ...openSnackbar,
      //         open: true,
      //         severity: "error",
      //         text: "Hệ thống không trong trạng thái bảo trì !",
      //       });
      //       isSystemDisable = false;
      //     }
      //   }
      // });
      // if (!isSystemDisable) {
      //   setLoading(false);
      //   return;
      // }
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/customer/updateCustomerAccountStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          accountId: customer.id,
          enableDisableStatus: "ENABLE",
        }),
      })
        .then((res) => res.json())
        .then((respond) => {
          console.log(respond);
          if (respond.code === 409) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Hệ thống không trong trạng thái bảo trì !",
            });

            setLoading(false);
            return;
          }
          if (respond.code === 403) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Tài khoản này hiện đang có đơn hàng chưa hoàn thành",
            });

            setLoading(false);
            return;
          }
          if (respond.code === 404) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Tài khoản không tồn tại",
            });

            setLoading(false);
            return;
          }
          if (respond?.error) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: respond.error,
            });

            setLoading(false);
            return;
          }
          fetch(
            `${API.baseURL}/api/customer/getCustomerForAdmin?page=${
              page - 1
            }&limit=6&name=${searchValue}${
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
            .then((respond) => {
              console.log(respond);
              setCustomerList(respond.customerList);
              setTotalPage(respond.totalPage);
              handleCloseDeleteDialog();
              setLoading(false);
              setOpenSnackbar({
                ...openSnackbar,
                open: true,
                severity: "success",
                text: "Phục hồi thành công",
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };

    return (
      <tr className="table-body-row">
        <td>{index + 1}</td>
        <td>{customer.fullName}</td>
        <td>{customer.email}</td>
        <td>{customer.phone ? customer.phone : "Chưa có"}</td>
        <td>
          {isSwitchRecovery ? (
            <i
              onClick={() => {
                handleReverse();
              }}
              class="bi bi-arrow-repeat"
            ></i>
          ) : (
            <>
              <i onClick={handleOpenDeleteDialog} class="bi bi-trash-fill"></i>
            </>
          )}
        </td>
        <Dialog
          onClose={handleCloseDeleteDialog}
          aria-labelledby="customized-dialog-title"
          open={openDeleteDialog}
        >
          <div className="modal__container">
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">
                Vô hiệu hóa tài khoản
              </h3>
              <FontAwesomeIcon
                onClick={handleCloseDeleteDialog}
                icon={faXmark}
              />
            </div>
          </div>
          <div className="modal__container-body">
            <h4> Bạn có chắc muốn vô hiệu hóa tài khoản này</h4>
          </div>
          {/* modal footer */}
          <div className="modal__container-footer">
            <div className="modal__container-footer-buttons">
              <button
                onClick={handleCloseDeleteDialog}
                className="modal__container-footer-buttons-close"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleDelete();
                }}
                className="modal__container-footer-buttons-create"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Dialog>
      </tr>
    );
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchValue(textSearch);
    setPage(1);
  };

  return (
    <div style={{ marginBottom: 50 }} className="user__container">
      <h3 className="user__title">Tài khoản khách hàng</h3>
      <div className="user__header">
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
      </div>

      {/* data table + pagination*/}
      <div className="table__container table-box-shadow">
        {/* data table */}
        <table class="table ">
          {customerList.length !== 0 && (
            <>
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Sđt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customerList.map((item, index) => (
                  <CustomerItem customer={item} index={index} />
                ))}
              </tbody>
            </>
          )}
          {customerList.length === 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "350px", height: "350px" }}
                  src={Empty}
                  alt=""
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "grey",
                  fontSize: 24,
                }}
              >
                Không có tài khoản nào
              </p>
            </div>
          )}
        </table>
        {/* ********************** */}

        <div>
          <button
            onClick={() => {
              setPage(1);
              setIsSwitchRecovery(!isSwitchRecovery);
            }}
            className=" buttonRecovery"
          >
            {isSwitchRecovery
              ? "Danh sách tài khoản"
              : "Tài khoản đã vô hiệu hóa"}
            <FontAwesomeIcon
              icon={isSwitchRecovery ? faClipboard : faTrashCanArrowUp}
            />
          </button>
        </div>

        {/* pagination */}

        {customerList.length !== 0 && (
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
      {/* ***************** */}
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
          {openSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default CustomerManagement;
