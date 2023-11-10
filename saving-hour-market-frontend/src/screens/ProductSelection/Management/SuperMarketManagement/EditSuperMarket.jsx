import React, { useRef, useState } from "react";
import "./CreateSuperMarket.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditSuperMarket = ({
  handleClose,
  supermarket,
  setSuperMarketList,
  setTotalPage,
  searchValue,
  setOpenSnackbar,
  page,
  setError,
  openSnackbar,
}) => {
  const [addressList, setAddressList] = useState(
    supermarket.supermarketAddressList
  );
  const [name, setName] = useState(supermarket.name);
  const [phone, setPhone] = useState(supermarket.phone);
  const [loading, setLoading] = useState(false);
  const handleEdit = async () => {
    if (!name) {
      setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
      setError("Vui lòng không để trống tên");
      return;
    }
    if (!phone) {
      setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
      setError("Vui lòng không để trống số điện thoại");
      return;
    }
    if (
      !/^[(]{0,1}[0-9]{3}[)]{0,1}[-s.]{0,1}[0-9]{3}[-s.]{0,1}[0-9]{4}$/.test(
        phone
      )
    ) {
      setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
      setError("Số điện thoại không hợp lệ");
      return;
    }

    const submitSupermarket = {
      name: name,
      phone: phone,
    };
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/supermarket/updateInfo?supermarketId=${supermarket.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify(submitSupermarket),
      }
    )
      .then((res) => res.json())
      .then((respond) => {
        if (respond?.code === 422) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setError("Tên siêu thị đã tồn tại");
          setLoading(false);
          return;
        }
        if (respond?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setError(respond.error);
          setLoading(false);
          return;
        }
        fetch(
          `${API.baseURL}/api/supermarket/getSupermarketForStaff?page=${
            page - 1
          }&limit=6&name=${searchValue}`,
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
            setSuperMarketList(data.supermarketList);
            setTotalPage(data.totalPage);
            handleClose();
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setError("Chỉnh sửa thành công");
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      className={`modal__container ${
        addressList.length >= 3 ? "modal-scroll" : ""
      }`}
    >
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Sửa siêu thị</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div className={`modal__container-body `}>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên siêu thị
          </h4>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên siêu thị"
              type="text"
              className="modal__container-body-inputcontrol-input"
            />
            {/* {error.errName && (
            <p
              style={{ fontSize: "14px", marginBottom: "-10px" }}
              className="text-danger"
            >
              {error.errName}
            </p>
          )} */}
          </div>
        </div>

        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Số điện thoại
          </h4>
          <div>
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              placeholder="Nhập số điện thoại"
              type="text"
              className="modal__container-body-inputcontrol-input"
            />
            {/* {error.errPhone && (
            <p
              style={{ fontSize: "14px", marginBottom: "-10px" }}
              className="text-danger"
            >
              {error.errPhone}
            </p>
          )} */}
          </div>
        </div>

        {addressList.map((item, i) => {
          return (
            <>
              <div onClick={() => {}} className="button__add">
                Chi nhánh {i + 1}
              </div>
              <div className="modal__container-body-inputcontrol input-address">
                <div className="modal__container-body-inputcontrol-label-icon">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Chi nhánh {i + 1}
                  </h4>
                </div>

                <div>
                  <input
                    disabled
                    style={{ paddingRight: 20 }}
                    value={item.address}
                    placeholder="Nhập địa chỉ"
                    type="text"
                    className="modal__container-body-inputcontrol-input"
                  />
                </div>
              </div>
              <div className="modal__container-body-inputcontrol input-address">
                <div className="modal__container-body-inputcontrol-label-icon">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Điểm giao hàng liên kết
                  </h4>
                </div>

                <div>
                  <input
                    disabled
                    style={{ paddingRight: 20 }}
                    value={item.pickupPoint.address}
                    placeholder="Nhập địa chỉ"
                    type="text"
                    className="modal__container-body-inputcontrol-input"
                  />
                </div>
              </div>
            </>
          );
        })}
      </div>
      {/* ********************** */}

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
            onClick={handleEdit}
            className="modal__container-footer-buttons-create"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
      {/* *********************** */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default EditSuperMarket;
