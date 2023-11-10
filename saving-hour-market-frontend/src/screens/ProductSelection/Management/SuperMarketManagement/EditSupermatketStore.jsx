import {
  faCaretDown,
  faCircleMinus,
  faPlusCircle,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { API } from "../../../../contanst/api";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditSupermatketStore = ({
  handleClose,
  stores,
  supermarketId,
  page,
  setTotalPage,
  setSuperMarketList,
  searchValue,
  setOpenSuccessSnackbar,
  openSuccessSnackbar,
  setCurrentStores,
  store,
}) => {
  const [address, setAddress] = useState({
    isFocused: false,
    selectAddress: store.address,
    searchAddress: store.address,
    errorAddress: "",
  });
  const [pickupPointSelected, setPickupPointSelected] = useState(
    store.pickupPoint
  );
  const [isActiveDropdownPickupPoint, setIsActiveDropdownPickupPoint] =
    useState(false);
  const [locationData, setLocationData] = useState([]);
  const [error, setError] = useState("");
  const [pickupPointList, setPickupPointList] = useState([]);

  const typingTimeoutRef = useRef(null);
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPickupPoint = async () => {
      fetch(`${API.baseURL}/api/pickupPoint/getAll`)
        .then((res) => res.json())
        .then((res) => {
          setPickupPointList(res);
        })
        .catch((err) => console.log(err));
    };
    fetchPickupPoint();
  }, []);

  const handleEdit = async () => {
    if (!address.selectAddress) {
      setAddress({ ...address, errorAddress: "Địa chỉ không hợp lệ" });
      return;
    }

    if (!pickupPointSelected) {
      setError("Vui lòng chọn điểm giao hàng");
      return;
    }

    // const addressDuplicated = stores.some(
    //   (item) => item.address === address.selectAddress
    // );

    // if (addressDuplicated) {
    //   setOpenSnackbar({
    //     ...openSnackbar,
    //     open: true,
    //     severity: "error",
    //     text: "Địa chỉ đã tồn tại",
    //   });
    //   return;
    // }

    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/supermarket/updateSupermarketAddressForSupermarket?supermarketAddressId=${store.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          address: address.selectAddress,
          pickupPointId: pickupPointSelected.id,
        }),
      }
    )
      .then((res) => res.json())
      .then((respond) => {
        if (respond.code === 422) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
            text: "Địa chỉ đã tồn tại",
          });
          return;
        }
        setCurrentStores(respond.supermarketAddressList);
        fetch(
          `${API.baseURL}/api/supermarket/getSupermarketForStaff?page=${
            page - 1
          }&limit=6&name=${searchValue}&status=ENABLE`,
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
            setSuperMarketList(respond.supermarketList);
            setTotalPage(respond.totalPage);
            handleClose();
            setOpenSuccessSnackbar({
              ...openSuccessSnackbar,
              open: true,
              severity: "success",
              text: "Sửa chi nhánh thành công",
            });
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={`modal__container `}>
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chỉnh sửa chi nhánh</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      {/* modal body */}
      <div
        style={{ height: "30vh", display: "flex", justifyContent: "center" }}
        className={`modal__container-body `}
      >
        <div className="modal__container-body-inputcontrol input-address">
          <div className="modal__container-body-inputcontrol-label-icon">
            <h4 className="modal__container-body-inputcontrol-label">
              Chi nhánh
            </h4>
          </div>

          <div>
            <input
              style={{ paddingRight: 20 }}
              value={address.searchAddress}
              onChange={(e) => {
                setAddress({
                  ...address,
                  searchAddress: e.target.value,
                  selectAddress: "",
                  errorAddress: "",
                });

                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                  fetch(
                    `https://rsapi.goong.io/Place/AutoComplete?api_key=${API.GoongAPIKey}&limit=4&input=${address.searchAddress}`
                  )
                    .then((res) => res.json())
                    .then((respond) => {
                      if (!respond.predictions) {
                        setLocationData([]);
                        return;
                      }
                      setLocationData(respond.predictions);
                    })
                    .catch((err) => console.log(err));
                }, 400);
              }}
              onFocus={() => {
                setLocationData([]);
                setAddress({ ...address, isFocused: true });
              }}
              placeholder="Nhập địa chỉ"
              type="text"
              className="modal__container-body-inputcontrol-input"
            />
            {address.errorAddress && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {address.errorAddress}
              </p>
            )}
            {address.searchAddress && (
              <FontAwesomeIcon
                onClick={() => {
                  setAddress({
                    ...address,
                    searchAddress: "",
                    selectAddress: "",
                  });
                }}
                className="input-icon-x"
                icon={faX}
              />
            )}

            {address.isFocused && locationData.length !== 0 && (
              <div className={`suggest-location `}>
                {locationData.map((data) => (
                  <div
                    onClick={() => {
                      setAddress({
                        ...address,
                        isFocused: false,
                        searchAddress: data.description,
                        selectAddress: data.description,
                        errorAddress: "",
                      });
                    }}
                    className="suggest-location-item"
                  >
                    <h4>{data.description}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Điểm giao hàng liên kết
          </h4>
          <div>
            <div style={{ display: "flex" }}>
              <div
                style={{ width: "401px", marginRight: "-2px" }}
                className="dropdown"
              >
                <div
                  className="dropdown-btn"
                  onClick={(e) => {
                    setIsActiveDropdownPickupPoint(
                      !isActiveDropdownPickupPoint
                    );
                  }}
                >
                  {pickupPointSelected
                    ? pickupPointSelected.address
                    : "Chọn điểm giao hàng"}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>

                {isActiveDropdownPickupPoint && (
                  <div
                    style={{ height: "120px", overflowY: "scroll" }}
                    className="dropdown-content"
                  >
                    {pickupPointList.map((item, num) => (
                      <div
                        onClick={(e) => {
                          setPickupPointSelected(item);
                          setIsActiveDropdownPickupPoint(false);
                          setError("");
                        }}
                        className="dropdown-item"
                        key={num}
                      >
                        {item.address}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {error && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error}
              </p>
            )}
          </div>
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
            onClick={handleEdit}
            className="modal__container-footer-buttons-create"
          >
            Thêm
          </button>
        </div>
      </div>
      {/* *********************** */}
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

export default EditSupermatketStore;
