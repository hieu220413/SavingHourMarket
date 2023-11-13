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
import "./PickuppointManagement.scss";
import Empty from "../../../../assets/Empty.png";
import { Dialog } from "@mui/material";
import CreatePickuppoint from "./CreatePickuppoint";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { auth } from "../../../../firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import PickupPointConsolidation from "./PickupPointConsolidation";
import EditPickuppoint from "./EditPickuppoint";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const PickuppointManagement = () => {
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [pickupPointList, setPickupPointList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);
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
    const fetchStaff = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();

        fetch(
          `${API.baseURL}/api/pickupPoint/getAllForAdmin?page=${
            page - 1
          }&limit=6&${
            isSwitchRecovery
              ? "&enableDisableStatus=DISABLE"
              : "&enableDisableStatus=ENABLE"
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
            if (respond?.code === 404 || respond.status === 500) {
              setLoading(false);
              return;
            }
            setPickupPointList(respond.pickupPointList);
            setTotalPage(respond.totalPage);

            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchStaff();
  }, [page, isSwitchRecovery, userState[1]]);

  const menuTabs = [
    {
      display: "Tài khoản",
      to: "/usermanagement",
    },
    {
      display: "Góp ý",
      to: "/feedbackmanagement",
    },
    {
      display: "Điểm giao hàng",
      to: "/pickuppointmanagement",
    },
    {
      display: "Giao dịch",
      to: "/transactionmanagement",
    },
    {
      display: "Khung giờ",
      to: "/timeframemanagement",
    },
    {
      display: "Điểm tập kết",
      to: "/consolidationmanagement",
    },
  ];

  const PickupPointItem = ({ item, index }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const handleOpenEditDialog = () => setOpenEditDialog(true);
    const handleCloseEditDialog = () => setOpenEditDialog(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const [openConsolidationDialog, setOpenConsolidationDialog] =
      useState(false);
    const handleOpenConsolidationDialog = () =>
      setOpenConsolidationDialog(true);
    const handleCloseConsolidationDialog = () =>
      setOpenConsolidationDialog(false);

    const handleDelete = async () => {
      setLoading(true);
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/pickupPoint/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          id: item.id,
          enableDisableStatus: "DISABLE",
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
            `${API.baseURL}/api/pickupPoint/getAllForAdmin?page=${
              page - 1
            }&limit=6&${
              isSwitchRecovery
                ? "&enableDisableStatus=DISABLE"
                : "&enableDisableStatus=ENABLE"
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
              setPickupPointList(respond.pickupPointList);
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
      fetch(`${API.baseURL}/api/pickupPoint/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          id: item.id,
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
            `${API.baseURL}/api/pickupPoint/getAllForAdmin?page=${
              page - 1
            }&limit=6&${
              isSwitchRecovery
                ? "&enableDisableStatus=DISABLE"
                : "&enableDisableStatus=ENABLE"
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
              setPickupPointList(respond.pickupPointList);
              setTotalPage(respond.totalPage);
              handleCloseDeleteDialog();
              setLoading(false);
              setOpenSnackbar({
                ...openSnackbar,
                open: true,
                severity: "success",
                text: "Khôi phục thành công",
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };
    return (
      <tr key={index} className="table-body-row">
        <td>{index + 1}</td>
        <td>{item.address}</td>
        <td>
          <i
            onClick={() => {
              handleOpenConsolidationDialog();
            }}
            className="bi bi-eye"
          ></i>
        </td>
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
              <i onClick={handleOpenEditDialog} class="bi bi-pencil-square"></i>
              <i onClick={handleOpenDeleteDialog} class="bi bi-trash-fill"></i>
            </>
          )}
        </td>
        <Dialog
          onClose={handleCloseEditDialog}
          aria-labelledby="customized-dialog-title"
          open={openEditDialog}
        >
          <EditPickuppoint
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
            handleClose={handleCloseEditDialog}
            setPickupPointList={setPickupPointList}
            searchValue={searchValue}
            page={page}
            setTotalPage={setTotalPage}
            pickupPoint={item}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseConsolidationDialog}
          aria-labelledby="customized-dialog-title"
          open={openConsolidationDialog}
        >
          <PickupPointConsolidation
            consolidationList={item.productConsolidationAreaList}
            handleClose={handleCloseConsolidationDialog}
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
                Vô hiệu hóa điểm giao hàng
              </h3>
              <FontAwesomeIcon
                onClick={handleCloseDeleteDialog}
                icon={faXmark}
              />
            </div>
          </div>
          <div className="modal__container-body">
            <h4> Bạn có chắc muốn vô hiệu hóa điểm giao hàng này</h4>
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
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <div className="pickuppoint__container">
        <div className="pickuppoint__header">
          <div className="search"></div>
          {/* ****************** */}

          {!isSwitchRecovery && (
            <div
              onClick={handleOpenCreateDialog}
              className="pickuppoint__header-button"
            >
              <FontAwesomeIcon icon={faPlus} />
              Thêm điểm giao hàng
            </div>
          )}
        </div>
        {/* data table + pagination*/}
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            {pickupPointList.length !== 0 && (
              <>
                <thead>
                  <tr className="table-header-row">
                    <th>No.</th>
                    <th>Địa chỉ</th>
                    <th>Điểm tập kết</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pickupPointList.map((item, index) => (
                    <PickupPointItem item={item} index={index} />
                  ))}
                </tbody>
              </>
            )}

            {pickupPointList.length === 0 && (
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
                  Không có điểm giao hàng nào
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
                ? "Điểm giao hàng tồn tại"
                : "Điểm giao đã vô hiệu hóa"}
              <FontAwesomeIcon
                icon={isSwitchRecovery ? faClipboard : faTrashCanArrowUp}
              />
            </button>
          </div>

          {/* pagination */}
          {pickupPointList.length !== 0 && (
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
      </div>
      <Dialog
        onClose={handleCloseCreateDialog}
        aria-labelledby="customized-dialog-title"
        open={openCreateDialog}
      >
        <CreatePickuppoint
          setOpenSnackbar={setOpenSnackbar}
          openSnackbar={openSnackbar}
          handleClose={handleCloseCreateDialog}
          setPickupPointList={setPickupPointList}
          searchValue={searchValue}
          page={page}
          setTotalPage={setTotalPage}
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
          {openSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default PickuppointManagement;
