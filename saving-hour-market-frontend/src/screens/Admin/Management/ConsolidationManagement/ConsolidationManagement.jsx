import React, { useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MuiAlert from "@mui/material/Alert";
import { Dialog, Snackbar } from "@mui/material";
import Empty from "../../../../assets/Empty.png";
import {
  faMagnifyingGlass,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import CreateConsolidation from "./CreateConsolidation";
import EditConsolidation from "./EditConsolidation";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ConsolidationManagement = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [consolidationList, setConsolidationList] = useState([1, 2, 3]);
  const [searchValue, setSearchValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
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
  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const ConsolidationItem = ({ item, index }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const handleOpenEditDialog = () => setOpenEditDialog(true);
    const handleCloseEditDialog = () => setOpenEditDialog(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
    return (
      <tr className="table-body-row">
        <td>1</td>
        <td>121 Trần Văn Dư, Phường 13, Q.Tân Bình,Tp.HCM</td>

        <td>
          <i onClick={handleOpenEditDialog} class="bi bi-pencil-square"></i>
          <i onClick={handleOpenDeleteDialog} class="bi bi-trash-fill"></i>
        </td>
        <Dialog
          onClose={handleCloseEditDialog}
          aria-labelledby="customized-dialog-title"
          open={openEditDialog}
        >
          <EditConsolidation
            item={item}
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
            handleClose={handleCloseEditDialog}
            setConsolidationList={setConsolidationList}
            searchValue={searchValue}
            page={page}
            setTotalPage={setTotalPage}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseDeleteDialog}
          aria-labelledby="customized-dialog-title"
          open={openDeleteDialog}
        >
          <div className="modal__container">
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">
                Vô hiệu hóa điểm tập kết
              </h3>
              <FontAwesomeIcon
                onClick={handleCloseDeleteDialog}
                icon={faXmark}
              />
            </div>
          </div>
          <div className="modal__container-body">
            <h4> Bạn có chắc muốn vô hiệu hóa điểm tập kết này</h4>
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
                onClick={() => {
                  // handleDelete();
                }}
                className="modal__container-footer-buttons-create"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Dialog>
      </tr>
    );
  };

  const onSubmitSearch = (e) => {};
  const menuTabs = [
    {
      display: "Tài khoản",
      to: "/usermanagement",
    },
    {
      display: "Góp ý",
      to: "/feedbackmanagement",
    },
    {
      display: "Điểm giao hàng",
      to: "/pickuppointmanagement",
    },
    {
      display: "Giao dịch",
      to: "/transactionmanagement",
    },
    {
      display: "Khung giờ",
      to: "/timeframemanagement",
    },
    {
      display: "Điểm tập kết",
      to: "/consolidationmanagement",
    },
  ];
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <div style={{ marginBottom: 50 }} className="user__container">
        <div className="user__header">
          <div className="search">
            <form onSubmit={(e) => onSubmitSearch(e)}>
              <div onClick={(e) => onSubmitSearch(e)} className="search-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <input
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                type="text"
                placeholder="Từ khóa tìm kiếm"
              />
            </form>
          </div>
          {/* ****************** */}

          <div
            onClick={handleOpenCreateDialog}
            className="pickuppoint__header-button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Thêm điểm tập kết
          </div>
        </div>
        {/* data table + pagination*/}
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            {consolidationList.length !== 0 && (
              <>
                <thead>
                  <tr className="table-header-row">
                    <th>No.</th>
                    <th>Địa chỉ</th>

                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {consolidationList.map((item, index) => (
                    <ConsolidationItem item={item} index={index} />
                  ))}
                </tbody>
              </>
            )}

            {consolidationList.length === 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{ width: "350px", height: "350px" }}
                    src={Empty}
                    alt=""
                  />
                </div>
                <p
                  style={{
                    textAlign: "center",
                    color: "grey",
                    fontSize: 24,
                  }}
                >
                  Không có giao dịch
                </p>
              </div>
            )}
          </table>
          {/* ********************** */}

          {/* pagination */}
          {consolidationList.length !== 0 && (
            <div className="row pageBtn">
              <div className="col" style={{ textAlign: "right" }}>
                <br />
                <form action="">
                  <button
                    type="submit"
                    disabled={page === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(1);
                      setTextPage(1);
                    }}
                    className="btn btn-success  "
                    name="op"
                    value="FirstPage"
                    title="First Page"
                  >
                    <i className="bi bi-chevron-bar-left"></i>
                  </button>
                  <button
                    type="submit"
                    disabled={page === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page - 1);
                      setTextPage(page - 1);
                    }}
                    className="btn btn-success  "
                    name="op"
                    value="PreviousPage"
                    title="Previous Page"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    type="submit"
                    disabled={page === totalPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                      setTextPage(page + 1);
                    }}
                    className="btn btn-success  "
                    name="op"
                    value="NextPage"
                    title="Next Page"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                  <button
                    type="submit"
                    disabled={page === totalPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(totalPage);
                      setTextPage(totalPage);
                    }}
                    className="btn btn-success  "
                    name="op"
                    value="LastPage"
                    title="Last Page"
                  >
                    <i className="bi bi-chevron-bar-right"></i>
                  </button>
                  <input
                    type="number"
                    name="gotoPage"
                    value={textPage}
                    onChange={(e) => {
                      setTextPage(e.target.value);
                    }}
                    className=" "
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#000",
                      width: "40px",
                    }}
                    title="Enter page number"
                  />
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      if (textPage >= 1 && textPage <= totalPage) {
                        setPage(parseInt(textPage));
                      } else {
                        setTextPage(page);
                      }
                    }}
                    className="btn btn-success  "
                    name="op"
                    value="GotoPage"
                    title="Goto Page"
                  >
                    <i className="bi bi-arrow-up-right-circle"></i>
                  </button>
                </form>
                Page {page}/{totalPage}
              </div>
            </div>
          )}
          {/* ********************** */}
        </div>
        {/* ***************** */}
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
          onClose={handleCloseCreateDialog}
          aria-labelledby="customized-dialog-title"
          open={openCreateDialog}
        >
          <CreateConsolidation
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
            handleClose={handleCloseCreateDialog}
            setConsolidationList={setConsolidationList}
            searchValue={searchValue}
            page={page}
            setTotalPage={setTotalPage}
          />
        </Dialog>
        {loading && <LoadingScreen />}
      </div>
    </div>
  );
};

export default ConsolidationManagement;
