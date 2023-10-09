import React from "react";
import ManagementMenu from "../../../../components/ManagementMenu/ManagementMenu";
import "./SuperMarketManagement.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";

const SuperMarketManagement = () => {
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
  return (
    <div>
      <ManagementMenu menuTabs={menuTabs} />
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

          <div className="supermarket__header-button">
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
              <tr className="table-body-row">
                <td>1</td>
                <td>SuperMarket</td>
                <td>121 Tran Van Du P.13, Q.Tan Binh, TP.HCM</td>
                <td>0898449505</td>
                <td>
                  <i class="bi bi-pencil-square"></i>
                  <i class="bi bi-trash-fill"></i>
                </td>
              </tr>
              <tr className="table-body-row">
                <td>2</td>
                <td>SuperMarket</td>
                <td>121 Tran Van Du P.13, Q.Tan Binh, TP.HCM</td>
                <td>0898449505</td>
                <td>
                  <i class="bi bi-pencil-square"></i>
                  <i class="bi bi-trash-fill"></i>
                </td>
              </tr>
              <tr className="table-body-row">
                <td>3</td>
                <td>SuperMarket</td>
                <td>121 Tran Van Du P.13, Q.Tan Binh, TP.HCM</td>
                <td>0898449505</td>
                <td>
                  <i class="bi bi-pencil-square"></i>
                  <i class="bi bi-trash-fill"></i>
                </td>
              </tr>
              <tr className="table-body-row">
                <td>4</td>
                <td>SuperMarket</td>
                <td>121 Tran Van Du P.13, Q.Tan Binh, TP.HCM</td>
                <td>0898449505</td>
                <td>
                  <i class="bi bi-pencil-square"></i>
                  <i class="bi bi-trash-fill"></i>
                </td>
              </tr>
              <tr className="table-body-row">
                <td>5</td>
                <td>SuperMarket</td>
                <td>121 Tran Van Du P.13, Q.Tan Binh, TP.HCM</td>
                <td>0898449505</td>
                <td>
                  <i class="bi bi-pencil-square"></i>
                  <i class="bi bi-trash-fill"></i>
                </td>
              </tr>
              <tr className="table-body-row">
                <td>6</td>
                <td>SuperMarket</td>
                <td>121 Tran Van Du P.13, Q.Tan Binh, TP.HCM</td>
                <td>0898449505</td>
                <td>
                  <i class="bi bi-pencil-square"></i>
                  <i class="bi bi-trash-fill"></i>
                </td>
              </tr>
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
    </div>
  );
};

export default SuperMarketManagement;
