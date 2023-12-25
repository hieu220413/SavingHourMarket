import React, { useEffect, useRef, useState } from "react";
import "./CreateSuperMarket.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCircleMinus,
  faMinus,
  faPlus,
  faPlusCircle,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";

import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const CreateSuperMarket = ({
  handleClose,
  setSuperMarketList,
  setTotalPage,
  page,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setError,
  setIsSwitchRecovery,
}) => {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickupPointList, setPickupPointList] = useState([]);

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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchPickupPoint = async () => {
      setLoading(true);
      fetch(`${API.baseURL}/api/pickupPoint/getAll`)
        .then((res) => res.json())
        .then((res) => {
          setPickupPointList(res);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchPickupPoint();
  }, []);

  const handleCreate = async () => {
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
    const addressListValidate = addressList.map((item) => {
      if (!item.selectAddress) {
        return { ...item, errorAddress: "Địa chỉ không hợp lệ" };
      }
      return item;
    });
    setAddressList(addressListValidate);

    const validateAddress = addressList.some((item) => !item.selectAddress);

    if (validateAddress) {
      setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
      setError("Địa chỉ không hợp lệ");
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
      setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
      setError("Chưa liên kết điểm giao hàng");
      return;
    }
    const uniqueValues = new Set(addressList.map((v) => v?.selectAddress));

    if (uniqueValues.size < addressList.length) {
      setOpenSnackbar({
        ...openSnackbar,
        open: true,
        severity: "error",
      });
      setError("Có địa chỉ đã tồn tại");
      return;
    }
    const listAddress = addressList.map((item) => {
      return {
        address: item.selectAddress,
        pickupPointId: item.pickupPoint.id,
      };
    });
    const submitSupermarket = {
      name: name,
      supermarketAddressList: listAddress,
      phone: phone,
    };

    setLoading(true);

    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/supermarket/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitSupermarket),
    })
      .then((res) => res.json())
      .then((respond) => {
        if (respond?.code === 422) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setError("Tên siêu thị đã tồn tại");
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
          .then((respond) => {
            setSuperMarketList(respond.supermarketList);
            setTotalPage(respond.totalPage);
            setIsSwitchRecovery(false);
            handleClose();
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setError("Thêm siêu thị thành công");
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    // modal header
    <div
      className={`modal__container ${
        addressList.length >= 2 ? "modal-scroll" : ""
      }`}
    >
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm siêu thị</h3>
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
            onClick={handleCreate}
            className="modal__container-footer-buttons-create"
          >
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default CreateSuperMarket;
