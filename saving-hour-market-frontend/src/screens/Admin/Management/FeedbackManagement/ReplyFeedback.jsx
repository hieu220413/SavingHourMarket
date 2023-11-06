import React, { useState } from "react";
import "./ReplyFeedback.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarO } from "@fortawesome/free-regular-svg-icons";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ReplyFeedback = ({
  item,
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setFeedbackList,
  selectedFeedbackObject,
  page,
  setTotalPage,
  isSwitchRecovery,
}) => {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [openReplySnackbar, setOpenReplySnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
    text: "",
  });
  const { vertical, horizontal } = openReplySnackbar;
  const handleCloseSnackbar = () => {
    setOpenReplySnackbar({ ...openSnackbar, open: false });
  };
  let stars = [];

  for (let x = 1; x <= 5; x++) {
    stars.push(
      <FontAwesomeIcon
        key={x}
        icon={x <= item?.rate ? faStar : faStarO}
        color="rgb(255,194,26)"
        size={18}
        style={{ marginHorizontal: 2 }}
      />
    );
  }

  const handleReply = async () => {
    if (reply === "") {
      setOpenReplySnackbar({
        ...openReplySnackbar,
        open: true,
        text: "Vui lòng không để trống nội dung trả lời",
      });
      return;
    }
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/feedback/reply?feedbackId=${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify({
        responseMessage: reply,
      }),
    })
      .then((res) => res.json())
      .then((respond) => {
        if (respond?.error) {
          setOpenReplySnackbar({
            ...openReplySnackbar,
            open: true,
            severity: "error",
            text: respond.error,
          });

          setLoading(false);
          return;
        }
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
            console.log(respond);
            if (respond.code === 404) {
              setFeedbackList([]);
            } else {
              setFeedbackList(respond);
              setTotalPage(respond.totalPage);
            }

            handleClose();
            setLoading(false);
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
              text: "Trả lời thành công thành công",
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={`modal__container modal-scroll`}>
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Trả lời góp ý</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      {/* modal body */}
      <div className={`modal__container-body `}>
        <div className="replyfeedback__title">
          <p>Tên người dùng: {item.customer.fullName}</p>
          <p>Mục đích: {item.object === "COMPLAIN" && "Đóng góp"}</p>
          <p>Nội dung: {item.message}</p>
          <p>Đánh giá: {stars}</p>
          {item.imageUrls.length !== 0 && (
            <>
              <p>Hình ảnh :</p>
              <div className="replyfeedback__title-listimg">
                {item.imageUrls.map((img, i) => (
                  <div key={i} className="replyfeedback__title-listimg-item">
                    <img src={img.url} alt="" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="replyfeedback__reply">
          <h3>Trả lời</h3>
          <textarea
            style={{ height: 300, width: "100%" }}
            className="modal__container-body-inputcontrol-input textareaFocus"
            placeholder="Nội dung trả lời"
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
            }}
          ></textarea>
        </div>
      </div>
      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button
            onClick={handleClose}
            className="modal__container-footer-buttons-close"
          >
            Đóng
          </button>
          <button
            onClick={handleReply}
            className="modal__container-footer-buttons-create"
          >
            Trả lời
          </button>
        </div>
      </div>
      {/* *********************** */}
      <Snackbar
        open={openReplySnackbar.open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openReplySnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openReplySnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default ReplyFeedback;
