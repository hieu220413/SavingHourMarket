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

const AddSupermarketStore = ({
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
}) => {
  const [addressList, setAddressList] = useState([
    {
      isFocused: false,
      selectAddress: "",
      searchAddress: "",
      errorAddress: "",
      errorPickupPoint: "",
      pickupPoint: null,
      isActiveDropdownPickupPoint: false,
    },
  ]);
  const [locationData, setLocationData] = useState([]);
  const [error, setError] = useState({
    address: "",
    pickupPoint: "",
  });
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

  const handleCreate = async () => {
    const addressListValidate = addressList.map((item) => {
      if (!item.selectAddress) {
        return { ...item, errorAddress: "Địa chỉ không hợp lệ" };
      }
      return item;
    });
    setAddressList(addressListValidate);

    const validateAddress = addressList.some((item) => !item.selectAddress);

    if (validateAddress) {
      setOpenSnackbar({
        ...openSnackbar,
        open: true,
        severity: "error",
        text: "Địa chỉ không hợp lệ",
      });
      return;
    }

    const pickupPointValidate = addressList.map((item) => {
      if (!item.pickupPoint) {
        return { ...item, errorPickupPoint: "Vui lòng chọn điểm giao hàng" };
      }
      return item;
    });
    setAddressList(pickupPointValidate);

    const validatePickupPoint = addressList.some((item) => !item.pickupPoint);

    if (validatePickupPoint) {
      setOpenSnackbar({
        ...openSnackbar,
        open: true,
        severity: "error",
        text: "Chưa liên kết điểm giao hàng",
      });

      return;
    }

    const addressDuplicated = stores.some((item) => {
      return addressList.find(
        (address) => address.selectAddress === item.address
      );
    });

    const uniqueValues = new Set(addressList.map((v) => v?.selectAddress));

    if (uniqueValues.size < addressList.length || addressDuplicated) {
      setOpenSnackbar({
        ...openSnackbar,
        open: true,
        severity: "error",
        text: "Có địa chỉ đã tồn tại",
      });
      return;
    }
    const listAddress = addressList.map((item) => {
      return {
        address: item.selectAddress,
        pickupPointId: item.pickupPoint.id,
      };
    });
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(
      `${API.baseURL}/api/supermarket/createSupermarketAddressForSupermarket?supermarketId=${supermarketId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify(listAddress),
      }
    )
      .then((res) => res.json())
      .then((respond) => {
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
              text: "Thêm chi nhánh thành công",
            });
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={`modal__container ${
        addressList.length >= 2 && "modal-scroll"
      }`}
    >
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm chi nhánh</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      {/* modal body */}
      <div style={{}} className={`modal__container-body `}>
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
                    style={{ paddingRight: 20 }}
                    value={item.searchAddress}
                    onChange={(e) => {
                      const newAddressList1 = addressList.map((data, index) => {
                        if (index === i) {
                          return {
                            ...data,
                            searchAddress: e.target.value,
                            selectAddress: "",
                            errorAddress: "",
                          };
                        }
                        return data;
                      });
                      setAddressList(newAddressList1);

                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                      typingTimeoutRef.current = setTimeout(() => {
                        fetch(
                          `https://rsapi.goong.io/Place/AutoComplete?api_key=${API.GoongAPIKey}&limit=4&input=${item.searchAddress}`
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
                      const newAddressList1 = addressList.map((data, index) => {
                        if (index === i) {
                          return { ...data, isFocused: true };
                        }
                        return { ...data, isFocused: false };
                      });
                      setAddressList(newAddressList1);
                    }}
                    placeholder="Nhập địa chỉ"
                    type="text"
                    className="modal__container-body-inputcontrol-input"
                  />
                  {item.errorAddress && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.errorAddress}
                    </p>
                  )}
                  {item.searchAddress && (
                    <FontAwesomeIcon
                      onClick={() => {
                        const newAddressList1 = addressList.map(
                          (data, index) => {
                            if (index === i) {
                              return {
                                ...data,
                                searchAddress: "",
                                selectAddress: "",
                              };
                            }
                            return data;
                          }
                        );
                        setAddressList(newAddressList1);
                      }}
                      className="input-icon-x"
                      icon={faX}
                    />
                  )}

                  {item.isFocused && locationData.length !== 0 && (
                    <div
                      className={`suggest-location ${
                        addressList.length >= 2 ? "fix-position" : ""
                      }`}
                    >
                      {locationData.map((data) => (
                        <div
                          onClick={() => {
                            const newAddressList1 = addressList.map(
                              (address, index) => {
                                if (index === i) {
                                  return {
                                    ...address,
                                    isFocused: false,
                                    searchAddress: data.description,
                                    selectAddress: data.description,
                                    errorAddress: "",
                                  };
                                }
                                return address;
                              }
                            );
                            setAddressList(newAddressList1);
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
                          const newAddressList = [...addressList];
                          newAddressList[i] = {
                            ...addressList[i],
                            isActiveDropdownPickupPoint:
                              !addressList[i].isActiveDropdownPickupPoint,
                          };
                          setAddressList(newAddressList);
                        }}
                      >
                        {item?.pickupPoint
                          ? item?.pickupPoint.address
                          : "Chọn điểm giao hàng"}
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>

                      {item.isActiveDropdownPickupPoint && (
                        <div className="dropdown-content">
                          {pickupPointList.map((item, num) => (
                            <div
                              onClick={(e) => {
                                const newAddressList = [...addressList];
                                newAddressList[i] = {
                                  ...addressList[i],
                                  pickupPoint: item,
                                  isActiveDropdownPickupPoint: false,
                                  errorPickupPoint: "",
                                };
                                setAddressList(newAddressList);
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
                  {item.errorPickupPoint && (
                    <p
                      style={{ fontSize: "14px", marginBottom: "-10px" }}
                      className="text-danger"
                    >
                      {item.errorPickupPoint}
                    </p>
                  )}
                </div>
              </div>
              {addressList.length !== 1 && (
                <div className="modal__container-body-inputcontrol">
                  <button
                    onClick={() => {
                      setAddressList(
                        addressList.filter((item, num) => num !== i)
                      );
                    }}
                    className="buttonAddSupermarkerAddress"
                  >
                    Xóa chi nhánh
                    <FontAwesomeIcon
                      icon={faCircleMinus}
                      style={{ paddingLeft: 10 }}
                    />
                  </button>
                </div>
              )}
            </>
          );
        })}
        <div className="modal__container-body-inputcontrol">
          <button
            style={{ width: "100%" }}
            onClick={() => {
              setAddressList([
                ...addressList,
                {
                  isFocused: false,
                  selectAddress: "",
                  searchAddress: "",
                  errorAddress: "",
                  errorPickupPoint: "",
                  pickupPoint: null,
                  isActiveDropdownPickupPoint: false,
                },
              ]);
            }}
            className="buttonAddSupermarkerAddress"
          >
            Thêm chi nhánh mới
            <FontAwesomeIcon icon={faPlusCircle} style={{ paddingLeft: 10 }} />
          </button>
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

export default AddSupermarketStore;
