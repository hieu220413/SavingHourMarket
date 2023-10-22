import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./ProductManagement.scss";
import CreateProduct from "./CreateProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { auth } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import CreateProductByExcel from "./CreateProductByExcel";
import { onAuthStateChanged } from "firebase/auth";
import ConfirmProductUploadByExcel from "./ConfirmProductUploadByExcel";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmProductList, setConfirmProductList] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openCreateByExcel, setOpenCreateByExcel] = useState(false);
  const handleOpenCreateByExcel = () => setOpenCreateByExcel(true);
  const handleCloseCreateByExcel = () => setOpenCreateByExcel(false);

  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const handleOpenConfirmCreate = () => setOpenConfirmCreate(true);
  const handleCloseConfirmCreate = () => setOpenConfirmCreate(false);

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      onAuthStateChanged(auth, async (userAuth) => {
        if (userAuth) {
          const tokenId = await auth.currentUser.getIdToken();
          fetch(
            `${API.baseURL}/api/product/getProductsForStaff?page=0&limit=5`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenId}`,
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              setProducts(data.productList);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    };
    fetchProduct();
  }, []);
  const menuTabs = [
    {
      display: "Siêu thị",
      to: "/supermarketmanagement",
    },
    {
      display: "Sản phẩm",
      to: "/productmanagement",
    },
  ];

  const ProductRow = ({ item, index }) => {
    return (
      <tr className="table-body-row">
        <td style={{ paddingTop: 30 }}>{index + 1}</td>
        <td>
          <img width="80px" height="60px" src={item.imageUrl} />
        </td>
        <td style={{ paddingTop: 30 }}>{item.name}</td>
        <td style={{ paddingTop: 30 }}>
          {dayjs(item.expiredDate).format("DD/MM/YYYY")}
        </td>
        <td style={{ paddingTop: 30 }}>
          {item.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </td>
        <td style={{ paddingTop: 30 }}>{item.quantity}</td>
        <td style={{ paddingTop: 30 }}>
          {item.productSubCategory.productCategory.name}
        </td>
        <td style={{ paddingTop: 30 }}>
          <i class="bi bi-pencil-square"></i>
          <i class="bi bi-trash-fill"></i>
        </td>
      </tr>
    );
  };
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
      {/* Table */}
      <div className="supermarket__container">
        <div className="supermarket__header">
          {/* search bar */}
          <div className="search">
            <div className="search-icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <input type="text" placeholder="Từ khóa tìm kiếm" />
          </div>
          {/* ****************** */}

          <div onClick={handleClick} className="supermarket__header-button">
            <FontAwesomeIcon icon={faPlus} />
            Thêm sản phẩm
          </div>
          <Menu
            style={{ top: "5px" }}
            id="basic-menu"
            anchorEl={anchorEl}
            open={openDropdown}
            onClose={handleCloseDropdown}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              style={{ fontSize: "14px" }}
              onClick={() => {
                handleOpen();
                handleCloseDropdown();
              }}
            >
              Thêm thủ công
            </MenuItem>
            <MenuItem
              style={{ fontSize: "14px" }}
              onClick={() => {
                handleOpenCreateByExcel();
                handleCloseDropdown();
              }}
            >
              Thêm bằng file excel
            </MenuItem>
          </Menu>
        </div>

        {/* data table + pagination*/}
        <div className="table__container" style={{ height: "650px" }}>
          {/* data table */}
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Hình ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Ngày hết hạn</th>
                <th>Giá tiền</th>
                <th>Số lượng</th>
                <th>Tên loại sản phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <ProductRow item={item} index={index} />
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
                  className="btn btn-success  "
                  name="op"
                  value="FirstPage"
                  title="First Page"
                >
                  <i className="bi bi-chevron-bar-left"></i>
                </button>
                <button
                  type="submit"
                  className="btn btn-success  "
                  name="op"
                  value="PreviousPage"
                  title="Previous Page"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  type="submit"
                  className="btn btn-success  "
                  name="op"
                  value="NextPage"
                  title="Next Page"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
                <button
                  type="submit"
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
                  value="1"
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
                  className="btn btn-success  "
                  name="op"
                  value="GotoPage"
                  title="Goto Page"
                >
                  <i className="bi bi-arrow-up-right-circle"></i>
                </button>
              </form>
              Page 1/10
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
        <CreateProduct />
      </Dialog>
      <Dialog
        onClose={handleCloseCreateByExcel}
        aria-labelledby="customized-dialog-title"
        open={openCreateByExcel}
      >
        <CreateProductByExcel
          handleOpenConfirmCreate={handleOpenConfirmCreate}
          setConfirmProductList={setConfirmProductList}
          handleClose={handleCloseCreateByExcel}
        />
      </Dialog>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={openConfirmCreate}
      >
        <ConfirmProductUploadByExcel
          confirmProductList={confirmProductList}
          setConfirmProductList={setConfirmProductList}
          handleClose={handleCloseConfirmCreate}
          setOpenSuccessSnackbar={setOpenSnackbar}
          openSuccessSnackbar={openSnackbar}
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
          Thêm mới thành công
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductManagement;
