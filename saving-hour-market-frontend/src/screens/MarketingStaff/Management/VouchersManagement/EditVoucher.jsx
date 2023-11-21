import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";
import dayjs from "dayjs";

const EditVoucher = ({
  handleClose,
  voucherToEdit,
  setVouchers,
  page,
  setTotalPage,
  searchValue,
  openSnackbar,
  setOpenSnackbar,
  setMsg,
}) => {
  const [categories, setCategories] = useState("");
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] = useState(
    voucherToEdit.productCategory.name
  );
  const [categoryId, setCategoryId] = useState(
    voucherToEdit.productCategory.id
  );
  const [voucherName, setVoucherName] = useState(voucherToEdit.name);
  const [expiredDate, setExpiredDate] = useState(
    dayjs(voucherToEdit.expiredDate).format("YYYY-MM-DD")
  );
  const [quantity, setQuantity] = useState(voucherToEdit.quantity);
  const [percentage, setPercentage] = useState(voucherToEdit.percentage);
  const [spentAmountRequired, setSpentAmountRequired] = useState(
    voucherToEdit.spentAmountRequired
  );

  const [image, setImage] = useState(voucherToEdit.imageUrl);
  const [fileName, setFileName] = useState("");
  const [imgToFirebase, setImgToFirebase] = useState("");

  const [loading, setLoading] = useState(false);

  // check error
  const [error, setError] = useState({
    category: "",
    voucherName: "",
    expiredDate: "",
    quantity: "",
    imageUrl: "",
    percentage: "",
    spentAmountRequired: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/product/getCategoryForStaff?page=0&limit=99`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.productCategoryList);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const uploadVoucherToFirebase = async () => {
    if (imgToFirebase !== "") {
      const imgRef = ref(imageDB, `voucherImage/${v4()}`);
      await uploadBytes(imgRef, imgToFirebase);
      try {
        const url = await getDownloadURL(imgRef);
        return url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async () => {
    if (categoryId === "") {
      setError({ ...error, category: "Vui lòng chọn loại sản phẩm" });
      return;
    }

    if (voucherName === "") {
      setError({ ...error, voucherName: "Không được để trống mã giảm giá" });
      return;
    }

    if (error.expiredDate !== "") {
      return;
    }
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    if (currentDate > expiredDate) {
      setError({
        ...error,
        expiredDate: "Không thể chọn trước ngày hiện tại",
      });
      return;
    }

    if (quantity === "") {
      setError({ ...error, quantity: "Không được để trống số lượng" });
    }
    if (quantity === 0) {
      setError({ ...error, quantity: "Số lượng không thể bằng 0" });
    }

    if (percentage === "") {
      setError({
        ...error,
        percentage: "Không được để trống phần trăm giảm giá",
      });
    }
    if (percentage === 0) {
      setError({ ...error, percentage: "Phần trăm giảm giá không thể bằng 0" });
    }

    if (spentAmountRequired === "") {
      setError({
        ...error,
        spentAmountRequired: "Không được để trống số tiền để dùng mã",
      });
    }
    if (spentAmountRequired === 0) {
      setError({
        ...error,
        spentAmountRequired: "Số tiền để dùng mã không thể bằng 0",
      });
    }

    const newImageUrl = await uploadVoucherToFirebase();
    if (newImageUrl === null) {
      setError({ ...error, imageUrl: "Chưa có ảnh" });
    }
    console.log("new img", newImageUrl);
    console.log("img", image);

    const voucherToSubmit = {
      id: voucherToEdit.id,
      name: voucherName,
      percentage: percentage,
      spentAmountRequired: spentAmountRequired,
      expiredDate: expiredDate,
      imageUrl: newImageUrl ? newImageUrl : image,
      quantity: quantity,
      productCategoryId: categoryId,
    };

    console.log(voucherToSubmit);

    const tokenId = await auth.currentUser.getIdToken();
    setLoading(true);
    fetch(`${API.baseURL}/api/discount/updateDiscount`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(voucherToSubmit),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        fetch(
          `${
            API.baseURL
          }/api/discount/getDiscountsForStaff?name=${searchValue}&page=${
            page - 1
          }&limit=5`,
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
            console.log(data);
            setVouchers(data.discountList);
            setTotalPage(data.totalPage);
            handleClose();
            setOpenSnackbar({
              ...openSnackbar,
              open: true,
              severity: "success",
            });
            setMsg("Sửa mã giảm giá thành công");
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="modal__container">
        <div className="modal__container-header">
          <h3 className="modal__container-header-title">
            Sửa thông tin mã giảm giá
          </h3>
          <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
        </div>
        <div
          className="modal__container-body"
          style={{ height: "65vh", overflowY: "scroll" }}
        >
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Tên loại sản phẩm
            </h4>
            <div>
              <div style={{ display: "flex" }}>
                <div className="dropdown" style={{ width: "400px" }}>
                  <div
                    className="dropdown-btn"
                    onClick={(e) =>
                      setIsActiveDropdownCate(!isActiveDropdownCate)
                    }
                  >
                    {selectedDropdownItemCate}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {isActiveDropdownCate && (
                    <div className="dropdown-content">
                      {categories.map((item, index) => (
                        <div
                          onClick={(e) => {
                            setSelectedDropdownItemCate(item.name);
                            setIsActiveDropdownCate(false);
                            setCategoryId(item.id);
                            setError({ ...error, category: "" });
                          }}
                          className="dropdown-item"
                          key={index}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {error.category && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.category}
                </p>
              )}
            </div>
          </div>

          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">Tên</h4>
            <div>
              {" "}
              <input
                placeholder="Nhập tên mã giảm giá"
                type="text"
                className="modal__container-body-inputcontrol-input"
                value={voucherName}
                onChange={(e) => {
                  setVoucherName(e.target.value);
                  setError({ ...error, voucherName: "" });
                }}
              />
              {error.voucherName && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.voucherName}
                </p>
              )}
            </div>
          </div>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Ngày hết hạn
            </h4>
            <div>
              <input
                placeholder="Nhập Ngày hết hạn"
                type="date"
                className="modal__container-body-inputcontrol-input"
                value={expiredDate}
                onChange={(e) => {
                  const date = new Date();
                  let day = date.getDate();
                  let month = date.getMonth() + 1;
                  let year = date.getFullYear();
                  let currentDate = `${year}-${month}-${day}`;
                  if (currentDate > e.target.value) {
                    setError({
                      ...error,
                      expiredDate: "Không thể chọn trước ngày hiện tại",
                    });
                    return;
                  }
                  setExpiredDate(e.target.value);
                  setError({ ...error, expiredDate: "" });
                }}
              />
              {error.expiredDate && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.expiredDate}
                </p>
              )}
            </div>
          </div>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Số lượng
            </h4>
            <div>
              {" "}
              <input
                min={0}
                placeholder="Nhập số lượng"
                type="number"
                className="modal__container-body-inputcontrol-input"
                value={quantity}
                onChange={(e) => {
                  if (!/^[0-9]*$/.test(e.target.value)) {
                    setError({
                      ...error,
                      quantity: "Chỉ có thể nhập số nguyên",
                    });
                    return;
                  }
                  setQuantity(e.target.value);
                  setError({ ...error, quantity: "" });
                }}
              />
              {error.quantity && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.quantity}
                </p>
              )}
            </div>
          </div>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Phần trăm giảm giá
            </h4>
            <div>
              {" "}
              <input
                min={0}
                placeholder="Nhập phần trăm giảm giá"
                type="number"
                className="modal__container-body-inputcontrol-input"
                value={percentage}
                onChange={(e) => {
                  if (!/^[0-9]*$/.test(e.target.value)) {
                    setError({
                      ...error,
                      percentage: "Chỉ có thể nhập số nguyên",
                    });
                    return;
                  }
                  setPercentage(e.target.value);
                  setError({ ...error, percentage: "" });
                }}
              />
              {error.percentage && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.percentage}
                </p>
              )}
            </div>
          </div>
          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Số tiền để dùng mã
            </h4>
            <div>
              {" "}
              <input
                min={0}
                placeholder="Nhập số tiền tối thiểu để dùng mã"
                type="number"
                className="modal__container-body-inputcontrol-input"
                value={spentAmountRequired}
                onChange={(e) => {
                  if (!/^[0-9]*$/.test(e.target.value)) {
                    setError({
                      ...error,
                      spentAmountRequired: "Chỉ có thể nhập số nguyên",
                    });
                    return;
                  }
                  setSpentAmountRequired(e.target.value);
                  setError({ ...error, spentAmountRequired: "" });
                }}
              />
              {error.spentAmountRequired && (
                <p
                  style={{ fontSize: "14px", marginBottom: "-10px" }}
                  className="text-danger"
                >
                  {error.spentAmountRequired}
                </p>
              )}
            </div>
          </div>

          <div className="modal__container-body-inputcontrol">
            <h4 className="modal__container-body-inputcontrol-label">
              Tải ảnh
            </h4>
            <div style={{ maxWidth: "400px" }}>
              <div
                className="imgWrapper"
                onClick={() => document.querySelector("#imgUpload").click()}
              >
                <input
                  id="imgUpload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={({ target: { files } }) => {
                    files[0] && setFileName(files[0].name);
                    if (files && files[0]) {
                      setImage(URL.createObjectURL(files[0]));
                      setImgToFirebase(files[0]);
                      setError({ ...error, imageUrl: "" });
                    }
                  }}
                />
                {image ? (
                  <img
                    src={image}
                    width={360}
                    height={160}
                    alt={fileName}
                    style={{ borderRadius: "5px" }}
                  />
                ) : (
                  <>
                    <MdCloudUpload color="#37a65b" size={60} />
                    <p style={{ fontSize: "14px" }}>Tải ảnh</p>
                  </>
                )}
              </div>
              <section className="uploaded-row">
                <AiFillFileImage color="#37a65b" size={25} />
                <span className="upload-content">
                  {/* {fileName} - */}
                  <MdDelete
                    color="#37a65b"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFileName("Chưa có hình ảnh loại sản phẩm phụ");
                      setImage(null);
                      setImgToFirebase("");
                    }}
                    size={25}
                  />
                </span>
              </section>
            </div>
          </div>
        </div>
        {/* modal footer */}
        <div className="modal__container-footer">
          <div className="modal__container-footer-buttons">
            <button
              className="modal__container-footer-buttons-close"
              onClick={handleClose}
            >
              Đóng
            </button>
            <button
              onClick={handleSubmit}
              className="modal__container-footer-buttons-create"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingScreen />}
    </>
  );
};

export default EditVoucher;
