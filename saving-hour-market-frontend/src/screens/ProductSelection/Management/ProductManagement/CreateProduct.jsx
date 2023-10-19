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
import { imageDB } from "../../../../firebase/firebase.config";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const CreateProduct = () => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("Chưa có hình ảnh sản phẩm");
  const [imgToFirebase, setImgToFirebase] = useState("");

  const [imageSubCate, setImageSubCate] = useState(null);
  const [fileNameSubCate, setFileNameSubCate] = useState(
    "Chưa có hình ảnh loại sản phẩm phụ"
  );

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
  const [supermarkerAddress, setSupermarketAddress] = useState([]);
  const [category, setCategory] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [allowableDisplayThreshold, setAllowableDisplayThreshold] = useState(0);
  const [imageUrlSubCate, setImageUrlSubCate] = useState("");

  // check error
  const [checkCategorySelected, setCheckCategorySelected] = useState(false);

  useEffect(() => {
    fetch(
      `http://saving-hour-market.ap-southeast-2.elasticbeanstalk.com/api/supermarket/getSupermarketForStaff`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjAzZDA3YmJjM2Q3NWM2OTQyNzUxMGY2MTc0ZWIyZjE2NTQ3ZDRhN2QiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHV1IEdpYSBWaW5oIChLMTZfSENNKSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKMDFaOG1xUGRLc015Q24wU0o1U0l6OW9fOHotanV1ODIwZU1pZ0E2YmE9czk2LWMiLCJ1c2VyX3JvbGUiOiJTVEFGRl9TTFQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2Fwc3RvbmUtcHJvamVjdC0zOTgxMDQiLCJhdWQiOiJjYXBzdG9uZS1wcm9qZWN0LTM5ODEwNCIsImF1dGhfdGltZSI6MTY5NzY5NDI2OSwidXNlcl9pZCI6IkFuSEVLcGxYWXdPNGMxdGRkdE94SklTWklsdDEiLCJzdWIiOiJBbkhFS3BsWFl3TzRjMXRkZHRPeEpJU1pJbHQxIiwiaWF0IjoxNjk3Njk0MjY5LCJleHAiOjE2OTc2OTc4NjksImVtYWlsIjoidmluaGxnc2UxNjExMzVAZnB0LmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInZpbmhsZ3NlMTYxMTM1QGZwdC5lZHUudm4iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.T6GVqJQeh0dVVKrKGKpUuSGMD94KIgUDheDAADvT_wJA0ks4QVo1jkh32i9V_6tYziiTzBnQtC1-_lMXWMm9COd6n-xYZR8sVXaPgV0fMxPOV6DXRfdWKyEJBn4kuPjxAOyArR2_sva06Qfph4MunZ1gwNc-e8tOSaIms820F-6pzf8rAc3mKwepa-QEZSSBCjq78xD4twDxAsvvVUKk8TU2GkIFZnISRJJ92hyK-_2li4UFb75Bq6BCFwXWpVzTrDt8_axlo69Zyfze-YHRgPohstOgCe5wZsortMbKaVz5CRugnwJIXDJyaNFXH_w1-Pon-KaU_9MMwTClUPmjDQ`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("super", data);
        setSupermarkets(data.supermarketList);
      });

    fetch(
      `http://saving-hour-market.ap-southeast-2.elasticbeanstalk.com/api/product/getAllCategory`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjAzZDA3YmJjM2Q3NWM2OTQyNzUxMGY2MTc0ZWIyZjE2NTQ3ZDRhN2QiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHV1IEdpYSBWaW5oIChLMTZfSENNKSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKMDFaOG1xUGRLc015Q24wU0o1U0l6OW9fOHotanV1ODIwZU1pZ0E2YmE9czk2LWMiLCJ1c2VyX3JvbGUiOiJTVEFGRl9TTFQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2Fwc3RvbmUtcHJvamVjdC0zOTgxMDQiLCJhdWQiOiJjYXBzdG9uZS1wcm9qZWN0LTM5ODEwNCIsImF1dGhfdGltZSI6MTY5NzY5NDI2OSwidXNlcl9pZCI6IkFuSEVLcGxYWXdPNGMxdGRkdE94SklTWklsdDEiLCJzdWIiOiJBbkhFS3BsWFl3TzRjMXRkZHRPeEpJU1pJbHQxIiwiaWF0IjoxNjk3Njk0MjY5LCJleHAiOjE2OTc2OTc4NjksImVtYWlsIjoidmluaGxnc2UxNjExMzVAZnB0LmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInZpbmhsZ3NlMTYxMTM1QGZwdC5lZHUudm4iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.T6GVqJQeh0dVVKrKGKpUuSGMD94KIgUDheDAADvT_wJA0ks4QVo1jkh32i9V_6tYziiTzBnQtC1-_lMXWMm9COd6n-xYZR8sVXaPgV0fMxPOV6DXRfdWKyEJBn4kuPjxAOyArR2_sva06Qfph4MunZ1gwNc-e8tOSaIms820F-6pzf8rAc3mKwepa-QEZSSBCjq78xD4twDxAsvvVUKk8TU2GkIFZnISRJJ92hyK-_2li4UFb75Bq6BCFwXWpVzTrDt8_axlo69Zyfze-YHRgPohstOgCe5wZsortMbKaVz5CRugnwJIXDJyaNFXH_w1-Pon-KaU_9MMwTClUPmjDQ`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  const handleAddSupermarketAddress = () => {
    console.log("add");
  };

  const handleUploadImageToFirebase = () => {
    const imgRef = ref(imageDB, `productImage/${v4()}`);
    uploadBytes(imgRef, imgToFirebase);
  };

  const handleSubmit = () => {
    console.log("click");
    handleUploadImageToFirebase();
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
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tên sản phẩm
          </h4>
          <input
            placeholder="Nhập tên sản phẩm"
            type="text"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Giá tiền</h4>
          <input
            min={0}
            placeholder="Nhập số giá tiền"
            type="number"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Giá gốc</h4>
          <input
            min={0}
            placeholder="Nhập giá gốc"
            type="number"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Thông tin sản phẩm
          </h4>
          <textarea
            className="modal__container-body-inputcontrol-input textareaFocus"
            placeholder="Nhập thông tin sản phẩm"
          ></textarea>
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Ngày hết hạn
          </h4>
          <input
            placeholder="Nhập Ngày hết hạn"
            type="date"
            className="modal__container-body-inputcontrol-input"
          />
        </div>
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">Số lượng</h4>
          <input
            min={0}
            placeholder="Nhập số lượng"
            type="number"
            className="modal__container-body-inputcontrol-input"
          />
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
                  console.log(files[0]);
                  console.log(URL.createObjectURL(files[0]));
                  if (files && files[0]) {
                    setImage(URL.createObjectURL(files[0]));
                    setImgToFirebase(files[0]);
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
          </div>
        </div>
        {/* Supermarket */}
        {isCreateNewSupermarket === false && (
          <>
            <button
              className="buttonSwitchSelectSuperMarket"
              onClick={(e) => {
                setIsCreateNewSupermarket(true);
              }}
            >
              Thêm siêu thị mới
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên siêu thị
              </h4>
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
            <button
              className="buttonSwitchSelectSuperMarket"
              onClick={(e) => {
                setIsCreateNewCate(true);
              }}
            >
              Thêm loại sản phẩm mới
              <FontAwesomeIcon icon={faRepeat} style={{ paddingLeft: 10 }} />
            </button>
            <div className="modal__container-body-inputcontrol">
              <h4 className="modal__container-body-inputcontrol-label">
                Tên loại sản phẩm
              </h4>
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
                          console.log("sub", subCategories);
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
            {/* Sub cate */}
            {isCreateNewSubCate === false && (
              <>
                <button
                  className="buttonSwitchSelectSuperMarket"
                  onClick={(e) => {
                    setIsCreateNewSubCate(true);
                  }}
                >
                  Thêm loại sản phẩm phụ mới
                  <FontAwesomeIcon
                    icon={faRepeat}
                    style={{ paddingLeft: 10 }}
                  />
                </button>
                <div className="modal__container-body-inputcontrol">
                  <h4 className="modal__container-body-inputcontrol-label">
                    Tên loại sản phẩm phụ
                  </h4>
                  <div className="dropdown">
                    <div
                      className="dropdown-btn"
                      onClick={(e) => {
                        const isSelected = categories.some(
                          (item) => item.name === selectedDropdownItemCate
                        );
                        setCheckCategorySelected(isSelected);
                        if (isSelected === true) {
                          setIsActiveDropdownSubCate(!isActiveDropdownSubCate);
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
                        }}
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
                          console.log(files[0]);
                          if (files && files[0]) {
                            setImageSubCate(URL.createObjectURL(files[0]));
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
                          }}
                          size={25}
                        />
                      </span>
                    </section>
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
                          console.log(files[0]);
                          if (files && files[0]) {
                            setImageSubCate(URL.createObjectURL(files[0]));
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
                      console.log(files[0]);
                      if (files && files[0]) {
                        setImageSubCate(URL.createObjectURL(files[0]));
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
                      }}
                      size={25}
                    />
                  </span>
                </section>
              </div>
            </div>
          </>
        )}
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
    </div>
  );
};

export default CreateProduct;
