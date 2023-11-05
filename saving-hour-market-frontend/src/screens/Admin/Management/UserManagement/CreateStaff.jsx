import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const CreateStaff = ({
  handleClose,
  setOpenSnackbar,
  openSnackbar,
  setStaffList,
  searchValue,
  page,
  setTotalPage,
  isSwitchRecovery,
}) => {
  const [isActiveDropdown, setisActiveDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Chọn vai trò");
  const [isActiveDropdownPickupPoint, setisActiveDropdownPickupPoint] =
    useState(false);
  const [selectedPickupPoint, setselectedPickupPoint] = useState(
    "Chọn điểm giao hàng"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
  const [error, setError] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    common: "",
    pickupPoint: "",
  });

  const handleCreate = async () => {
    if (name === "") {
      setError({ ...error, name: "Vui lòng không để trống" });
      return;
    }
    if (
      !/^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{2,50}$/.test(
        name
      )
    ) {
      setError({ ...error, name: "Tên chỉ được chứa chữ, độ dài từ 2 đến 50" });
      return;
    }
    if (selectedRole === "Chọn vai trò") {
      setError({ ...error, role: "Vui lòng chọn vai trò" });
      return;
    }
    if (
      email === "" ||
      !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
        email
      )
    ) {
      setError({ ...error, email: "Email không hợp lệ" });
      return;
    }
    if (password === "") {
      setError({ ...error, password: "Vui lòng không để trống" });
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setError({
        ...error,
        password:
          "Mật khẩu phải có ít chất 8 kí tự, 1 số, 1 chữ hoa và 1 chữ thường",
      });
      return;
    }
    if (confirmPassword === "") {
      setError({ ...error, confirmPassword: "Vui lòng không để trống" });
      return;
    }
    if (confirmPassword !== password) {
      setError({ ...error, confirmPassword: "Mật khẩu khẩu xác nhận sai" });
      return;
    }
    const submitCreate = {
      fullName: name,
      email: email,
      password: password,
    };
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/staff/createStaffAccount?role=${selectedRole}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitCreate),
    })
      .then((res) => res.json())
      .then((respond) => {
        if (respond.code === 403) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            text: "Email đã tồn tại",
          });
          setLoading(false);
          return;
        }
        fetch(
          `${API.baseURL}/api/staff/getStaffForAdmin?page=${
            page - 1
          }&limit=6&name=${searchValue}${
            isSwitchRecovery ? "&status=DISABLE" : "&status=ENABLE"
          }`,
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
              text: "Tạo mới thành công",
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
        <h3 className="modal__container-header-title">Thêm nhân viên</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div className={`modal__container-body `}>
        {/* name */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên nhân viên
          </h4>
          <div>
            <input
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
                  <div className="dropdown-content">
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

        {/* email  */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Email</h4>
          <div>
            <input
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

        {/* password  */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Mật khẩu</h4>
          <div>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError({ ...error, password: "" });
              }}
              placeholder="Nhập mật khẩu"
              type="password"
              className="modal__container-body-inputcontrol-input"
            />
            {error.password && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.password}
              </p>
            )}
          </div>
        </div>
        {/* confirm password  */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Xác nhận mật khẩu
          </h4>
          <div>
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError({ ...error, confirmPassword: "" });
              }}
              placeholder="Xác nhận mật khẩu"
              type="password"
              className="modal__container-body-inputcontrol-input"
            />
            {error.confirmPassword && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.confirmPassword}
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

export default CreateStaff;
