import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./ProductManagement.scss";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import dayjs from "dayjs";
import { auth } from "../../../../firebase/firebase.config";
import { API } from "../../../../contanst/api";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [msg, setMsg] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [idToDelete, setIdToDelete] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [productToEdit, setProductToEdit] = useState(null);

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

  useEffect(() => {
    const fetchProduct = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/product/getProductsForStaff?page=${
          page - 1
        }&limit=5&name=${searchValue}`,
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
          setTotalPage(data.totalPage);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProduct();
  }, [page, searchValue]);

  const handleDeleteProduct = async (id) => {
    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/product/disable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(id),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res?.error) {
          setOpenSnackbar({ ...openSnackbar, open: true, severity: "error" });
          setMsg(res.error);
          return;
        }
        fetch(
          `${API.baseURL}/api/product/getProductsForStaff?page=${
            page - 1
          }&limit=5&name=${searchValue}`,
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
            setTotalPage(data.totalPage);
          })
          .catch((err) => {
            console.log(err);
          });
        handleCloseDelete();
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          severity: "success",
        });
        setMsg("Xóa sản phẩm thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const ProductRow = ({ item, index }) => {
    return (
      <>
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
            <i
              onClick={() => {
                setProductToEdit(item);
                handleOpenEdit();
              }}
              class="bi bi-pencil-square"
            ></i>
            <i
              onClick={() => {
                setIdToDelete(item.id);
                handleOpenDelete();
              }}
              class="bi bi-trash-fill"
            ></i>
          </td>
        </tr>
      </>
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
            Thêm sản phẩm
          </div>
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
                <ProductRow item={item} index={index} key={index} />
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
        <CreateProduct
          handleClose={handleClose}
          setProducts={setProducts}
          page={page}
          setTotalPage={setTotalPage}
          searchValue={searchValue}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseEdit}
        aria-labelledby="customized-dialog-title"
        open={openEdit}
      >
        <EditProduct
          handleClose={handleCloseEdit}
          product={productToEdit}
          setProducts={setProducts}
          page={page}
          setTotalPage={setTotalPage}
          searchValue={searchValue}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setMsg={setMsg}
        />
      </Dialog>

      <Dialog
        onClose={handleCloseDelete}
        aria-labelledby="customized-dialog-title"
        open={openDelete}
      >
        <div className={`modal__container `}>
          <div className="modal__container-header">
            <h3 className="modal__container-header-title">Xóa sản phẩm</h3>
            <FontAwesomeIcon onClick={handleCloseDelete} icon={faXmark} />
          </div>
        </div>

        <div className={`modal__container-body `}>
          <p style={{ fontSize: "16px", color: "#212B36" }}>
            Bạn có chắc muốn xóa sản phẩm này
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
              onClick={() => handleDeleteProduct(idToDelete)}
              className="modal__container-footer-buttons-create"
            >
              Xóa
            </button>
          </div>
        </div>
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
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductManagement;
