import React, { useEffect, useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import Empty from "../../../../assets/Empty.png";
import {
  faClipboard,
  faMagnifyingGlass,
  faTrashCanArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase/firebase.config";
import { format } from "date-fns";
import TransactionDetail from "./TransactionDetail";
import { th } from "date-fns/locale";
import RefundTransactionDetail from "./RefundTransactionDetail";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RefundTransactionManagement = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefund, setIsRefund] = useState(false);
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
          `${
            API.baseURL
          }/api/transaction/getTransactionRequiredRefundForAdmin?page=${
            page - 1
          }&limit=6${isRefund ? "&isRefund=true" : "&isRefund=false"}`,
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
            if (respond?.code === 404 || respond.status === 500) {
              setLoading(false);
              return;
            }
            setTransactionList(respond.transactionList);
            setTotalPage(respond.totalPage);

            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchStaff();
  }, [page, userState[1], isRefund]);

  const TransactionItem = ({ item, index }) => {
    const [openTransactionDetail, setOpenTransactionDetail] = useState(false);
    const handleOpenTransactionDetail = () => setOpenTransactionDetail(true);
    const handleCloseTransactionDetail = () => setOpenTransactionDetail(false);

    const [openRefundTransactionDetail, setOpenRefundTransactionDetail] =
      useState(false);
    const handleOpenRefundTransactionDetail = () =>
      setOpenRefundTransactionDetail(true);
    const handleCloseRefundTransactionDetail = () =>
      setOpenRefundTransactionDetail(false);

    const [openRefundDialog, setOpenRefundDialog] = useState(false);
    const handleOpenRefundDialog = () => setOpenRefundDialog(true);
    const handleCloseRefundDialog = () => setOpenRefundDialog(false);

    const handleRefund = async () => {
      setLoading(true);
      const tokenId = await auth.currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/transaction/refundTransaction?transactionId=${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
        }
      )
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
            `${
              API.baseURL
            }/api/transaction/getTransactionRequiredRefundForAdmin?page=${
              page - 1
            }&limit=6${isRefund ? "&isRefund=true" : "&isRefund=false"}`,
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
              if (respond?.code === 404 || respond.status === 500) {
                setLoading(false);
                return;
              }
              setOpenSnackbar({
                ...openSnackbar,
                open: true,
                severity: "success",
                text: "Hoàn trả thành công",
              });
              setTransactionList(respond.transactionList);
              setTotalPage(respond.totalPage);

              setLoading(false);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };
    return (
      <tr className="table-body-row">
        <td>{index + 1}</td>
        <td>{item?.order?.receiverName}</td>
        <td>
          {format(new Date(item?.paymentTime.slice(0, 10)), "dd-MM-yyyy")}{" "}
          {item?.paymentTime.slice(11, 16)}h
        </td>
        <td>VNPAy</td>
        <td>
          {item?.amountOfMoney.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </td>
        {item.refundTransaction && (
          <td>
            <i
              onClick={handleOpenRefundTransactionDetail}
              class="bi bi-receipt"
            ></i>
          </td>
        )}

        <td>
          <i onClick={handleOpenTransactionDetail} class="bi bi-eye"></i>
          {!isRefund && (
            <i
              onClick={handleOpenRefundDialog}
              class="bi bi-credit-card-2-back-fill"
            ></i>
          )}
        </td>
        <Dialog
          onClose={handleCloseTransactionDetail}
          aria-labelledby="customized-dialog-title"
          open={openTransactionDetail}
        >
          <TransactionDetail
            refund={true}
            handleClose={handleCloseTransactionDetail}
            item={item}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseRefundTransactionDetail}
          aria-labelledby="customized-dialog-title"
          open={openRefundTransactionDetail}
        >
          <RefundTransactionDetail
            handleClose={handleCloseRefundTransactionDetail}
            transaction={item.refundTransaction}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseRefundDialog}
          aria-labelledby="customized-dialog-title"
          open={openRefundDialog}
        >
          <div className="modal__container">
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">
                Hoàn trả giao dịch
              </h3>
              <FontAwesomeIcon
                onClick={handleCloseRefundDialog}
                icon={faXmark}
              />
            </div>
          </div>
          <div className="modal__container-body">
            <h4>Xác nhận hoàn trả giao dịch</h4>
          </div>
          {/* modal footer */}
          <div className="modal__container-footer">
            <div className="modal__container-footer-buttons">
              <button
                onClick={handleCloseRefundDialog}
                className="modal__container-footer-buttons-close"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleRefund();
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

  const onSubmitSearch = (e) => {};

  return (
    <div style={{ marginBottom: 50 }} className="user__container">
      <h3 className="user__title">Giao dịch cần hoàn trả</h3>
      <div className="user__header">
        <div className="search"></div>
        {/* ****************** */}
      </div>
      {/* data table + pagination*/}
      <div className="table__container table-box-shadow">
        {/* data table */}
        <table class="table ">
          {transactionList.length !== 0 && (
            <>
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Tên người giao dịch</th>
                  <th>Thời điểm thanh toán</th>
                  <th>Phương thức</th>
                  <th>Tổng cộng</th>

                  {isRefund && !loading && <th>Giao dịch hoàn trả</th>}
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {transactionList.map((item, index) => (
                  <TransactionItem item={item} index={index} />
                ))}
              </tbody>
            </>
          )}

          {transactionList.length === 0 && (
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
                Không có giao dịch
              </p>
            </div>
          )}
        </table>
        {/* ********************** */}
        <div>
          <button
            onClick={() => {
              setPage(1);
              setIsRefund(!isRefund);
            }}
            className=" buttonRecovery"
          >
            {isRefund ? "Giao dịch chưa hoàn trả" : "Giao dịch đã hoàn trả"}
            <FontAwesomeIcon
              icon={isRefund ? faClipboard : faTrashCanArrowUp}
            />
          </button>
        </div>

        {/* pagination */}
        {transactionList.length !== 0 && (
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

export default RefundTransactionManagement;
