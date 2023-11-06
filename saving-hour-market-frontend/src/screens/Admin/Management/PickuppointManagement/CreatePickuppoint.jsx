import React, { useRef, useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../../contanst/api";

const CreatePickuppoint = ({ handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [openConsolidation, setOpenConsolidation] = useState(false);
  const [selectedConsolidation, setSelectedConsolidation] =
    useState("Chọn điểm tập kết");
  const [address, setAddress] = useState({
    isFocused: false,
    selectAddress: "",
    searchAddress: "",
    error: "",
  });
  const [consolidationList, setConsolidationList] = useState([
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
  ]);
  const typingTimeoutRef = useRef(null);
  return (
    <div className={`modal__container `}>
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm điểm giao hàng</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div style={{ height: "200px" }} className={`modal__container-body `}>
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
        <>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Điểm tập kết
            </h4>
            <div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{ width: 400, marginRight: "-2px" }}
                  className="dropdown"
                >
                  <div
                    className="dropdown-btn"
                    onClick={(e) => setOpenConsolidation(!openConsolidation)}
                  >
                    {selectedConsolidation}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {openConsolidation && (
                    <div
                      style={{ height: "120px", overflowY: "scroll" }}
                      className="dropdown-content"
                    >
                      {consolidationList.map((item, index) => (
                        <div
                          onClick={(e) => {
                            setSelectedConsolidation(item);
                            setOpenConsolidation(false);
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
          <button className="modal__container-footer-buttons-create">
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default CreatePickuppoint;
