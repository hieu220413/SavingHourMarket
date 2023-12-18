import {
  faMagnifyingGlass,
  faPlus,
  faTable,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import EditConfirmProduct from "./EditConfirmProduct";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { API } from "../../../../contanst/api";
import { auth } from "../../../../firebase/firebase.config";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import NullImage from "../../../../assets/addImage.png";
import ProductBatchUploadByExcel from "./ProductBatchUploadByExcel";
import ErrorProductUploadByExcel from "./ErrorProductUploadByExcel";
import ProductImageSlider from "./ProductImageSlider";
import CreateProductImageSlider from "./CreateProductImageSlider";
import EditImage from "./EditImage";
import EditProductByExcel from "./EditProductByExcel";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ConfirmProductUploadByExcel = ({
  handleClose,
  confirmProductList,
  setConfirmProductList,
  setOpenSuccessSnackbar,
  openSuccessSnackbar,
  setMsg,
  setProducts,
  searchValue,
  page,
  setTotalPage,
  setIsSwitchRecovery,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
    text: "",
    edit: true,
  });
  const { vertical, horizontal } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState(
    Object.entries(confirmProductList.errorFields).map(([key, value]) => {
      return { index: key, value: value };
    })
  );
  const [showProductList, setShowProductList] = useState(
    confirmProductList.productList
  );

  const [pageProduct, setPageProduct] = useState(1);
  const [totalPageProduct, setTotalPageProduct] = useState(1);
  const [textPage, setTextPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [searchProductValue, setSearchProductValue] = useState("");

  const [openEditByExcel, setOpenEditByExcel] = useState(false);
  const handleOpenEditByExcel = () => setOpenEditByExcel(true);
  const handleCloseEditByExcel = () => setOpenEditByExcel(false);

  const [openImageUrlList, setOpenImageUrlList] = useState(false);
  const handleOpenImageUrlList = () => setOpenImageUrlList(true);
  const handleCloseImageUrlList = () => setOpenImageUrlList(false);

  const [openConfirmClose, setOpenConfirmClose] = useState(false);
  const handleOpenConfirmClose = () => setOpenConfirmClose(true);
  const handleCloseConfirmClose = () => setOpenConfirmClose(false);

  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const handleOpenConfirmCreate = () => setOpenConfirmCreate(true);
  const handleCloseConfirmCreate = () => setOpenConfirmCreate(false);

  const [imageUrlList, setImageUrlList] = useState(null);

  function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  }

  useEffect(() => {
    const showAllProductListTemp = confirmProductList.productList.filter(
      (item) => {
        const emptyString = "";
        if (item.name) {
          return xoa_dau(item.name.toLowerCase()).includes(
            xoa_dau(searchProductValue.toLowerCase())
          );
        }
        return emptyString.includes(xoa_dau(searchProductValue.toLowerCase()));
      }
    );
    const totalPageTemp = Math.ceil(showAllProductListTemp.length / 4);
    const showProductByPage = showAllProductListTemp.filter(
      (item, index) => index >= 4 * (pageProduct - 1) && index < 4 * pageProduct
    );
    setTotalPageProduct(totalPageTemp);
    setShowProductList(showProductByPage);
    setErrorList(
      Object.entries(confirmProductList.errorFields).map(([key, value]) => {
        return { index: key, value: value };
      })
    );
  }, [pageProduct, searchProductValue, confirmProductList.productList]);

  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  function isEmptyObject(value) {
    if (value == null) {
      // null or undefined
      return false;
    }

    if (typeof value !== "object") {
      // boolean, number, string, function, etc.
      return false;
    }

    const proto = Object.getPrototypeOf(value);

    // consider `Object.create(null)`, commonly used as a safe map
    // before `Map` support, an empty object as well as `{}`
    if (proto !== null && proto !== Object.prototype) {
      return false;
    }

    return isEmpty(value);
  }

  const handleConfirm = async () => {
    setLoading(true);
    const productListWithMainIndex = confirmProductList.productList.map(
      (item, index) => {
        return { ...item, mainIndex: index + 1 };
      }
    );
    const createProductListWithMainIndex = productListWithMainIndex.filter(
      (item, index) =>
        !errorList.some((i) => parseInt(i.index) === index + 1) &&
        item.imageUrls.length !== 0
    );
    const createProductList = confirmProductList.productList.filter(
      (item, index) =>
        !errorList.some((i) => parseInt(i.index) === index + 1) &&
        item.imageUrls.length !== 0
    );

    if (createProductList.length === 0) {
      setOpenSnackbar({
        ...openSnackbar,
        open: true,
        severity: "error",
        text: "Không có sản phẩm nào đủ điều kiện đưa vào hệ thống !",
      });
      setLoading(false);
      return;
    }

    const tokenId = await auth.currentUser.getIdToken();
    fetch(`${API.baseURL}/api/product/create/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(confirmProductList.productList),
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res);
        if (res.status === 500) {
          setOpenSnackbar({
            ...openSnackbar,
            open: true,
            severity: "error",
            text: "Lỗi hệ thống !",
          });
          setLoading(false);
          return;
        }
        if (!isEmptyObject(res.errorFields)) {
          let responseErrorList = Object.entries(res.errorFields).map(
            ([key, value]) => {
              return { index: key, value: value };
            }
          );

          // console.log(newErrorList);
          // const errorProductList = res.productList.filter((item, index) =>
          //   responseErrorList.some((i) => parseInt(i.index) === index + 1)
          // );

          // const newErrorList = responseErrorList.map((err, errIndex) => {
          //   return { ...err, index: (errIndex + 1).toString() };
          // });

          const newErrorFields = responseErrorList.reduce(
            (a, v) => ({ ...a, [v.index]: v.value }),
            {}
          );

          setErrorList(responseErrorList);
          setPageProduct(1);
          setConfirmProductList({
            errorFields: newErrorFields,
            productList: res.productList,
          });

          setMsg("Thêm mới thành công");
          setOpenSuccessSnackbar({
            ...openSuccessSnackbar,
            open: true,
            severity: "success",
          });
          setLoading(false);
        } else {
          fetch(
            `${API.baseURL}/api/product/getProductsForStaff?page=${
              page - 1
            }&limit=5&name=${searchValue}&status=ENABLE`,
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
              setLoading(false);
              setIsSwitchRecovery(false);
              handleClose();
              setMsg("Thêm mới thành công");
              setOpenSuccessSnackbar({
                ...openSuccessSnackbar,
                open: true,
                severity: "success",
              });
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
      })
      .catch((err) => console.log(err));
  };

  const ProductRow = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openImageUpload, setOpenImageUpload] = useState(false);
    const handleOpenImageUpload = () => setOpenImageUpload(true);
    const handleCloseImageUpload = () => setOpenImageUpload(false);

    const [openProductBatch, setOpenProductBatch] = useState(false);
    const handleOpenProductBatch = () => setOpenProductBatch(true);
    const handleCloseProductBatch = () => setOpenProductBatch(false);

    const [openErrorList, setOpenErrorList] = useState(false);
    const handleOpenErrorList = () => setOpenErrorList(true);
    const handleCloseErrorList = () => setOpenErrorList(false);

    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const itemIndex = confirmProductList.productList.findIndex(
      (product) => product === item
    );

    const errorField = errorList.find(
      (item) => parseInt(item.index) === itemIndex + 1
    );

    return (
      <>
        <tr key={index} className="table-body-row">
          <td style={{ paddingTop: 30 }}>
            {(pageProduct - 1) * 4 + index + 1}
          </td>
          <td>
            {item.imageUrls?.length !== 0 && item.imageUrls !== null ? (
              <div style={{ position: "relative" }}>
                <img
                  alt="hình"
                  style={{ cursor: "pointer" }}
                  width="80px"
                  height="60px"
                  className="img-scale"
                  onClick={handleOpenImageUpload}
                  src={item?.imageUrls[0]}
                />
                <div className="image-number">1/{item.imageUrls.length}</div>
              </div>
            ) : (
              <img
                className="img-scale"
                alt="hình"
                width="80px"
                height="60px"
                src={NullImage}
                onClick={handleOpenImageUpload}
              />
            )}
          </td>
          <td style={{ paddingTop: 30 }}>
            {" "}
            {item?.name ? (
              item?.name
            ) : (
              <p style={{ fontWeight: 700 }} className="text-danger">
                Lỗi tên
              </p>
            )}
          </td>
          <td style={{ paddingTop: 30 }}>{item?.unit}</td>

          <td style={{ paddingTop: 30 }}>
            {item?.productSubCategory?.id ? (
              item?.productSubCategory?.name
            ) : (
              <p style={{ fontWeight: 700 }} className="text-danger">
                Lỗi loại sản phẩm phụ
              </p>
            )}
          </td>
          <td style={{ paddingTop: 30 }}>
            {item?.supermarket?.id ? (
              item?.supermarket?.name
            ) : (
              <p style={{ fontWeight: 700 }} className="text-danger">
                Lỗi siêu thị
              </p>
            )}
          </td>
          <td style={{ paddingTop: 30 }}>
            {item?.priceListed ? (
              item?.priceListed.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            ) : (
              <p style={{ fontWeight: 700 }} className="text-danger">
                Lỗi giá niêm yết
              </p>
            )}
          </td>
          <td style={{ paddingTop: 30 }}>
            <i
              onClick={() => {
                handleOpenProductBatch();
              }}
              className="bi bi-list"
            ></i>
          </td>
          <td style={{ paddingTop: 30 }}>
            <i onClick={handleOpen} class="bi bi-pencil-square"></i>
            <i onClick={handleOpenDelete} class="bi bi-trash-fill"></i>
          </td>
          <td style={{ paddingTop: 30 }}>
            {errorList.some((item) => parseInt(item.index) === itemIndex + 1) ||
            item.imageUrls?.length === 0 ||
            item.imageUrls === null ? (
              <i
                onClick={handleOpenErrorList}
                style={{ marginLeft: "-3px" }}
                class="bi bi-exclamation-circle-fill text-danger"
              ></i>
            ) : (
              <i
                style={{ marginLeft: "-3px" }}
                class="bi bi-check-circle-fill"
              ></i>
            )}
          </td>
        </tr>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <EditConfirmProduct
            confirmProductList={confirmProductList}
            setConfirmProductList={setConfirmProductList}
            handleClose={handleClose}
            product={item}
            index={itemIndex}
            setOpenSnackbar={setOpenSnackbar}
            setErrorList={setErrorList}
            errorList={errorList}
            openSnackbar={openSnackbar}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseDelete}
          aria-labelledby="customized-dialog-title"
          open={openDelete}
        >
          <div className="modal__container">
            <div className="modal__container-header">
              <h3 className="modal__container-header-title">Xóa sản phẩm</h3>
              <FontAwesomeIcon onClick={handleCloseDelete} icon={faXmark} />
            </div>
          </div>
          <div className="modal__container-body">
            <h4> Bạn có chắc muốn xóa sản phẩm này</h4>
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
                onClick={() => {
                  let newErrorList = errorList.filter(
                    (err, i) => err.index != itemIndex + 1
                  );
                  newErrorList = newErrorList.map((err, i) => {
                    if (err.index > itemIndex + 1) {
                      return { ...err, index: (err.index - 1).toString() };
                    }
                    return err;
                  });
                  const newErrorFields = newErrorList.reduce(
                    (a, v) => ({ ...a, [v.index]: v.value }),
                    {}
                  );

                  setErrorList(newErrorList);
                  setConfirmProductList({
                    errorFields: newErrorFields,
                    productList: confirmProductList.productList.filter(
                      (item, i) => i !== itemIndex
                    ),
                  });
                  setOpenSnackbar({
                    ...openSnackbar,
                    open: true,
                    severity: "success",
                  });
                }}
                className="modal__container-footer-buttons-create"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          onClose={handleCloseProductBatch}
          aria-labelledby="customized-dialog-title"
          open={openProductBatch}
        >
          <ProductBatchUploadByExcel
            handleClose={handleCloseProductBatch}
            productBatch={item.productBatchList}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseImageUpload}
          aria-labelledby="customized-dialog-title"
          open={openImageUpload}
        >
          <EditImage
            setConfirmProductList={setConfirmProductList}
            confirmProductList={confirmProductList}
            handleClose={handleCloseImageUpload}
            product={item}
            index={itemIndex}
            setOpenSnackbar={setOpenSnackbar}
            openSnackbar={openSnackbar}
          />
        </Dialog>
        <Dialog
          onClose={handleCloseErrorList}
          aria-labelledby="customized-dialog-title"
          open={openErrorList}
        >
          <ErrorProductUploadByExcel
            imageUrls={item.imageUrls}
            handleClose={handleCloseErrorList}
            errorList={errorField ? errorField.value : []}
          />
        </Dialog>
      </>
    );
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchProductValue(textSearch);
    setPageProduct(1);
  };

  return (
    <div style={{ width: "1200px" }} className="modal__container modal-scroll">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">
          Xác nhận danh sách sản phẩm
        </h3>
        <FontAwesomeIcon onClick={handleOpenConfirmClose} icon={faXmark} />
      </div>

      <div
        style={{ display: "flex", alignItems: "center" }}
        className="modal__container-body"
      >
        <div
          style={{ width: "100%", marginBottom: "-20px", marginLeft: 40 }}
          className="supermarket__header"
        >
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
          <div
            onClick={handleOpenEditByExcel}
            className="supermarket__header-button"
          >
            <FontAwesomeIcon icon={faTable} />
            Chỉnh sửa bằng excel
          </div>
        </div>

        <div className="table__container">
          {/* data table */}
          <table class="table ">
            <thead>
              <tr className="table-header-row">
                <th>No.</th>
                <th>Hình ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Đơn vị</th>
                <th>Loại sản phẩm phụ</th>
                <th>Siêu thị</th>
                <th>Giá niêm yết</th>
                <th>Lô hàng</th>
                <th>Thao tác</th>
                <th>Lỗi</th>
              </tr>
            </thead>
            <tbody>
              {showProductList.map((item, index) => (
                <ProductRow item={item} index={index} />
              ))}
            </tbody>
          </table>
          <div className="row pageBtn">
            <div className="col" style={{ textAlign: "right" }}>
              <br />
              <form action="">
                <button
                  type="submit"
                  disabled={pageProduct === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPageProduct(1);
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
                  disabled={pageProduct === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPageProduct(pageProduct - 1);
                    setTextPage(pageProduct - 1);
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
                  disabled={pageProduct === totalPageProduct}
                  onClick={(e) => {
                    e.preventDefault();
                    setPageProduct(pageProduct + 1);
                    setTextPage(pageProduct + 1);
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
                  disabled={pageProduct === totalPageProduct}
                  onClick={(e) => {
                    e.preventDefault();
                    setPageProduct(totalPageProduct);
                    setTextPage(totalPageProduct);
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
                    if (textPage >= 1 && textPage <= totalPageProduct) {
                      setPageProduct(parseInt(textPage));
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
              Trang {pageProduct}/{totalPageProduct}
            </div>
          </div>
        </div>
      </div>
      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button
            onClick={handleOpenConfirmClose}
            className="modal__container-footer-buttons-close"
          >
            Đóng
          </button>
          <button
            onClick={handleOpenConfirmCreate}
            className="modal__container-footer-buttons-create"
          >
            Xác nhận
          </button>
        </div>
      </div>
      {/* *********************** */}
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={2000}
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
        onClose={handleCloseImageUrlList}
        aria-labelledby="customized-dialog-title"
        open={openImageUrlList}
      >
        <CreateProductImageSlider
          handleClose={handleCloseImageUrlList}
          imageUrlList={imageUrlList}
        />
      </Dialog>
      <Dialog
        onClose={handleCloseConfirmClose}
        aria-labelledby="customized-dialog-title"
        open={openConfirmClose}
      >
        <div className="modal__container">
          <div className="modal__container-header">
            <h3 className="modal__container-header-title">Xác nhận đóng</h3>
            <FontAwesomeIcon onClick={handleCloseConfirmClose} icon={faXmark} />
          </div>
        </div>
        <div className="modal__container-body">
          <h4 className="text-danger">
            Lưu ý : sau khi đóng mọi sản phẩm bạn đã chỉnh sửa sẽ không được lưu
            lại !
          </h4>
        </div>
        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              onClick={handleCloseConfirmClose}
              className="modal__container-footer-buttons-close"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                handleCloseConfirmClose();
                handleClose();
              }}
              className="modal__container-footer-buttons-create"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        onClose={handleCloseConfirmCreate}
        aria-labelledby="customized-dialog-title"
        open={openConfirmCreate}
      >
        <div className="modal__container">
          <div className="modal__container-header">
            <h3 className="modal__container-header-title">
              Xác nhận thêm sản phẩm
            </h3>
            <FontAwesomeIcon
              onClick={handleCloseConfirmCreate}
              icon={faXmark}
            />
          </div>
        </div>
        <div className="modal__container-body">
          <h4 className="text-danger">
            Lưu ý : Những sản phẩm chưa sửa hết lỗi sẽ không được đưa vào hệ
            thống
          </h4>
        </div>
        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              onClick={handleCloseConfirmCreate}
              className="modal__container-footer-buttons-close"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                handleCloseConfirmCreate();
                handleConfirm();
              }}
              className="modal__container-footer-buttons-create"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        onClose={handleCloseEditByExcel}
        aria-labelledby="customized-dialog-title"
        open={openEditByExcel}
      >
        <EditProductByExcel
          handleClose={handleCloseEditByExcel}
          setConfirmProductList={setConfirmProductList}
          confirmProductList={confirmProductList}
          setPageProduct={setPageProduct}
          setSearchProductValue={setSearchProductValue}
        />
      </Dialog>

      {loading && <LoadingScreen />}
    </div>
  );
};

export default ConfirmProductUploadByExcel;
