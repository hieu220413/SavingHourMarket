import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./SuperMarketManagement.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faClipboard,
  faMagnifyingGlass,
  faPlus,
  faTrashCanArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import CreateSuperMarket from "./CreateSuperMarket";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import EditSuperMarket from "./EditSuperMarket";
import SupermarketItem from "./SupermarketItem";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Empty from "../../../../assets/Empty.png";
import { useIdToken, useAuthState } from "react-firebase-hooks/auth";
import SupermarketStoreManagement from "./SupermarketStoreManagement";

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
  const [loading, setLoading] = useState(false);
  const [isSwitchRecovery, setIsSwitchRecovery] = useState(false);
  const [supermarketStore, setSupermarketStore] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [supermarketName, setSupermarketName] = useState("");

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

  const [openSupermarketStore, setOpenSupermarketStore] = useState(false);
  const handleOpenSupermarketStore = () => setOpenSupermarketStore(true);
  const handleCloseSupermarketStore = () => setOpenSupermarketStore(false);

  const userState = useAuthState(auth);

  useEffect(() => {
    const fetchSupermarket = async () => {
      setLoading(true);
      if (!userState[1]) {
        const tokenId = await auth?.currentUser?.getIdToken();
        if (tokenId) {
          fetch(
            `${API.baseURL}/api/supermarket/getSupermarketForStaff?page=${
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
              console.log(respond);
              setSuperMarketList(respond.supermarketList);
              setTotalPage(respond.totalPage);
              setLoading(false);
            })
            .catch((err) => console.log(err));
        }
      }
    };

    fetchSupermarket();
  }, [page, searchValue, isSwitchRecovery, userState[1]]);

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
    setTextPage(1);
  };
  return (
    <div>
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

          {!isSwitchRecovery && (
            <div onClick={handleOpen} className="supermarket__header-button">
              <FontAwesomeIcon icon={faPlus} />
              Thêm siêu thị
            </div>
          )}
        </div>

        {/* data table + pagination*/}
        <div className="table__container table-box-shadow">
          {/* data table */}
          <table class="table ">
            {superMarketList.length !== 0 && (
              <>
                <thead>
                  <tr className="table-header-row">
                    <th>No.</th>
                    <th>Tên</th>
                    <th>Số điện thoại</th>
                    <th>Chi nhánh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {superMarketList.map((item, i) => (
                    <SupermarketItem
                      handleOpenSupermarketStore={handleOpenSupermarketStore}
                      setSupermarketStore={setSupermarketStore}
                      setTotalPage={setTotalPage}
                      page={page}
                      searchValue={searchValue}
                      setSuperMarketList={setSuperMarketList}
                      i={i}
                      item={item}
                      setError={setError}
                      error={error}
                      setLoading={setLoading}
                      setCurrentId={setCurrentId}
                      isSwitchRecovery={isSwitchRecovery}
                      setSupermarketName={setSupermarketName}
                    />
                  ))}
                </tbody>
              </>
            )}
            {superMarketList.length === 0 && (
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
                  Không có siêu thị nào
                </p>
              </div>
            )}
          </table>
          {/* ********************** */}

          <div>
            <button
              onClick={() => {
                setPage(1);
                setIsSwitchRecovery(!isSwitchRecovery);
              }}
              className=" buttonRecovery"
            >
              {isSwitchRecovery ? "Danh sách siêu thị" : "Siêu thị đã xóa"}
              <FontAwesomeIcon
                icon={isSwitchRecovery ? faClipboard : faTrashCanArrowUp}
              />
            </button>
          </div>

          {/* pagination */}
          {superMarketList.length !== 0 && (
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
          setIsSwitchRecovery={setIsSwitchRecovery}
        />
      </Dialog>
      <Dialog
        onClose={handleCloseSupermarketStore}
        aria-labelledby="customized-dialog-title"
        open={openSupermarketStore}
      >
        <SupermarketStoreManagement
          page={page}
          setTotalPage={setTotalPage}
          setSuperMarketList={setSuperMarketList}
          handleClose={handleCloseSupermarketStore}
          searchValue={searchValue}
          stores={supermarketStore}
          supermarketId={currentId}
          isSwitchRecovery={isSwitchRecovery}
          supermarketName={supermarketName}
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
      {loading && <LoadingScreen />}
    </div>
  );
};

export default SuperMarketManagement;
