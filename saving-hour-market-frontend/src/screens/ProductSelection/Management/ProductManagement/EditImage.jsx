import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import CreateProductImageSlider from "./CreateProductImageSlider";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { imageDB } from "../../../../firebase/firebase.config";

const EditImage = ({
  product,
  handleClose,
  setConfirmProductList,
  confirmProductList,
  index,
  setOpenSnackbar,
  openSnackbar,
}) => {
  const [image, setImage] = useState(
    product?.imageUrls ? product?.imageUrls : []
  );
  const [imageToFireBase, setImageToFireBase] = useState("");
  const [error, setError] = useState("");
  const [openImageUrlList, setOpenImageUrlList] = useState(false);
  const handleOpenImageUrlList = () => setOpenImageUrlList(true);
  const handleCloseImageUrlList = () => setOpenImageUrlList(false);
  const [loading, setLoading] = useState(false);

  const uploadProductImgToFirebase = async (image) => {
    const imgRef = ref(imageDB, `productImage/${v4()}`);
    await uploadBytes(imgRef, image);
    try {
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadProductImagesToFireBase = async (images) => {
    const imageList = Array.from(images, (image) =>
      uploadProductImgToFirebase(image)
    );
    const imageUrls = await Promise.all(imageList);
    return imageUrls;
  };

  const uploadImg = async () => {
    if (image.length === 0) {
      setError("Chưa có ảnh sản phẩm");
      return;
    }
    let newProductList;
    if (!imageToFireBase) {
      newProductList = confirmProductList.productList.map((item, i) => {
        if (index === i) {
          return { ...item, imageUrls: image };
        }
        return item;
      });
    } else {
      setLoading(true);
      let imageUrls = await uploadProductImagesToFireBase(imageToFireBase);
      setLoading(false);
      newProductList = confirmProductList.productList.map((item, i) => {
        if (index === i) {
          return { ...item, imageUrls: imageUrls };
        }
        return item;
      });
    }
    setConfirmProductList({
      ...confirmProductList,
      productList: newProductList,
    });
    setOpenSnackbar({ ...openSnackbar, open: true, severity: "success" });
    handleClose();
  };
  return (
    <div className="modal__container ">
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Tải hình ảnh sản phẩm</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      <div className="modal__container-body">
        {/* Image Upload */}
        <div className="modal__container-body-inputcontrol">
          <h4 className="modal__container-body-inputcontrol-label">
            Tải danh sách ảnh
          </h4>
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
                multiple
                onChange={({ target: { files } }) => {
                  if (files && files[0]) {
                    if (files) {
                      const fileArray = Object.entries(files).map(
                        ([key, value]) => {
                          return { index: key, value: value };
                        }
                      );

                      let imageUrlListToShow = [];
                      let imageUrlListToFireBase = [];
                      fileArray.map((item) => {
                        imageUrlListToShow.push(
                          URL.createObjectURL(item.value)
                        );
                        imageUrlListToFireBase.push(item.value);
                      });
                      setImage(imageUrlListToShow);
                      setImageToFireBase(
                        imageUrlListToFireBase
                          ? imageUrlListToFireBase
                          : files[0]
                      );
                      setError("");
                    }
                  }
                }}
              />
              {image.length !== 0 ? (
                <img
                  src={image[0]}
                  width={360}
                  height={160}
                  alt={product.name}
                  style={{ borderRadius: "5px" }}
                />
              ) : (
                <>
                  <MdCloudUpload color="#37a65b" size={60} />
                  <p style={{ fontSize: "14px" }}>Tải danh sách ảnh sản phẩm</p>
                </>
              )}
            </div>
            {image.length > 1 && (
              <section
                className="uploaded-row"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  {
                    handleOpenImageUrlList();
                  }
                }}
              >
                <h4>Xem tất cả hình đã tải lên</h4>
              </section>
            )}
            {/* <section className="uploaded-row">
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
            </section> */}
            {error && (
              <p
                style={{ fontSize: "14px", marginBottom: "-10px" }}
                className="text-danger"
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button
            onClick={handleClose}
            className="modal__container-footer-buttons-close"
          >
            Đóng
          </button>
          <button
            onClick={uploadImg}
            className="modal__container-footer-buttons-create"
          >
            Cập nhật
          </button>
        </div>
      </div>
      {/* *********************** */}
      <Dialog
        onClose={handleCloseImageUrlList}
        aria-labelledby="customized-dialog-title"
        open={openImageUrlList}
      >
        <CreateProductImageSlider
          handleClose={handleCloseImageUrlList}
          imageUrlList={
            image[0]?.imageUrl ? image.map((item) => item.imageUrl) : image
          }
        />
      </Dialog>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default EditImage;
