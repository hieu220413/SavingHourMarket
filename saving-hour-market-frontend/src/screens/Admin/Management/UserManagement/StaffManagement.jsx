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
import CreateStaff from "./CreateStaff";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import EditStaff from "./EditStaff";
import Empty from "../../../../assets/Empty.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { onValue, update, ref, set, get, child } from "firebase/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StaffManagement = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [staffList, setStaffList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);

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

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const userState = useAuthState(auth);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${API.baseURL}/api/staff/getStaffForAdmin?page=${
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
            setStaffList(respond.staffList);
            setTotalPage(respond.totalPage);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };

    fetchStaff();
  }, [page, searchValue, isSwitchRecovery, userState[1]]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchValue(textSearch);
    setPage(1);
  };

  const StaffItem = ({ staff, index }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const handleOpenEditDialog = () => setOpenEditDialog(true);
    const handleCloseEditDialog = () => setOpenEditDialog(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleDelete = async () => {
      setLoading(true);
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/staff/updateStaffAccountStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          accountId: staff.id,
          enableDisableStatus: "DISABLE",
        }),
      })
        .then((res) => res.json())
        .then((respond) => {
          if (respond.code === 403) {
            console.log("a");
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Tài khoản hiện vẫn còn công việc chưa hoàn thành !",
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
          get(child(ref(database), "isDisableStaff")).then((snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
              if (data === 0) {
                set(ref(database, "isDisableStaff"), 1);
              } else {
                set(ref(database, "isDisableStaff"), 0);
              }
            }
          });

          fetch(
            `${API.baseURL}/api/staff/getStaffForAdmin?page=${
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
              setStaffList(respond.staffList);
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
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/staff/updateStaffAccountStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          accountId: staff.id,
          enableDisableStatus: "ENABLE",
        }),
      })
        .then((res) => res.json())
        .then((respond) => {
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
            `${API.baseURL}/api/staff/getStaffForAdmin?page=${
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
              setStaffList(respond.staffList);
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
      <tr key={staff.id} className="table-body-row">
        <td>{index + 1}</td>
        <td>{staff.fullName}</td>
        <td>{staff.email}</td>
        <td>{staff.role}</td>
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
              {staff.role === "ADMIN" ? (
                <></>
              ) : (
                <>
                  <i
                    onClick={handleOpenEditDialog}
                    class={`bi bi-pencil-square`}
                  ></i>
                  <i
                    onClick={handleOpenDeleteDialog}
                    class="bi bi-trash-fill"
                  ></i>
                </>
              )}
            </>
          )}
        </td>
        <Dialog aria-labelledby="customized-dialog-title" open={openEditDialog}>
          <EditStaff
            staff={staff}
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
            handleClose={handleCloseEditDialog}
            setStaffList={setStaffList}
            searchValue={searchValue}
            page={page}
            setTotalPage={setTotalPage}
          />
        </Dialog>
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

  return (
    <div className="user__container">
      <h3 className="user__title">Tài khoản nhân viên</h3>
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

        {!isSwitchRecovery && (
          <div onClick={handleOpenCreateDialog} className="user__header-button">
            <FontAwesomeIcon icon={faPlus} />
            Thêm nhân viên
          </div>
        )}
      </div>
      {/* data table + pagination*/}
      <div className="table__container">
        {/* data table */}
        <table class="table ">
          {staffList.length !== 0 && (
            <>
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((item, index) => (
                  <StaffItem staff={item} index={index} />
                ))}
              </tbody>
            </>
          )}

          {staffList.length === 0 && (
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
              ? "Tài khoản tồn tại"
              : "Tài khoản đã vô hiệu hóa"}
            <FontAwesomeIcon
              icon={isSwitchRecovery ? faClipboard : faTrashCanArrowUp}
            />
          </button>
        </div>

        {/* pagination */}
        {staffList.length !== 0 && (
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
      <Dialog
        onClose={handleCloseCreateDialog}
        aria-labelledby="customized-dialog-title"
        open={openCreateDialog}
      >
        <CreateStaff
          setOpenSnackbar={setOpenSnackbar}
          openSnackbar={openSnackbar}
          handleClose={handleCloseCreateDialog}
          setStaffList={setStaffList}
          searchValue={searchValue}
          page={page}
          setTotalPage={setTotalPage}
          isSwitchRecovery={isSwitchRecovery}
        />
      </Dialog>
    </div>
  );
};

export default StaffManagement;
