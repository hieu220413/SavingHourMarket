import React, { useEffect, useRef, useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faMinus,
  faPlusCircle,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";
import { auth, database } from "../../../../firebase/firebase.config";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { child, get, ref } from "firebase/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditPickuppoint = ({
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setPickupPointList,
  searchValue,
  page,
  setTotalPage,
  pickupPoint,
}) => {
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState([]);

  const [selectedConsolidationList, setSelectedConsolidationList] = useState(
    pickupPoint.productConsolidationAreaList.map((item) => {
      return {
        selectedConsolidation: item,
        openConsolidation: false,
        error: "",
      };
    })
  );
  const [address, setAddress] = useState({
    isFocused: false,
    selectAddress: pickupPoint.address,
    searchAddress: pickupPoint.address,
    long: pickupPoint.longitude,
    lat: pickupPoint.latitude,
    error: "",
  });
  const [consolidationList, setConsolidationList] = useState([]);

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
        `${API.baseURL}/api/productConsolidationArea/getAllForStaff?enableDisableStatus=ENABLE`,
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

          setConsolidationList(respond);

          setLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchStaff();
  }, []);

  const handleCreate = async () => {
    let isSystemDisable = true;
    await get(child(ref(database), "systemStatus")).then((snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        if (data === 1) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
            text: "Hệ thống không trong trạng thái bảo trì !",
          });
          isSystemDisable = false;
        }
      }
    });
    if (!isSystemDisable) {
      return;
    }
    if (!address.selectAddress) {
      setAddress({ ...address, error: "Địa chỉ không hợp lệ" });
      return;
    }
    const validateConsolidation = selectedConsolidationList.findIndex(
      (item) => !item.selectedConsolidation
    );
    if (validateConsolidation !== -1) {
      const newSelectedConsolidationList = [...selectedConsolidationList];
      newSelectedConsolidationList[validateConsolidation] = {
        ...newSelectedConsolidationList[validateConsolidation],
        error: "Vui lòng chọn điểm tập kết",
      };
      setSelectedConsolidationList(newSelectedConsolidationList);
      return;
    }
    var valueArr = selectedConsolidationList.map(function (item) {
      return item?.selectedConsolidation?.id;
    });
    var isDuplicateStore = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });

    if (isDuplicateStore) {
      setOpenValidateSnackbar({
        ...openValidateSnackbar,
        open: true,
        severity: "error",
        text: "Có điểm tập kết trùng nhau !",
      });
      return;
    }
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    const submitEdit = {
      address: address.selectAddress,
      longitude: address.long,
      latitude: address.lat,
    };
    // productConsolidationAreaIdList: selectedConsolidationList.map(
    //   (item) => item.selectedConsolidation.id
    // ),

    fetch(
      `${API.baseURL}/api/pickupPoint/updateInfo?pickupPointId=${pickupPoint.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify(submitEdit),
      }
    )
      .then((res) => res.json())
      .then((respond) => {
        if (respond.code === 403) {
          setOpenValidateSnackbar({
            ...openValidateSnackbar,
            open: true,
            severity: "error",
            text: "Tồn tại đơn hàng đang xử lí tại điểm giao hàng này !",
          });

          setLoading(false);
          return;
        }
        if (respond?.code === 422) {
          setOpenValidateSnackbar({
            ...openValidateSnackbar,
            open: true,
            severity: "error",
            text: "Điểm giao hàng đã tồn tại !",
          });
          setLoading(false);
          return;
        }
        fetch(
          `${API.baseURL}/api/pickupPoint/updateProductConsolidationAreaList`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
            body: JSON.stringify({
              id: pickupPoint.id,
              newUpdateIdList: selectedConsolidationList.map(
                (item) => item.selectedConsolidation.id
              ),
            }),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            fetch(
              `${API.baseURL}/api/pickupPoint/getAllForAdmin?page=${
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
                setPickupPointList(respond.pickupPointList);
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
          .catch((err) => {});
      })
      .catch((err) => console.log(err));
  };

  const typingTimeoutRef = useRef(null);
  return (
    <div
      className={`modal__container ${
        selectedConsolidationList.length >= 6 && "modal-scroll"
      }`}
    >
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Chỉnh sửa điểm giao hàng
        </h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div className={`modal__container-body `}>
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
        <>
          {selectedConsolidationList.map((item, index) => (
            <div className="modal__container-body-inputcontrol">
              {selectedConsolidationList.length !== 1 && (
                <div
                  onClick={() => {
                    setSelectedConsolidationList(
                      selectedConsolidationList.filter((item, i) => i !== index)
                    );
                  }}
                  className="button__minus"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </div>
              )}
              <h4 className="modal__container-body-inputcontrol-label">
                Điểm tập kết {index + 1}
              </h4>
              <div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{ width: 401, marginRight: "-2px" }}
                    className="dropdown"
                  >
                    <div
                      className="dropdown-btn"
                      onClick={(e) => {
                        const newSelectedConsolidationList = [
                          ...selectedConsolidationList,
                        ];
                        newSelectedConsolidationList[index] = {
                          ...newSelectedConsolidationList[index],
                          openConsolidation:
                            !newSelectedConsolidationList[index]
                              .openConsolidation,
                        };
                        setSelectedConsolidationList(
                          newSelectedConsolidationList
                        );
                      }}
                    >
                      {item.selectedConsolidation
                        ? item.selectedConsolidation.address
                        : "Chọn điểm tập kết"}
                      <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                    {item.openConsolidation && (
                      <div className="dropdown-content">
                        {consolidationList.map((item, i) => (
                          <div
                            onClick={(e) => {
                              const newSelectedConsolidationList = [
                                ...selectedConsolidationList,
                              ];
                              newSelectedConsolidationList[index] = {
                                ...newSelectedConsolidationList[index],
                                openConsolidation: false,
                                selectedConsolidation: item,
                                error: "",
                              };
                              setSelectedConsolidationList(
                                newSelectedConsolidationList
                              );
                            }}
                            className="dropdown-item"
                            key={i}
                          >
                            {item.address}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {item.error && (
                  <p
                    style={{ fontSize: "14px", marginBottom: "-10px" }}
                    className="text-danger"
                  >
                    {item.error}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="modal__container-body-inputcontrol">
            <button
              onClick={() => {
                setSelectedConsolidationList([
                  ...selectedConsolidationList,
                  {
                    selectedConsolidation: null,
                    openConsolidation: false,
                    error: "",
                  },
                ]);
              }}
              className="buttonAddSupermarkerAddress"
            >
              Thêm điểm tập kết
              <FontAwesomeIcon
                icon={faPlusCircle}
                style={{ paddingLeft: 10 }}
              />
            </button>
          </div>
        </>
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
            Chỉnh sửa
          </button>
        </div>
      </div>
      {/* *********************** */}
      {loading && <LoadingScreen />}
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
    </div>
  );
};

export default EditPickuppoint;
