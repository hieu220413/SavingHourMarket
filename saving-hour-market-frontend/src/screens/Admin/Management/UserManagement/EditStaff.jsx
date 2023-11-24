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
    if (selectedRole !== "STAFF_ORD") {
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
  };

  return (
    <div className={`modal__container `}>
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
