import React, { useEffect, useState } from "react";
import "./CreateProduct.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCaretDown,
  faRepeat,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import dayjs from "dayjs";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { auth, imageDB } from "../../../../firebase/firebase.config";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { API } from "../../../../contanst/api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateProduct = () => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("Chưa có hình ảnh sản phẩm");
  const [imgToFirebase, setImgToFirebase] = useState("");

  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );
  const [imgSubCateToFirebase, setImgSubCateToFirebase] = useState("");

  const [supermarkets, setSupermarkets] = useState([]);
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [selectedDropdownItem, setSelectedDropdownItem] =
    useState("Chọn siêu thị");
  const [isCreateNewSupermarket, setIsCreateNewSupermarket] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isActiveDropdownCate, setIsActiveDropdownCate] = useState(false);
  const [selectedDropdownItemCate, setSelectedDropdownItemCate] =
    useState("Chọn loại sản phẩm");
  const [isCreateNewCate, setIsCreateNewCate] = useState(false);

  const [subCategories, setSubCategories] = useState([]);
  const [isActiveDropdownSubCate, setIsActiveDropdownSubCate] = useState(false);
  const [selectedDropdownItemSubCate, setSelectedDropdownItemSubCate] =
    useState("Chọn loại sản phẩm phụ");
  const [isCreateNewSubCate, setIsCreateNewSubCate] = useState(false);

  // validate data
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [priceOriginal, setPriceOriginal] = useState(0);
  const [description, setDescription] = useState("");
  const [expiredDate, setExpiredDate] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [supermarket, setSupermarket] = useState("");
  const [supermarketHotline, setSuperMarketHotline] = useState("");
  const [supermarketAddress, setSupermarketAddress] = useState([]);
  const [category, setCategory] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(0);
  const [imageUrlSubCate, setImageUrlSubCate] = useState("");

  // check error
  const [checkCategorySelected, setCheckCategorySelected] = useState(false);
  const [error, setError] = useState({
    productName: "",
    price: "",
    priceOriginal: "",
    description: "",
    expiredDate: "",
    quantity: "",
    imageUrl: "",
    supermarket: "",
    supermarketHotline: "",
    supermarketAddress: "",
    category: "",
    subCateName: "",
    allowableDisplayThreshold: "",
    imageUrlSubCate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const tokenId = await auth.currentUser.getIdToken();
      fetch(`${API.baseURL}/api/supermarket/getSupermarketForStaff`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSupermarkets(data.supermarketList);
        });

      fetch(`${API.baseURL}/api/product/getAllCategory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
        });
    };
    fetchData();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  // const { open, vertical, horizontal, feature } = openSnackbar;

  const [openErrorSnackbar, setOpenErrorSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    error: "",
  });

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar({ ...openSnackbar, open: false });
  };

  const handleAddSupermarketAddress = () => {
    console.log("add");
  };

  const handleUploadImageToFirebase = async () => {
    if (imgToFirebase !== "") {
      const imgRef = ref(imageDB, `productImage/${v4()}`);
      await uploadBytes(imgRef, imgToFirebase);
      try {
        const url = await getDownloadURL(imgRef);
        setImageUrl(url);
      } catch (error) {
        console.log(error);
      }
    }
    if (imgSubCateToFirebase !== "") {
      const imgRefSubCate = ref(imageDB, `subCateImage/${v4()}`);
      await uploadBytes(imgRefSubCate, imgSubCateToFirebase);
      try {
        const url = await getDownloadURL(imgRefSubCate);
        setImageUrlSubCate(url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = () => {
    handleUploadImageToFirebase();
    if (productName === "") {
      setError({ ...error, productName: "Vui lòng không để trống" });
      return;
    }
    if (price < 0 || !price) {
      setError({ ...error, price: "Số tiền nhập vào phải lớn hớn 0" });
      return;
    }
    if (priceOriginal < 0 || !priceOriginal) {
      setError({ ...error, priceOriginal: "Số tiền nhập vào phải lớn hớn 0" });
      return;
    }
    if (description === "") {
      setError({ ...error, description: "Vui lòng không để trống" });
      return;
    }
    if (quantity < 0 || !quantity) {
      setError({ ...error, quantity: "Số lượng nhập vào phải lớn hớn 0" });
      return;
    }
    if (imageUrl === "") {
      setError({ ...error, imageUrl: "Chưa có ảnh sản phẩm" });
    }
  };

  return (
    // modal header
    <div className="modal__container">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Thêm sản phẩm mới</h3>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      {/* ****************** */}

      {/* modal body */}
      <div
        className="modal__container-body"
        style={{ height: "65vh", overflowY: "scroll" }}
      >
        {/* Supermarket */}
        {isCreateNewSupermarket === false && (
          <>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên siêu thị
              </h4>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div className="dropdown">
                  <div
                    className="dropdown-btn"
                    onClick={(e) => setIsActiveDropdown(!isActiveDropdown)}
                  >
                    {selectedDropdownItem}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                  {isActiveDropdown && (
                    <div className="dropdown-content">
                      {supermarkets.map((item, index) => (
                        <div
                          onClick={(e) => {
                            setSelectedDropdownItem(item.name);
                            setIsActiveDropdown(false);
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
                <button
                  style={{
                    width: "120px",
                  }}
                  className="buttonSwitchSelectSuperMarket"
                  onClick={(e) => {
                    setIsCreateNewSupermarket(true);
                  }}
                >
                  Thêm mới
                  <FontAwesomeIcon
                    icon={faRepeat}
                    style={{ paddingLeft: 10 }}
                  />
                </button>
              </div>
            </div>
          </>
        )}
        {/* Create Supermarket */}
        {isCreateNewSupermarket && (
          <>
            <button
              className="buttonSwitchSelectSuperMarket"
              onClick={(e) => {
                setIsCreateNewSupermarket(false);
              }}
            >
              Thêm siêu thị có sẵn
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên siêu thị
              </h4>
              <input
                placeholder="Nhập tên siêu thị"
                type="text"
                className="modal__container-body-inputcontrol-input"
              />
            </div>

            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Hotline siêu thị
              </h4>
              <input
                placeholder="Nhập Hotline siêu thị"
                type="text"
                className="modal__container-body-inputcontrol-input"
              />
            </div>

            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Địa chỉ chi nhánh
              </h4>
              <input
                placeholder="Nhập địa chỉ chi nhánh"
                type="text"
                className="modal__container-body-inputcontrol-input"
              />
            </div>

            <div className="modal__container-body-inputcontrol">
              <button
                onClick={(e) => {
                  handleAddSupermarketAddress();
                }}
                className="buttonAddSupermarkerAddress"
              >
                Thêm chi nhánh thứ
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ paddingLeft: 10 }}
                />
              </button>
            </div>
          </>
        )}

        {/* Categories */}
        {isCreateNewCate === false && (
          <>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên loại sản phẩm
              </h4>
              <div style={{ display: "flex" }}>
                <div className="dropdown">
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
                            setSubCategories(item.productSubCategories);
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
                <button
                  style={{
                    width: "120px",
                  }}
                  className="buttonSwitchSelectSuperMarket"
                  onClick={(e) => {
                    setIsCreateNewCate(true);
                  }}
                >
                  Thêm mới
                  <FontAwesomeIcon
                    icon={faRepeat}
                    style={{ paddingLeft: 10 }}
                  />
                </button>
              </div>
            </div>
            {/* Sub cate */}
            {isCreateNewSubCate === false && (
              <>
                <div className="modal__container-body-inputcontrol">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Tên loại sản phẩm phụ
                  </h4>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div className="dropdown">
                      <div
                        className="dropdown-btn"
                        onClick={(e) => {
                          const isSelected = categories.some(
                            (item) => item.name === selectedDropdownItemCate
                          );
                          setCheckCategorySelected(isSelected);
                          if (isSelected === true) {
                            setIsActiveDropdownSubCate(
                              !isActiveDropdownSubCate
                            );
                          }
                        }}
                      >
                        {selectedDropdownItemSubCate}
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      {!checkCategorySelected && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "14px",
                          }}
                          className="text-danger"
                        >
                          Hãy chọn loại sản phẩm trước
                        </span>
                      )}
                      {isActiveDropdownSubCate && (
                        <div className="dropdown-content">
                          {subCategories.map((item, index) => (
                            <div
                              onClick={(e) => {
                                setSelectedDropdownItemSubCate(item.name);
                                setIsActiveDropdownSubCate(false);
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
                    <button
                      style={{ width: "120px" }}
                      className="buttonSwitchSelectSuperMarket"
                      onClick={(e) => {
                        setIsCreateNewSubCate(true);
                      }}
                    >
                      Thêm mới
                      <FontAwesomeIcon
                        icon={faRepeat}
                        style={{ paddingLeft: 10 }}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* Create SubCategories */}
            {isCreateNewSubCate && (
              <>
                <button
                  className="buttonSwitchSelectSuperMarket"
                  onClick={(e) => {
                    setIsCreateNewSubCate(false);
                  }}
                >
                  Thêm loại sản phẩm phụ có sẵn
                  <FontAwesomeIcon
                    icon={faRepeat}
                    style={{ paddingLeft: 10 }}
                  />
                </button>
                <div className="modal__container-body-inputcontrol">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Tên loại sản phẩm phụ
                  </h4>
                  <input
                    placeholder="Nhập tên loại sản phẩm phụ"
                    type="text"
                    className="modal__container-body-inputcontrol-input"
                  />
                </div>
                <div className="modal__container-body-inputcontrol">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Số ngày trước hạn HSD
                  </h4>
                  <input
                    min={0}
                    placeholder="Nhập số ngày tối thiểu trước HSD"
                    type="number"
                    className="modal__container-body-inputcontrol-input"
                  />
                </div>
                <div className="modal__container-body-inputcontrol">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Tải ảnh
                  </h4>
                  <div>
                    <div
                      className="imgWrapper"
                      onClick={() =>
                        document.querySelector("#imgUploadSubCate").click()
                      }
                    >
                      <input
                        id="imgUploadSubCate"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={({ target: { files } }) => {
                          files[0] && setFileNameSubCate(files[0].name);
                          if (files && files[0]) {
                            setImageSubCate(URL.createObjectURL(files[0]));
                            setImgSubCateToFirebase(files[0]);
                          }
                        }}
                      />
                      {imageSubCate ? (
                        <img
                          src={imageSubCate}
                          width={360}
                          height={160}
                          alt={fileNameSubCate}
                          style={{ borderRadius: "5px" }}
                        />
                      ) : (
                        <>
                          <MdCloudUpload color="#37a65b" size={60} />
                          <p style={{ fontSize: "14px" }}>
                            Tải ảnh loại sản phẩm phụ
                          </p>
                        </>
                      )}
                    </div>
                    <section className="uploaded-row">
                      <AiFillFileImage color="#37a65b" size={25} />
                      <span className="upload-content">
                        {fileNameSubCate} -
                        <MdDelete
                          color="#37a65b"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFileNameSubCate(
                              "Chưa có hình ảnh loại sản phẩm phụ"
                            );
                            setImageSubCate(null);
                            setImgSubCateToFirebase("");
                          }}
                          size={25}
                        />
                      </span>
                    </section>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {/* Create Categories */}
        {isCreateNewCate && (
          <>
            <button
              className="buttonSwitchSelectSuperMarket"
              onClick={(e) => {
                setIsCreateNewCate(false);
              }}
            >
              Thêm loại sản phẩm có sẵn
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên loại sản phẩm
              </h4>
              <input
                placeholder="Nhập tên loại sản phẩm"
                type="text"
                className="modal__container-body-inputcontrol-input"
              />
            </div>
            {/* Create Sub categoris */}
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên loại sản phẩm phụ
              </h4>
              <input
                placeholder="Nhập tên loại sản phẩm phụ"
                type="text"
                className="modal__container-body-inputcontrol-input"
              />
            </div>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Số ngày trước hạn HSD
              </h4>
              <input
                min={0}
                placeholder="Nhập số ngày tối thiểu trước HSD"
                type="number"
                className="modal__container-body-inputcontrol-input"
              />
            </div>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tải ảnh
              </h4>
              <div>
                <div
                  className="imgWrapper"
                  onClick={() =>
                    document.querySelector("#imgUploadSubCate").click()
                  }
                >
                  <input
                    id="imgUploadSubCate"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={({ target: { files } }) => {
                      files[0] && setFileNameSubCate(files[0].name);
                      if (files && files[0]) {
                        setImageSubCate(URL.createObjectURL(files[0]));
                        setImgSubCateToFirebase(files[0]);
                      }
                    }}
                  />
                  {imageSubCate ? (
                    <img
                      src={imageSubCate}
                      width={360}
                      height={160}
                      alt={fileNameSubCate}
                      style={{ borderRadius: "5px" }}
                    />
                  ) : (
                    <>
                      <MdCloudUpload color="#37a65b" size={60} />
                      <p style={{ fontSize: "14px" }}>
                        Tải ảnh loại sản phẩm phụ
                      </p>
                    </>
                  )}
                </div>
                <section className="uploaded-row">
                  <AiFillFileImage color="#37a65b" size={25} />
                  <span className="upload-content">
                    {fileNameSubCate} -
                    <MdDelete
                      color="#37a65b"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setFileNameSubCate(
                          "Chưa có hình ảnh loại sản phẩm phụ"
                        );
                        setImageSubCate(null);
                        setImgSubCateToFirebase("");
                      }}
                      size={25}
                    />
                  </span>
                </section>
              </div>
            </div>
          </>
        )}

        {/*  */}
        {/* ProductName */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên sản phẩm
          </h4>
          <div>
            <input
              value={productName}
              placeholder="Nhập tên sản phẩm"
              type="text"
              className="modal__container-body-inputcontrol-input"
              onChange={(e) => {
                setProductName(e.target.value);
                setError({ ...error, productName: "" });
              }}
            />
            {error.productName && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.productName}
              </p>
            )}
          </div>
        </div>
        {/* Price */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Giá tiền</h4>
          <div>
            <input
              value={price}
              min={0}
              placeholder="Nhập số giá tiền"
              type="number"
              className="modal__container-body-inputcontrol-input"
              onChange={(e) => {
                setPrice(e.target.value);
                setError({ ...error, price: "" });
              }}
            />
            {error.price && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.price}
              </p>
            )}
          </div>
        </div>
        {/* PriceOriginal */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Giá gốc</h4>

          <div>
            <input
              value={priceOriginal}
              min={0}
              placeholder="Nhập giá gốc"
              type="number"
              className="modal__container-body-inputcontrol-input"
              onChange={(e) => {
                setPriceOriginal(e.target.value);
                setError({ ...error, priceOriginal: "" });
              }}
            />
            {error.priceOriginal && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.priceOriginal}
              </p>
            )}
          </div>
        </div>
        {/* Description */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Thông tin sản phẩm
          </h4>
          <div>
            <textarea
              className="modal__container-body-inputcontrol-input textareaFocus"
              placeholder="Nhập thông tin sản phẩm"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError({ ...error, description: "" });
              }}
            ></textarea>
            {error.description && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.description}
              </p>
            )}
          </div>
        </div>
        {/* ExpiredDate */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Ngày hết hạn
          </h4>
          <input
            placeholder="Nhập Ngày hết hạn"
            type="date"
            className="modal__container-body-inputcontrol-input"
            value={expiredDate}
            onChange={(e) => {
              console.log(e.target.value);
              // console.log("format", dayjs(e.target.value).$d);
              setExpiredDate(e.target.value);
            }}
          />
        </div>
        {/* Quantity */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Số lượng</h4>
          <div>
            <input
              min={0}
              placeholder="Nhập số lượng"
              type="number"
              className="modal__container-body-inputcontrol-input"
              value={quantity}
              onChange={(e) => {
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
        {/* Image Upload */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Tải ảnh</h4>
          <div>
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
                  <p style={{ fontSize: "14px" }}>Tải ảnh sản phẩm</p>
                </>
              )}
            </div>
            <section className="uploaded-row">
              <AiFillFileImage color="#37a65b" size={25} />
              <span className="upload-content">
                {fileName} -
                <MdDelete
                  color="#37a65b"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setFileName("Chưa có hình ảnh sản phẩm");
                    setImage(null);
                    setImgToFirebase("");
                  }}
                  size={25}
                />
              </span>
            </section>
            {error.imageUrl && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error.imageUrl}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* ********************** */}

      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button className="modal__container-footer-buttons-close">
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            className="modal__container-footer-buttons-create"
          >
            Tạo mới
          </button>
        </div>
      </div>
      {/* *********************** */}
      {/* Alert */}
      <Snackbar
        open={openErrorSnackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: openErrorSnackbar.vertical,
          horizontal: openErrorSnackbar.horizontal,
        }}
        onClose={handleCloseErrorSnackbar}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{
            width: "100%",
            fontSize: "15px",
            alignItem: "center",
          }}
        >
          {openErrorSnackbar.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateProduct;
