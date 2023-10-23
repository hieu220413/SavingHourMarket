import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./SuperMarketManagement.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import CreateSuperMarket from "./CreateSuperMarket";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import EditSuperMarket from "./EditSuperMarket";
import SupermarketItem from "./SupermarketItem";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SuperMarketManagement = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [superMarketList, setSuperMarketList] = useState([]);
  const [textPage, setTextPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "error",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchSupermarket = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/supermarket/getSupermarketForStaff?page=${
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
          setSuperMarketList(respond.supermarketList);
          setTotalPage(respond.totalPage);
        })
        .catch((err) => console.log(err));
    };
    fetchSupermarket();
  }, [page, searchValue]);

  const menuTabs = [
    {
      display: "Siêu thị",
      to: "/supermarketmanagement",
    },
    {
      display: "Sản phẩm",
      to: "/productmanagement",
    },
    {
      display: "Loại sản phẩm",
      to: "/categorymanagement",
    },
  ];

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchValue(textSearch);
    setPage(1);
  };
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      <div className="supermarket__container">
        <div className="supermarket__header">
          {/* search bar */}
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

          <div onClick={handleOpen} className="supermarket__header-button">
            <FontAwesomeIcon icon={faPlus} />
            Thêm siêu thị
          </div>
        </div>

        {/* data table + pagination*/}
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {superMarketList.map((item, i) => (
                <SupermarketItem
                  setTotalPage={setTotalPage}
                  page={page}
                  searchValue={searchValue}
                  setSuperMarketList={setSuperMarketList}
                  i={i}
                  item={item}
                  setError={setError}
                  error={error}
                />
              ))}
            </tbody>
          </table>
          {/* ********************** */}

          {/* pagination */}
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
                    if (e.target.value >= page && e.target.value <= totalPage)
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
                    setPage(textPage);
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
          {/* ********************** */}
        </div>
        {/* ***************** */}
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <CreateSuperMarket
          page={page}
          setTotalPage={setTotalPage}
          setSuperMarketList={setSuperMarketList}
          handleClose={handleClose}
          searchValue={searchValue}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setError={setError}
        />
      </Dialog>
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
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuperMarketManagement;
