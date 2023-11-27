import {
  faCaretDown,
  faCircleMinus,
  faMinus,
  faPlusCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import { Dialog } from "@mui/material";
import AssignPickupPoint from "./AssignPickupPoint";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [isActiveDropdownPickupPoint, setIsActiveDropdownPickupPoint] =
    useState(false);

  const [selectedPickupPointList, setselectedPickupPointList] = useState(
    staff.pickupPoint
  );
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const [deliverList, setDeliverList] = useState([]);
  const [selectedDeliverList, setSelectedDeliverList] = useState(
    staff.role === "STAFF_DLV_1" && staff.deliverStaffList.length > 0
      ? staff.deliverStaffList.map((item) => {
          return { selectedDeliver: item, openDeliver: false, error: "" };
        })
      : [{ selectedDeliver: null, openDeliver: false, error: "" }]
  );

  const handleCloseThis = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();

    fetch(
      `${API.baseURL}/api/staff/getStaffForAdmin?page=${
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
        setStaffList(respond.staffList);
        setTotalPage(respond.totalPage);

        handleClose();
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

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

  const [error, setError] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    common: "",
    pickupPoint: "",
    deliverManager: "",
  });
  const roleList = [
    "ADMIN",
    "STAFF_SLT",
    "STAFF_ORD",
    "STAFF_MKT",
    "STAFF_DLV_0",
    "STAFF_DLV_1",
  ];
  const [pickupPointList, setPickupPointList] = useState([]);
  const [currentPickupPoint, setCurrentPickupPoint] = useState(null);
  const [deliverManageList, setDeliverManageList] = useState([]);
  const [selectedDeliverManager, setSelectedDeliverManager] = useState(
    staff.deliverManagerStaff
  );
  const [openSelectDeliverManager, setOpenSelectDeliverManager] =
    useState(false);

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

  const handleDelete = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/staff/unAssignPickupPoint`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify({
        staffEmail: email,
        pickupPointId: currentPickupPoint.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 401) {
          return;
        }
        setselectedPickupPointList(res.pickupPoint);
        handleCloseDeleteDialog();
        setOpenAssignSnackbar({
          ...openAssignSnackbar,
          open: true,
          severity: "success",
          text: "Xóa thành công",
        });
        setLoading(false);
      })
      .catch((err) => {});
  };

  const handleEdit = async () => {
    setLoading(true);
    const tokenId = await auth.currentUser.getIdToken();
    if (staff.role !== "STAFF_ORD" && selectedRole === "STAFF_ORD") {
      if (!selectedPickupPoint) {
        setError({ ...error, pickupPoint: "Vui lòng chọn điểm giao hàng" });
        setLoading(false);
        return;
      }
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
          fetch(`${API.baseURL}/api/staff/assignPickupPoint`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
            body: JSON.stringify(),
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
            .catch((err) => {});
        })
        .catch((err) => console.log(err));
    }
    if (staff.role === "STAFF_ORD" && selectedRole === "STAFF_ORD") {
      handleClose();
      setOpenSnackbar({
        ...openSnackbar,
        open: true,
        severity: "success",
        text: "Chỉnh sửa thành công",
      });
    }
    if (
      selectedRole !== "STAFF_ORD" &&
      selectedRole !== "STAFF_DLV_1" &&
      selectedRole !== "STAFF_DLV_0"
    ) {
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
        .catch((err) => {});
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
          fetch(`${API.baseURL}/api/staff/updateDeliversForDeliverManager`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenId}`,
            },
            body: JSON.stringify({
              deliverManagerId: staff.id,
              deliverIdList: selectedDeliverList.map((item) => {
                return item.selectedDeliver.id;
              }),
            }),
          })
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
        })
        .catch((err) => {});
    }
    if (selectedRole === "STAFF_DLV_0") {
      if (!selectedDeliverManager) {
        setError({ ...error, deliverManager: "Vui lòng chọn người quản lí" });
        setLoading(false);
        return;
      }
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
            `${API.baseURL}/api/staff/updateDeliverManagerForDeliver?deliverId=${staff.id}&deliverManagerId=${selectedDeliverManager.id}`,
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
        })
        .catch((err) => {});
    }
  };

  return (
    <div
      className={`modal__container ${
        (selectedDeliverList.length || selectedPickupPointList.length) >= 5 &&
        "modal-scroll"
      }`}
    >
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chỉnh sửa nhân viên</h3>
        <FontAwesomeIcon onClick={handleCloseThis} icon={faXmark} />
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
        {selectedRole === "STAFF_ORD" &&
          staff.role === "STAFF_ORD" &&
          selectedPickupPointList.map((item) => (
            <>
              <div className="modal__container-body-inputcontrol">
                {selectedPickupPointList.length !== 1 && (
                  <div
                    onClick={() => {
                      setCurrentPickupPoint(item);
                      handleOpenDeleteDialog();
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
                      className="dropdown "
                      style={{
                        width: "400px",
                        marginRight: 0,
                      }}
                    >
                      <div
                        style={{ background: "#cccccc", color: "#666666" }}
                        className="dropdown-btn "
                      >
                        {item?.address ? item.address : "Chọn điểm giao hàng"}
                      </div>
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
            </>
          ))}
        {selectedRole === "STAFF_ORD" && staff.role === "STAFF_ORD" && (
          <div className="modal__container-body-inputcontrol">
            <button
              onClick={handleOpenCreateDialog}
              className="buttonAddSupermarkerAddress"
            >
              Thêm điểm giao hàng
              <FontAwesomeIcon
                icon={faPlusCircle}
                style={{ paddingLeft: 10 }}
              />
            </button>
          </div>
        )}
        {selectedRole === "STAFF_ORD" && staff.role !== "STAFF_ORD" && (
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
                    onClick={(e) =>
                      setIsActiveDropdownPickupPoint(
                        !isActiveDropdownPickupPoint
                      )
                    }
                  >
                    {selectedPickupPoint?.address
                      ? selectedPickupPoint.address
                      : "Chọn điểm giao hàng"}
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
                            setSelectedPickupPoint(item);
                            setIsActiveDropdownPickupPoint(
                              !isActiveDropdownPickupPoint
                            );
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

              {error.pickupPoint && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.pickupPoint}
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
            onClick={handleCloseThis}
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
      <Dialog
        onClose={handleCloseCreateDialog}
        aria-labelledby="customized-dialog-title"
        open={openCreateDialog}
      >
        <AssignPickupPoint
          setOpenSnackbar={setOpenAssignSnackbar}
          openSnackbar={openAssignSnackbar}
          handleClose={handleCloseCreateDialog}
          setStaffList={setStaffList}
          searchValue={searchValue}
          staff={staff}
          page={page}
          setTotalPage={setTotalPage}
          setselectedPickupPointList={setselectedPickupPointList}
        />
      </Dialog>
      <Dialog
        onClose={handleCloseDeleteDialog}
        aria-labelledby="customized-dialog-title"
        open={openDeleteDialog}
      >
        <div style={{ width: 550 }} className={`modal__container `}>
          {/* // modal header */}
          <div className="modal__container-header">
            <h3 className="modal__container-header-title">
              Xóa điểm giao hàng cho nhân viên
            </h3>
            <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
          </div>
          {/* ****************** */}
          {/* modal body */}
          <div className={`modal__container-body `}>
            <h4>Bạn có chắc muốn xóa điểm giao hàng này</h4>
          </div>
          {/* modal footer */}
          <div className="modal__container-footer">
            <div className="modal__container-footer-buttons">
              <button
                onClick={handleCloseDeleteDialog}
                className="modal__container-footer-buttons-close"
              >
                Đóng
              </button>
              <button
                onClick={handleDelete}
                className="modal__container-footer-buttons-create"
              >
                Xóa
              </button>
            </div>
          </div>
          {/* *********************** */}
          {loading && <LoadingScreen />}
        </div>
      </Dialog>
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
      {/* *********************** */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default EditStaff;
