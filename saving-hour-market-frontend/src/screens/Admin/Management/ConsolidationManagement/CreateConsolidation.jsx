import {
  faCaretDown,
  faMinus,
  faPlus,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateConsolidation = ({
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setConsolidationList,
  page,
  setTotalPage,
}) => {
  const [address, setAddress] = useState({
    isFocused: false,
    selectAddress: "",
    searchAddress: "",
    long: "",
    lat: "",
    error: "",
  });
  const [locationData, setLocationData] = useState([]);
  const [pickupPointList, setPickupPointList] = useState([]);
  const typingTimeoutRef = useRef(null);
  const [selectPickupPointList, setSelectPickupPointList] = useState([
    {
      openDropdown: false,
      selectedPickupPoint: "",
      error: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [openValidateSnackbar, setOpenValidateSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
    text: "",
  });
  const { vertical, horizontal } = openValidateSnackbar;
  const handleCloseValidateSnackbar = () => {
    setOpenValidateSnackbar({ ...openValidateSnackbar, open: false });
  };

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const tokenId = await auth.currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/pickupPoint/getAllForStaff?enableDisableStatus=ENABLE`,
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

          setPickupPointList(respond);

          setLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchStaff();
  }, []);

  const handleCreate = async () => {
    if (!address.selectAddress) {
      setAddress({ ...address, error: "Địa chỉ không hợp lệ" });
      return;
    }
    const validateConsolidation = selectPickupPointList.findIndex(
      (item) => !item.selectedPickupPoint
    );
    if (validateConsolidation !== -1) {
      const newSelectedConsolidationList = [...selectPickupPointList];
      newSelectedConsolidationList[validateConsolidation] = {
        ...newSelectedConsolidationList[validateConsolidation],
        error: "Vui lòng chọn điểm giao hàng",
      };
      setSelectPickupPointList(newSelectedConsolidationList);
      return;
    }
    var valueArr = selectPickupPointList.map(function (item) {
      return item?.selectedPickupPoint?.id;
    });
    var isDuplicateStore = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });

    if (isDuplicateStore) {
      setOpenValidateSnackbar({
        ...openValidateSnackbar,
        open: true,
        severity: "error",
        text: "Có điểm giao hàng trùng nhau !",
      });
      return;
    }
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    const submitCreate = {
      address: address.selectAddress,
      longitude: address.long,
      latitude: address.lat,
      pickupPointIdList: selectPickupPointList.map(
        (item) => item.selectedPickupPoint.id
      ),
    };

    fetch(`${API.baseURL}/api/productConsolidationArea/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitCreate),
    })
      .then((res) => res.json())
      .then((respond) => {
        if (respond?.code === 422) {
          setOpenValidateSnackbar({
            ...openValidateSnackbar,
            open: true,
            severity: "error",
            text: "Điểm tập kết đã tồn tại !",
          });
          setLoading(false);
          return;
        }
        fetch(
          `${API.baseURL}/api/productConsolidationArea/getAllForAdmin?page=${
            page - 1
          }&limit=6&"&enableDisableStatus=ENABLE`,
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
            setConsolidationList(respond.productConsolidationAreaList);
            setTotalPage(respond.totalPage);
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
              text: "Tạo thành công !",
            });
            handleClose();
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      style={{ width: "630px" }}
      className={`modal__container  ${
        selectPickupPointList.length >= 6 ? "modal-scroll" : ""
      }`}
    >
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm điểm tập kết</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      <div
        className={`modal__container-body ${
          selectPickupPointList.length >= 6 && "modal-scroll"
        }`}
      >
        <div className="modal__container-body-inputcontrol input-address">
          <div className="modal__container-body-inputcontrol-label-icon">
            <h4 className="modal__container-body-inputcontrol-label">
              Địa chỉ :
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
                  error: "",
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
            {address.error && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {address.error}
              </p>
            )}
            {address.searchAddress && (
              <FontAwesomeIcon
                onClick={() => {
                  setAddress({
                    ...address,
                    searchAddress: "",
                    selectAddress: "",
                    isFocused: false,
                  });
                }}
                className="input-icon-x"
                icon={faX}
              />
            )}

            {address.isFocused && locationData.length !== 0 && (
              <div className="suggest-location">
                {locationData.map((data) => (
                  <div
                    onClick={() => {
                      fetch(
                        `https://rsapi.goong.io/Place/Detail?place_id=${data.place_id}&api_key=${API.GoongAPIKey}`
                      )
                        .then((res) => res.json())
                        .then(async (respond) => {
                          setAddress({
                            isFocused: false,
                            searchAddress: data.description,
                            selectAddress: data.description,
                            long: respond.result.geometry.location.lng,
                            lat: respond.result.geometry.location.lat,
                            error: "",
                          });
                        })
                        .catch((err) => console.log(err));
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
        {selectPickupPointList.map((mainItem, mainIndex) => (
          <div className="modal__container-body-inputcontrol">
            {selectPickupPointList.length !== 1 && (
              <div
                onClick={() => {
                  setSelectPickupPointList(
                    selectPickupPointList.filter((data) => data !== mainItem)
                  );
                }}
                className="button__minus"
              >
                <FontAwesomeIcon icon={faMinus} />
              </div>
            )}
            <h4 className="modal__container-body-inputcontrol-label">
              Điểm giao hàng {mainIndex + 1}
            </h4>
            <div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{ width: 402, marginRight: "-2px" }}
                  className="dropdown"
                >
                  <div
                    className="dropdown-btn"
                    onClick={(e) => {
                      const newPickuppointList = selectPickupPointList.map(
                        (data, i) => {
                          if (i === mainIndex) {
                            return {
                              ...data,
                              openDropdown: !data.openDropdown,
                            };
                          }
                          return data;
                        }
                      );
                      setSelectPickupPointList(newPickuppointList);
                    }}
                  >
                    {mainItem.selectedPickupPoint
                      ? mainItem.selectedPickupPoint.address
                      : "Chọn điểm giao hàng"}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {mainItem.openDropdown && (
                    <div
                      style={{ height: "140px", overflowY: "scroll" }}
                      className="dropdown-content"
                    >
                      {pickupPointList.map((item, index) => (
                        <div
                          onClick={(e) => {
                            const newPickuppointList =
                              selectPickupPointList.map((data, i) => {
                                if (i === mainIndex) {
                                  return {
                                    selectedPickupPoint: item,
                                    openDropdown: !data.openDropdown,
                                    error: "",
                                  };
                                }
                                return data;
                              });
                            setSelectPickupPointList(newPickuppointList);
                          }}
                          className="dropdown-item"
                          key={index}
                        >
                          {item.address}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {mainItem.error && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {mainItem.error}
                </p>
              )}
            </div>
          </div>
        ))}
        <div
          onClick={() => {
            if (pickupPointList.length === selectPickupPointList.length) {
              setOpenValidateSnackbar({
                ...openValidateSnackbar,
                open: true,
                text: `Số lượng điểm giao hàng hiện tại là ${pickupPointList.length} ! Không thể tạo thêm`,
                severity: "error",
              });
              return;
            }
            setSelectPickupPointList([
              ...selectPickupPointList,
              {
                openDropdown: false,
                selectedPickupPoint: "",
              },
            ]);
          }}
          className="button__add"
        >
          Thêm điểm giao hàng <FontAwesomeIcon icon={faPlus} />
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
            onClick={handleCreate}
            className="modal__container-footer-buttons-create"
          >
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
      <Snackbar
        open={openValidateSnackbar.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseValidateSnackbar}
      >
        <Alert
          onClose={handleCloseValidateSnackbar}
          severity={openValidateSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openValidateSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default CreateConsolidation;
