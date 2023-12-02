import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import AddSupermarketStore from "./AddSupermarketStore";
import EditSupermatketStore from "./EditSupermatketStore";
import { auth } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SupermarketStoreManagement = ({
  handleClose,
  stores,
  page,
  setTotalPage,
  setSuperMarketList,
  searchValue,
  supermarketId,
  isSwitchRecovery,
  supermarketName,
}) => {
  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const [currentStores, setCurrentStores] = useState(stores);
  const handleCloseCreate = () => setOpenCreate(false);
  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
    text: "",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };
  const SupermarketStoreRow = ({ item, index }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleDelete = async () => {
      setLoading(true);
      const tokenId = await auth.currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/supermarket/deleteSupermarketAddressForSupermarket?supermarketAddressId=${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
        }
      )
        .then((res) => res.json())
        .then((respond) => {
          if (respond.code === 403) {
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "error",
              text: "Chi nhánh có sản phẩm đang được bán",
            });
            setLoading(false);
            return;
          }
          setCurrentStores(respond.supermarketAddressList);
          fetch(
            `${API.baseURL}/api/supermarket/getSupermarketForStaff?page=${
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
              setSuperMarketList(respond.supermarketList);
              setTotalPage(respond.totalPage);
              setOpenSnackbar({
                ...openSnackbar,
                open: true,
                severity: "success",
                text: "Xóa chi nhánh thành công",
              });
              setLoading(false);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };
    return (
      <>
        <tr key={index} className="table-body-row">
          <td>{index + 1}</td>

          <td>{item?.address}</td>
          <td>{item?.pickupPoint.address}</td>
          {!isSwitchRecovery && (
            <td>
              <i onClick={handleOpenEdit} class="bi bi-pencil-square"></i>
              <i onClick={handleOpenDelete} class="bi bi-trash-fill"></i>
            </td>
          )}
        </tr>
        <Dialog
          onClose={handleCloseEdit}
          aria-labelledby="customized-dialog-title"
          open={openEdit}
        >
          <EditSupermatketStore
            page={page}
            store={item}
            supermarketId={supermarketId}
            setTotalPage={setTotalPage}
            setSuperMarketList={setSuperMarketList}
            handleClose={handleCloseEdit}
            searchValue={searchValue}
            setOpenSuccessSnackbar={setOpenSnackbar}
            setCurrentStores={setCurrentStores}
            openSuccessSnackbar={openSnackbar}
            stores={currentStores}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseDelete}
          aria-labelledby="customized-dialog-title"
          open={openDelete}
        >
          <div className={`modal__container `}>
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">Xóa chi nhánh</h3>
              <FontAwesomeIcon onClick={handleCloseDelete} icon={faXmark} />
            </div>
          </div>

          <div className={`modal__container-body `}>
            <p style={{ fontSize: "16px", color: "#212B36" }}>
              Bạn có chắc muốn xóa chi nhánh này
            </p>
          </div>
          {/* modal footer */}
          <div className="modal__container-footer">
            <div className="modal__container-footer-buttons">
              <button
                onClick={handleCloseDelete}
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
        </Dialog>
      </>
    );
  };
  return (
    <div
      className="modal__container "
      style={{ width: "max-content", boxSizing: "content-box" }}
    >
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Chi tiết chi nhánh của {supermarketName}{" "}
        </h3>
        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
      </div>

      <div
        style={{ height: "65vh", overflowY: "scroll" }}
        className="modal__container-body"
      >
        {!isSwitchRecovery && (
          <div style={{ marginBottom: 0 }} className="supermarket__header">
            <div></div>

            <div
              onClick={handleOpenCreate}
              className="supermarket__header-button"
            >
              <FontAwesomeIcon icon={faPlus} />
              Thêm chi nhánh
            </div>
          </div>
        )}

        <div className="table__container">
          <table style={{}} class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Chi nhánh</th>
                <th>Điểm giao hàng liên kết</th>
                {!isSwitchRecovery && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {currentStores.map((item, index) => (
                <SupermarketStoreRow item={item} key={index} index={index} />
              ))}
            </tbody>
          </table>
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
        </div>
      </div>
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.severity}
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openSnackbar.text}
        </Alert>
      </Snackbar>
      <Dialog
        onClose={handleCloseCreate}
        aria-labelledby="customized-dialog-title"
        open={openCreate}
      >
        <AddSupermarketStore
          page={page}
          supermarketId={supermarketId}
          setTotalPage={setTotalPage}
          setSuperMarketList={setSuperMarketList}
          handleClose={handleCloseCreate}
          searchValue={searchValue}
          setOpenSuccessSnackbar={setOpenSnackbar}
          setCurrentStores={setCurrentStores}
          openSuccessSnackbar={openSnackbar}
          stores={currentStores}
        />
      </Dialog>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default SupermarketStoreManagement;
