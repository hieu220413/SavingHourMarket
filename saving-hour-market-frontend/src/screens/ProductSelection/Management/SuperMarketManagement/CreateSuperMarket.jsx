import React, { useEffect, useRef, useState } from "react";
import "./CreateSuperMarket.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";

const CreateSuperMarket = ({ handleClose }) => {
  const [addressData, setAddressData] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [address, setAddress] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const isMountRef = useRef(true);

  useEffect(() => {
    if (isMountRef.current) {
      isMountRef.current = false;
      return;
    }
    fetch(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${API.GoongAPIKey}&limit=2&input=${address}`
    )
      .then((res) => res.json())
      .then((respond) => {
        if (!respond.predictions) {
          setLocationData([]);
          return;
        }
        console.log(respond);
        setLocationData(respond.predictions);
      })
      .catch((err) => console.log(err));
  }, [address]);

  const typingTimeoutRef = useRef(null);

  const onAddressChange = (value) => {
    setSearchAddress(value);
    setSelectedAddress("");
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setAddress(value);
    }, 400);
  };

  const onSelectAddress = (value) => {
    console.log(value);
    setIsFocused(false);
    setSearchAddress(value);
    setAddress(value);
    setSelectedAddress(value);
  };

  return (
    // modal header
    <div className="modal__container ">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm siêu thị</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div className="modal__container-body">
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên siêu thị
          </h4>
          <input
            placeholder="Nhập tên siêu thị"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
        </div>

        <div className="modal__container-body-inputcontrol input-address">
          <h4 className="modal__container-body-inputcontrol-label">Địa chỉ</h4>
          <input
            style={{ paddingRight: 20 }}
            value={searchAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
            }}
            // onBlur={() => {
            //   setIsFocused(false);
            // }}
            placeholder="Nhập địa chỉ"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
          {searchAddress && (
            <FontAwesomeIcon
              onClick={() => {
                setSearchAddress("");
                setAddress("");
                setSelectedAddress("");
              }}
              className="input-icon-x"
              icon={faX}
            />
          )}

          {isFocused && locationData.length !== 0 && (
            <div className="suggest-location">
              {locationData.map((item) => (
                <div
                  onClick={() => {
                    onSelectAddress(item.description);
                  }}
                  className="suggest-location-item"
                >
                  <h4>{item.description}</h4>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Số điện thoại
          </h4>
          <input
            placeholder="Nhập số điện thoại"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
      </div>
      {/* ********************** */}

      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button className="modal__container-footer-buttons-close">
            Đóng
          </button>
          <button className="modal__container-footer-buttons-create">
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
    </div>
  );
};

export default CreateSuperMarket;
