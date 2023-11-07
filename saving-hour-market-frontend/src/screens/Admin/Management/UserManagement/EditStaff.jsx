import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";

const EditStaff = ({
  staff,
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setStaffList,
  searchValue,
  page,
  setTotalPage,
}) => {
  const [isActiveDropdown, setisActiveDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(staff.role);
  const [name, setName] = useState(staff.fullName);
  const [email, setEmail] = useState(staff.email);
  const [loading, setLoading] = useState(false);
  const [isActiveDropdownPickupPoint, setisActiveDropdownPickupPoint] =
    useState(false);
  const [selectedPickupPoint, setselectedPickupPoint] = useState(
    "Chọn điểm giao hàng"
  );
  const [error, setError] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    common: "",
    pickupPoint: "",
  });
  const roleList = [
    "ADMIN",
    "STAFF_SLT",
    "STAFF_ORD",
    "STAFF_MKT",
    "STAFF_DLV_0",
    "STAFF_DLV_1",
  ];
  const [pickupPointList, setPickupPointList] = useState([
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
    "121 Tran Van Du,P.13, Quan Tan Binh, TP.HCM",
  ]);
  const handleEdit = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/staff/updateStaffRole`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify({ id: staff.id, role: selectedRole }),
    })
      .then((respond) => respond.json())
      .then((res) => {
        fetch(
          `${API.baseURL}/api/staff/getStaffForAdmin?page=${
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
            setStaffList(respond.staffList);
            setTotalPage(respond.totalPage);
            handleClose();
            setLoading(false);
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
              text: "Chỉnh sửa thành công",
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`modal__container `}>
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chỉnh sửa nhân viên</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div className={`modal__container-body `}>
        {/* role  */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Vai trò</h4>
          <div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                className="dropdown"
                style={{ width: "400px", marginRight: 0 }}
              >
                <div
                  className="dropdown-btn"
                  onClick={(e) => setisActiveDropdown(!isActiveDropdown)}
                >
                  {selectedRole}
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {isActiveDropdown && (
                  <div
                    style={{ height: "180px", overflowY: "scroll" }}
                    className="dropdown-content"
                  >
                    {roleList.map((item, index) => (
                      <div
                        onClick={(e) => {
                          setSelectedRole(item);
                          setisActiveDropdown(!isActiveDropdown);
                          setError({ ...error, role: "" });
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
            {error.role && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.role}
              </p>
            )}
          </div>
        </div>
        {/* pickuppoint */}
        {selectedRole === "STAFF_ORD" && (
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
                  className="dropdown"
                  style={{ width: "400px", marginRight: 0 }}
                >
                  <div
                    className="dropdown-btn"
                    onClick={(e) =>
                      setisActiveDropdownPickupPoint(
                        !isActiveDropdownPickupPoint
                      )
                    }
                  >
                    {selectedPickupPoint}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {isActiveDropdownPickupPoint && (
                    <div
                      style={{ height: "150px", overflowY: "scroll" }}
                      className="dropdown-content"
                    >
                      {pickupPointList.map((item, index) => (
                        <div
                          onClick={(e) => {
                            setselectedPickupPoint(item);
                            setisActiveDropdownPickupPoint(
                              !isActiveDropdownPickupPoint
                            );
                            setError({ ...error, pickupPoint: "" });
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
              {error.role && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.role}
                </p>
              )}
            </div>
          </div>
        )}
        {/* name */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên nhân viên
          </h4>
          <div>
            <input
              disabled
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError({ ...error, name: "" });
              }}
              placeholder="Nhập tên nhân viên"
              type="text"
              className="modal__container-body-inputcontrol-input"
            />
            {error.name && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.name}
              </p>
            )}
          </div>
        </div>

        {/* email  */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Email</h4>
          <div>
            <input
              disabled
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError({ ...error, email: "" });
              }}
              placeholder="Nhập email"
              type="email"
              className="modal__container-body-inputcontrol-input"
            />
            {error.email && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.email}
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
            Chỉnh sửa
          </button>
        </div>
      </div>
      {/* *********************** */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default EditStaff;
