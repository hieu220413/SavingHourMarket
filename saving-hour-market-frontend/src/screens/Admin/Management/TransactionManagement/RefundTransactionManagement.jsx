import React, { useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import Empty from "../../../../assets/Empty.png";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RefundTransactionManagement = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [transactionList, setTransactionList] = useState([1, 2, 3]);
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

  const TransactionItem = ({ item, index }) => {
    return (
      <tr className="table-body-row">
        <td>1</td>
        <td>05-05-2023 07:00AM</td>
        <td>VNPAy</td>
        <td>500.000đ</td>
        <td>
          <div className="refund-button">Hoàn trả</div>
        </td>
      </tr>
    );
  };

  const onSubmitSearch = (e) => {};

  return (
    <div style={{ marginBottom: 50 }} className="user__container">
      <h3 className="user__title">Giao dịch cần hoàn trả</h3>
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
      </div>
      {/* data table + pagination*/}
      <div className="table__container">
        {/* data table */}
        <table class="table ">
          {transactionList.length !== 0 && (
            <>
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Ngày tạo</th>
                  <th>Phương thức</th>
                  <th>Tổng cộng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {transactionList.map((item, index) => (
                  <TransactionItem staff={item} index={index} />
                ))}
              </tbody>
            </>
          )}

          {transactionList.length === 0 && (
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
        {transactionList.length !== 0 && (
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
      {loading && <LoadingScreen />}
    </div>
  );
};

export default RefundTransactionManagement;
