import {
  faCaretDown,
  faMinus,
  faPlus,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { API } from "../../../../contanst/api";

const CreateConsolidation = ({ handleClose }) => {
  const [address, setAddress] = useState({
    isFocused: false,
    selectAddress: "",
    searchAddress: "",
    error: "",
  });
  const [locationData, setLocationData] = useState([]);
  const [pickupPointList, setPickupPointList] = useState([
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
  ]);
  const typingTimeoutRef = useRef(null);
  const [selectPickupPointList, setSelectPickupPointList] = useState([
    {
      openDropdown: false,
      selectedPickupPoint: "",
    },
  ]);
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
      <div className={`modal__container-body`}>
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
                      setAddress({
                        isFocused: false,
                        searchAddress: data.description,
                        selectAddress: data.description,
                        error: "",
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
                      ? mainItem.selectedPickupPoint
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
                                  };
                                }
                                return data;
                              });
                            setSelectPickupPointList(newPickuppointList);
                          }}
                          className="dropdown-item"
                          key={index}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* {error.supermarket && (
                       <p
                         style={{ fontSize: "14px", marginBottom: "-10px" }}
                         className="text-danger"
                       >
                         {error.supermarket}
                       </p>
                     )} */}
            </div>
          </div>
        ))}
        <div
          onClick={() => {
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
          <button className="modal__container-footer-buttons-create">
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
    </div>
  );
};

export default CreateConsolidation;
