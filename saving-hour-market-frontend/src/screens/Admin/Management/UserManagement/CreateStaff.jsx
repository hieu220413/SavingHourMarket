import {
  faCaretDown,
  faMinus,
  faPlusCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

  const [selectedPickupPoint, setselectedPickupPoint] = useState([
    {
      isActiveDropdownPickupPoint: false,
      selectedPickupPoint: null,
      error: "",
    },
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliverList, setDeliverList] = useState([]);
  const [selectedDeliverList, setSelectedDeliverList] = useState([
    { selectedDeliver: null, openDeliver: false, error: "" },
  ]);

  const [deliverManageList, setDeliverManageList] = useState([]);
  const [selectedDeliverManager, setSelectedDeliverManager] = useState(null);
  const [openSelectDeliverManager, setOpenSelectDeliverManager] =
    useState(false);
  const [openAssignSnackbar, setOpenAssignSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
    text: "",
  });
  const { vertical, horizontal } = openAssignSnackbar;
  const handleCloseSnackbar = () => {
    setOpenAssignSnackbar({ ...openAssignSnackbar, open: false });
  };

  const roleList = [
    "ADMIN",
    "STAFF_SLT",
    "STAFF_ORD",
    "STAFF_MKT",
    "STAFF_DLV_0",
    "STAFF_DLV_1",
  ];
  const [pickupPointList, setPickupPointList] = useState([]);
  const [error, setError] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    common: "",
    pickupPoint: "",
  });

  useEffect(() => {
    const fetchData = async () => {
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
      fetch(
        `${API.baseURL}/api/staff/getStaffForAdmin?limit=1000&role=STAFF_DLV_0&status=ENABLE`,
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
          setDeliverList(respond.staffList);
          setLoading(false);
        })
        .catch((err) => console.log(err));
      fetch(
        `${API.baseURL}/api/staff/getStaffForAdmin?limit=1000&role=STAFF_DLV_1&status=ENABLE`,
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
          setDeliverManageList(respond.staffList);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchData();
  }, []);

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
    if (selectedRole === "STAFF_ORD") {
      const validatePickupPoint = selectedPickupPoint.findIndex(
        (item) => !item.selectedPickupPoint
      );
      if (validatePickupPoint !== -1) {
        const newSelectedPickupPointList = [...selectedPickupPoint];
        newSelectedPickupPointList[validatePickupPoint] = {
          ...newSelectedPickupPointList[validatePickupPoint],
          error: "Vui lòng chọn điểm giao hàng",
        };
        setselectedPickupPoint(newSelectedPickupPointList);
        return;
      }
      var valueArr = selectedPickupPoint.map(function (item) {
        return item?.selectedPickupPoint?.id;
      });
      var isDuplicatePickupPoint = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx;
      });

      if (isDuplicatePickupPoint) {
        setOpenAssignSnackbar({
          ...openAssignSnackbar,
          open: true,
          severity: "error",
          text: "Có điểm giao hàng trùng nhau !",
        });
        return;
      }
    }
    if (selectedRole === "STAFF_DLV_1") {
      const validateDeliver = selectedDeliverList.findIndex(
        (item) => !item.selectedDeliver
      );
      if (validateDeliver !== -1) {
        const newSelectedDeliverList = [...selectedDeliverList];
        newSelectedDeliverList[validateDeliver] = {
          ...newSelectedDeliverList[validateDeliver],
          error: "Vui lòng chọn nhân viên",
        };
        setSelectedDeliverList(newSelectedDeliverList);
        setLoading(false);
        return;
      }
      var valueArr = selectedDeliverList.map(function (item) {
        return item?.selectedDeliver?.id;
      });
      var isDuplicateDeliver = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx;
      });

      if (isDuplicateDeliver) {
        setOpenAssignSnackbar({
          ...openAssignSnackbar,
          open: true,
          severity: "error",
          text: "Có nhân viên trùng nhau !",
        });
        setLoading(false);
        return;
      }
    }
    if (selectedRole === "STAFF_DLV_0") {
      if (!selectedDeliverManager) {
        setError({ ...error, deliverManager: "Vui lòng chọn người quản lí" });
        setLoading(false);
        return;
      }
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
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
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
        console.log(respond);
        if (respond.code === 422) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            text: "Sai định dạng hoặc email đã tồn tại",
          });
          setLoading(false);
          return;
        }
        if (respond.code === 403) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            text: "Email đã tồn tại",
          });
          setLoading(false);
          return;
        }
        if (selectedRole === "STAFF_ORD") {
          fetch(`${API.baseURL}/api/staff/assignPickupPointForCreateAccount`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
            body: JSON.stringify({
              staffEmail: email,
              pickupPointIdList: selectedPickupPoint.map(
                (item) => item.selectedPickupPoint.id
              ),
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
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
            .catch((err) => {});
        } else if (selectedRole === "STAFF_DLV_0") {
          fetch(
            `${API.baseURL}/api/staff/updateDeliverManagerForDeliver?deliverId=${respond.id}&deliverManagerId=${selectedDeliverManager.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenId}`,
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
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
            .catch((er) => {});
        } else if (selectedRole === "STAFF_DLV_1") {
          fetch(`${API.baseURL}/api/staff/updateDeliversForDeliverManager`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
            body: JSON.stringify({
              deliverManagerId: respond.id,
              deliverIdList: selectedDeliverList.map((item) => {
                return item.selectedDeliver.id;
              }),
            }),
          })
            .then((res) => res.json())
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
            .catch((er) => {});
        } else {
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
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={`modal__container ${
        (selectedDeliverList.length >= 3 || selectedPickupPoint.length >= 3) &&
        "modal-scroll"
      }`}
    >
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
        {/* assign deliver  */}
        {selectedRole === "STAFF_DLV_0" && (
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Quản lí
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
                      setOpenSelectDeliverManager(!openSelectDeliverManager)
                    }
                  >
                    {selectedDeliverManager
                      ? selectedDeliverManager.fullName
                      : "Chọn người quản lí"}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {openSelectDeliverManager && (
                    <div
                      style={
                        deliverManageList.length > 5
                          ? {
                              height: "180px",
                              overflowY: "scroll",
                            }
                          : {}
                      }
                      className="dropdown-content"
                    >
                      {deliverManageList.map((item, index) => (
                        <div
                          onClick={(e) => {
                            setSelectedDeliverManager(item);
                            setOpenSelectDeliverManager(
                              !openSelectDeliverManager
                            );
                            setError({ ...error, deliverManager: "" });
                          }}
                          className="dropdown-item"
                          key={index}
                        >
                          {item?.fullName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {error.deliverManager && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.deliverManager}
                </p>
              )}
            </div>
          </div>
        )}
        {/* deliver manager  */}

        {selectedRole === "STAFF_DLV_1" && (
          <>
            {selectedDeliverList.map((item, index) => (
              <div className="modal__container-body-inputcontrol">
                {selectedDeliverList.length !== 1 && (
                  <div
                    onClick={() => {
                      setSelectedDeliverList(
                        selectedDeliverList.filter((item, i) => i !== index)
                      );
                    }}
                    className="button__minus"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                )}
                <h4 className="modal__container-body-inputcontrol-label">
                  Nhân viên {index + 1}
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
                          const newSelectedDeliverList = [
                            ...selectedDeliverList,
                          ];
                          newSelectedDeliverList[index] = {
                            ...newSelectedDeliverList[index],
                            openDeliver:
                              !newSelectedDeliverList[index].openDeliver,
                          };
                          setSelectedDeliverList(newSelectedDeliverList);
                        }}
                      >
                        {item.selectedDeliver
                          ? item.selectedDeliver.fullName
                          : "Chọn nhân viên"}
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      {item.openDeliver && (
                        <div
                          style={{ height: "130px", overflowY: "scroll" }}
                          className="dropdown-content"
                        >
                          {deliverList.map((deliver, i) => (
                            <div
                              onClick={(e) => {
                                const newSelectedDeliverList = [
                                  ...selectedDeliverList,
                                ];
                                newSelectedDeliverList[index] = {
                                  ...newSelectedDeliverList[index],
                                  openDeliver: false,
                                  selectedDeliver: deliver,
                                  error: "",
                                };
                                setSelectedDeliverList(newSelectedDeliverList);
                              }}
                              className="dropdown-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "12px",
                              }}
                              key={i}
                            >
                              <p style={{ marginBottom: 0 }}>
                                {deliver?.fullName}
                              </p>
                              <p
                                className="text-danger"
                                style={{ marginBottom: 0 }}
                              >
                                {deliver.deliverManagerStaff
                                  ? `Đã có quản lí : ${deliver.deliverManagerStaff.fullName}`
                                  : "Chưa có quản lí"}
                              </p>
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
                  if (deliverList.length === selectedDeliverList.length) {
                    setOpenAssignSnackbar({
                      ...openAssignSnackbar,
                      open: true,
                      severity: "error",
                      text: `Hiện tại có ${deliverList.length} nhân viên. Không thể tạo thêm !`,
                    });
                    return;
                  }
                  setSelectedDeliverList([
                    ...selectedDeliverList,
                    {
                      selectedConsolidation: null,
                      openConsolidation: false,
                      error: "",
                    },
                  ]);
                }}
                className="buttonAddSupermarkerAddress"
              >
                Thêm nhân viên
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ paddingLeft: 10 }}
                />
              </button>
            </div>
          </>
        )}
        {/* pickuppoint */}
        {selectedRole === "STAFF_ORD" && (
          <>
            {selectedPickupPoint.map((item, index) => (
              <div className="modal__container-body-inputcontrol">
                {selectedPickupPoint.length !== 1 && (
                  <div
                    onClick={() => {
                      setselectedPickupPoint(
                        selectedPickupPoint.filter((data) => data !== item)
                      );
                    }}
                    className="button__minus"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                )}

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
                        onClick={(e) => {
                          const newPickuppointList = selectedPickupPoint.map(
                            (data, i) => {
                              if (i === index) {
                                return {
                                  ...data,
                                  isActiveDropdownPickupPoint:
                                    !data.isActiveDropdownPickupPoint,
                                };
                              }
                              return data;
                            }
                          );
                          setselectedPickupPoint(newPickuppointList);
                        }}
                      >
                        {item.selectedPickupPoint
                          ? item.selectedPickupPoint.address
                          : "Chọn điểm giao hàng"}
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      {item.isActiveDropdownPickupPoint && (
                        <div
                          style={{ height: "150px", overflowY: "scroll" }}
                          className="dropdown-content"
                        >
                          {pickupPointList.map(
                            (pickupPoint, pickupPointIndex) => (
                              <div
                                onClick={(e) => {
                                  const newPickuppointList =
                                    selectedPickupPoint.map((data, i) => {
                                      if (i === index) {
                                        return {
                                          selectedPickupPoint: pickupPoint,
                                          isActiveDropdownPickupPoint:
                                            !data.isActiveDropdownPickupPoint,
                                          error: "",
                                        };
                                      }
                                      return data;
                                    });
                                  setselectedPickupPoint(newPickuppointList);
                                }}
                                className="dropdown-item"
                                key={index}
                              >
                                {pickupPoint.address}
                              </div>
                            )
                          )}
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
                  if (selectedPickupPoint.length === pickupPointList.length) {
                    setOpenAssignSnackbar({
                      ...openAssignSnackbar,
                      open: true,
                      severity: "error",
                      text: `Hiện tại có ${pickupPointList.length} điểm giao hàng. Không thể tạo thêm !`,
                    });
                    return;
                  }
                  setselectedPickupPoint([
                    ...selectedPickupPoint,
                    {
                      selectedPickupPoint: null,
                      isActiveDropdownPickupPoint: false,
                      error: "",
                    },
                  ]);
                }}
                className="buttonAddSupermarkerAddress"
              >
                Thêm điểm giao hàng
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ paddingLeft: 10 }}
                />
              </button>
            </div>
          </>
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
      <Snackbar
        open={openAssignSnackbar.open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openAssignSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openAssignSnackbar.text}
        </Alert>
      </Snackbar>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default CreateStaff;
