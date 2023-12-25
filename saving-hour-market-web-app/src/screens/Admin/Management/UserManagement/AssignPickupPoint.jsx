import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const AssignPickupPoint = ({
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setStaffList,
  searchValue,
  staff,
  page,
  setTotalPage,
  setselectedPickupPointList,
}) => {
  const [pickupPointList, setPickupPointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPickupPoint = async () => {
      setLoading(true);
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/pickupPoint/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setPickupPointList(res);
          setLoading(false);
        })
        .catch((err) => {});
    };
    fetchPickupPoint();
  }, []);
  const handleAssign = async () => {
    if (!selectedPickupPoint) {
      setError("Vui lòng chọn điểm giao hàng");
      return;
    }
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/staff/assignPickupPoint`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify({
        staffEmail: staff.email,
        pickupPointId: selectedPickupPoint.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 401) {
          return;
        }
        setselectedPickupPointList(res.pickupPoint);
        handleClose();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
          text: "Tạo mới thành công",
        });
        setLoading(false);
      })
      .catch((err) => {});
  };
  return (
    <div style={{ width: 550 }} className={`modal__container `}>
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Thêm điểm giao hàng cho nhân viên
        </h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      {/* modal body */}
      <div
        style={{ height: "20vh", display: "flex", justifyContent: "center" }}
        className={`modal__container-body `}
      >
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Điểm giao hàng
          </h4>
          <div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                className="dropdown "
                style={{
                  width: "400px",
                  marginRight: 0,
                }}
              >
                <div
                  className="dropdown-btn "
                  onClick={(e) => setIsActiveDropdown(!isActiveDropdown)}
                >
                  {selectedPickupPoint?.address
                    ? selectedPickupPoint.address
                    : "Chọn điểm giao hàng"}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {isActiveDropdown && (
                  <div
                    style={{ height: "100px", overflowY: "scroll" }}
                    className="dropdown-content"
                  >
                    {pickupPointList.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedPickupPoint(item);
                          setIsActiveDropdown(!isActiveDropdown);
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
            onClick={handleAssign}
            className="modal__container-footer-buttons-create"
          >
            Thêm
          </button>
        </div>
      </div>
      {/* *********************** */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default AssignPickupPoint;
