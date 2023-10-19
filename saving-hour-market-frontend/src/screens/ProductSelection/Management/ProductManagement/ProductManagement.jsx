import React, { useEffect, useState } from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./ProductManagement.scss";
import CreateProduct from "./CreateProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@mui/material";
import dayjs from "dayjs";


const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    fetch(
      `http://localhost:8082/api/product/getProductsForStaff?page=0&limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyZTgyNzMyYjk3MWExMzVjZjE0MTZlOGI0NmRhZTA0ZDgwODk0ZTciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHV1IEdpYSBWaW5oIChLMTZfSENNKSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKMDFaOG1xUGRLc015Q24wU0o1U0l6OW9fOHotanV1ODIwZU1pZ0E2YmE9czk2LWMiLCJ1c2VyX3JvbGUiOiJTVEFGRl9TTFQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2Fwc3RvbmUtcHJvamVjdC0zOTgxMDQiLCJhdWQiOiJjYXBzdG9uZS1wcm9qZWN0LTM5ODEwNCIsImF1dGhfdGltZSI6MTY5NzUxMzM4MSwidXNlcl9pZCI6IkFuSEVLcGxYWXdPNGMxdGRkdE94SklTWklsdDEiLCJzdWIiOiJBbkhFS3BsWFl3TzRjMXRkZHRPeEpJU1pJbHQxIiwiaWF0IjoxNjk3NTEzMzgxLCJleHAiOjE2OTc1MTY5ODEsImVtYWlsIjoidmluaGxnc2UxNjExMzVAZnB0LmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInZpbmhsZ3NlMTYxMTM1QGZwdC5lZHUudm4iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.PRw2cqlKbJMABUENq5httYVUVz3sgpMQiNqDAMVb3Ylyp2TbHpvn5FCjblmT3g65wX-M50Z9RQfWK2SbJ7Lwnk4U01J2l_NCprBeLpx54RzU1UOuuunLoNtDY2HvoO2E1lRh7TAReuCztKbjoH_BNJg4fpOwZ1ZacDz3jEnY84aZP_QOxXOEJZ-170QrQu4FnnxCCSWMZMk1b_tK37qDNk5qSS_NMnHDj5aSqnPz2wOYJuTkk6_zJecdE1fsoDPU4YfQoGBSbk5YFe7hu0W8Xcfa-sFXXkZJH_HqjdlLRDjykWrgyt8ZDs1pCN72JTVizYN_6Gub5xCGlkvruMUbBA`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
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

  useEffect(() => {
    fetch(
      `http://saving-hour-market.ap-southeast-2.elasticbeanstalk.com/api/product/getProductsForStaff?page=0&limit=5`,
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
        setProducts(data.productList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
    </div>
  );
};

export default ProductManagement;
