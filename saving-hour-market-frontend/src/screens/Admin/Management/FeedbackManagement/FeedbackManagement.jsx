import React, { useEffect, useState } from "react";
import "./FeedbackManagement.scss";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import {
  faCaretDown,
  faClipboard,
  faTrashCanArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Empty from "../../../../assets/Empty.png";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { Autocomplete, Dialog, TextField } from "@mui/material";
import ReplyFeedback from "./ReplyFeedback";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FeedbackManagement = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);
  const [openFeedbackObject, setOpenFeedbackObject] = useState(false);
  const [selectedFeedbackObject, setSelectedFeedbackObject] = useState({
    label: "Tất cả",
    value: "",
  });
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

  const userState = useAuthState(auth);
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth.currentUser.getIdToken();
        fetch(
          `${API.baseURL}/api/feedback/getFeedbackForStaff?page=${
            page - 1
          }&limit=6${
            isSwitchRecovery
              ? "&feedbackStatus=COMPLETED"
              : "&feedbackStatus=PROCESSING"
          }&feedbackObject=${selectedFeedbackObject.value}`,
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
            if (respond.code === 404) {
              setFeedbackList([]);
              setLoading(false);
              return;
            }
            setFeedbackList(respond);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchStaff();
  }, [page, isSwitchRecovery, selectedFeedbackObject, userState[1]]);

  const FeedbackItem = ({ item, index }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const handleOpenEditDialog = () => setOpenEditDialog(true);
    const handleCloseEditDialog = () => setOpenEditDialog(false);
    return (
      <tr key={index} className="table-body-row">
        <td>{index + 1}</td>
        <td>{item.customer.fullName}</td>
        <td>{item.message}</td>
        <td>
          {item.object === "COMPLAIN" && "Đóng góp"}
          {item.object === "QUESTION" && "Câu hỏi"}
          {item.object === "OTHER" && "Khác"}
          {item.object === "ORDER" && "Đơn hàng"}
          {item.object === "PACKAGE" && "Đóng gói"}
          {item.object === "DELIVERY" && "Giao hàng"}
        </td>
        <td>
          {isSwitchRecovery ? (
            <i class="bi bi-check-circle-fill"></i>
          ) : (
            <>
              <i onClick={handleOpenEditDialog} class="bi bi-reply-fill"></i>
            </>
          )}
        </td>
        <Dialog
          onClose={handleCloseEditDialog}
          aria-labelledby="customized-dialog-title"
          open={openEditDialog}
        >
          <ReplyFeedback
            item={item}
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
            handleClose={handleCloseEditDialog}
            setFeedbackList={setFeedbackList}
            selectedFeedbackObject={selectedFeedbackObject}
            page={page}
            setTotalPage={setTotalPage}
            isSwitchRecovery={isSwitchRecovery}
          />
        </Dialog>
      </tr>
    );
  };

  const feebackObjectList = [
    { label: "Đóng góp", value: "COMPLAIN" },
    { label: "Câu hỏi", value: "QUESTION" },
    { label: "Đơn hàng", value: "ORDER" },
    { label: "Đóng gói", value: "PACKAGE" },
    { label: "Giao hàng", value: "DELIVERY" },
    { label: "Khác", value: "OTHER" },
    { label: "Tất cả", value: "" },
  ];

  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <div className="feedback__container">
        <div className="feedback__select">
          <h3 className="feedback__select-label">Mục đích :</h3>
          <div
            onClick={() => {
              setOpenFeedbackObject(!openFeedbackObject);
            }}
            className="feedback__select-button"
          >
            <h3 className="feedback__select-button-label">
              {selectedFeedbackObject.label}
            </h3>
            <FontAwesomeIcon icon={faCaretDown} />
            {openFeedbackObject && (
              <div className="feedback__select-dropdown">
                {feebackObjectList.map((item, i) => (
                  <p
                    onClick={() => {
                      setSelectedFeedbackObject(item);
                      setOpenFeedbackObject(!openFeedbackObject);
                    }}
                    key={i}
                  >
                    {item.label}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* data table + pagination*/}
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            {feedbackList.length !== 0 && (
              <>
                <thead>
                  <tr className="table-header-row">
                    <th>No.</th>
                    <th>Tên người dùng</th>
                    <th>Nội dung</th>
                    <th>Mục đích </th>
                    <th>Trả lời</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((item, index) => (
                    <FeedbackItem item={item} index={index} />
                  ))}
                </tbody>
              </>
            )}

            {feedbackList.length === 0 && (
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
                  Không có đánh giá nào
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
              {isSwitchRecovery ? "Góp ý đã trả lời" : "Góp ý chưa trả lời"}
              <FontAwesomeIcon
                icon={isSwitchRecovery ? faClipboard : faTrashCanArrowUp}
              />
            </button>
          </div>

          {/* pagination */}
          {feedbackList.length !== 0 && (
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

export default FeedbackManagement;
