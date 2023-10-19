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

const CreateSuperMarket = ({ handleClose }) => {
  const [locationData, setLocationData] = useState([]);
  const [addressList, setAddressList] = useState([
    {
      isFocused: false,
      selectAddress: "",
      searchAddress: "",
      error: "",
    },
  ]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({
    errName: "",
    errPhone: "",
  });

  const typingTimeoutRef = useRef(null);

  const handleCreate = () => {
    if (!name) {
      setError({ ...error, errName: "Vui lòng không để trống" });
      return;
    }
    if (!phone) {
      setError({ ...error, errPhone: "Vui lòng không để trống" });
      return;
    }
    if (
      !/^[(]{0,1}[0-9]{3}[)]{0,1}[-s.]{0,1}[0-9]{3}[-s.]{0,1}[0-9]{4}$/.test(
        phone
      )
    ) {
      console.log("a");
      setError({ ...error, errPhone: "Số điện thoại không hợp lệ" });
      return;
    }
    const newAddressList1 = addressList.map((item) => {
      if (!item.searchAddress) {
        return { ...item, error: "Vui lòng không để trống" };
      }
      if (!item.selectAddress) {
        return { ...item, error: "Địa chỉ không hợp lệ" };
      }

      return item;
    });
    setAddressList(newAddressList1);
  };

  return (
    // modal header
    <div
      className={`modal__container ${
        addressList.length >= 6 ? "modal-scroll" : ""
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
            {error.errName && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.errName}
              </p>
            )}
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
            {error.errPhone && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.errPhone}
              </p>
            )}
          </div>
        </div>

        {addressList.map((item, i) => {
          return (
            <div className="modal__container-body-inputcontrol input-address">
              <div className="modal__container-body-inputcontrol-label-icon">
                {addressList.length !== 1 && (
                  <div
                    onClick={() => {
                      setAddressList(
                        addressList.filter((address) => address !== item)
                      );
                    }}
                    className="button__minus"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                )}

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
                        return { ...data, searchAddress: e.target.value };
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
                          console.log(respond);
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
                {item.error && (
                  <p
                    style={{ fontSize: "14px", marginBottom: "-10px" }}
                    className="text-danger"
                  >
                    {item.error}
                  </p>
                )}
                {item.searchAddress && (
                  <FontAwesomeIcon
                    onClick={() => {
                      const newAddressList1 = addressList.map((data, index) => {
                        if (index === i) {
                          return {
                            ...data,
                            searchAddress: "",
                            selectAddress: "",
                          };
                        }
                        return data;
                      });
                      setAddressList(newAddressList1);
                    }}
                    className="input-icon-x"
                    icon={faX}
                  />
                )}

                {item.isFocused && locationData.length !== 0 && (
                  <div className="suggest-location">
                    {locationData.map((data) => (
                      <div
                        onClick={() => {
                          const newAddressList1 = addressList.map(
                            (address, index) => {
                              if (index === i) {
                                return {
                                  isFocused: false,
                                  searchAddress: data.description,
                                  selectAddress: data.description,
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
          );
        })}

        <div
          onClick={() => {
            setAddressList([
              ...addressList,
              {
                isFocused: false,
                selectAddress: "",
                searchAddress: "",
              },
            ]);
          }}
          className="button__add"
        >
          Thêm chi nhánh mới <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      {/* ********************** */}

      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button className="modal__container-footer-buttons-close">
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
    </div>
  );
};

export default CreateSuperMarket;
