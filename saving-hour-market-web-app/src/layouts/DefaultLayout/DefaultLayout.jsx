import React from "react";
import "./DefaultLayout.scss";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import {
  faBarsProgress,
  faChartSimple,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const DefaultLayout = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const adminMenuTabs = [
    {
      icon: faBarsProgress,
      display: "Quản lí",
      to: "",
      submenu: [
        {
          display: "Tài khoản",
          to: "/usermanagement",
        },
        {
          display: "Góp ý",
          to: "/feedbackmanagement",
        },
        {
          display: "Điểm giao hàng",
          to: "/pickuppointmanagement",
        },
        {
          display: "Giao dịch",
          to: "/transactionmanagement",
        },
        {
          display: "Khung giờ",
          to: "/timeframemanagement",
        },
        {
          display: "Điểm tập kết",
          to: "/consolidationmanagement",
        },
      ],
    },
    {
      icon: faGear,
      display: "Cấu hình",
      to: "/config",
      submenu: [],
    },
    {
      icon: faUser,
      display: "Trang cá nhân",
      to: "/",
      submenu: [],
    },
  ];
  const productSelectionMenuTabs = [
    {
      icon: faBarsProgress,
      display: "Quản lí ",
      to: "",
      submenu: [
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
      ],
    },
    {
      icon: faChartSimple,
      display: "Thống kê",
      to: "",
      submenu: [
        {
          display: "Hệ thống",
          to: "/productselectionreport",
        },
        {
          display: "Siêu thị",
          to: "/supermarketreport",
        },
      ],
    },
    {
      icon: faUser,
      display: "Trang cá nhân",
      to: "/",
      submenu: [],
    },
  ];
  const marketingMenuTabs = [
    {
      icon: faBarsProgress,
      display: "Quản lí mã giảm giá",
      to: "/vouchermanagement",
      submenu: [],
    },
    {
      icon: faChartSimple,
      display: "Thống kê",
      to: "/marketingreport",
      submenu: [],
    },
    {
      icon: faUser,
      display: "Trang cá nhân",
      to: "/",
      submenu: [],
    },
  ];
  return (
    <div className="layout-wrapper">
      {/* <Header /> */}
      <div className="layout-container">
        {user?.role === "ADMIN" && <SideMenu menuTabs={adminMenuTabs} />}
        {user?.role === "STAFF_SLT" && (
          <SideMenu menuTabs={productSelectionMenuTabs} />
        )}
        {user?.role === "STAFF_MKT" && (
          <SideMenu menuTabs={marketingMenuTabs} />
        )}

        <div className="layout-children">
          <>
            {/* <div className="layout-children-header">
              <div className="header__container-profile">
                <div className="header__container-profile-img">
                  <img src={user.avatarUrl} alt="" />
                </div>
             

                <div className="header__container-profile-info">
                  <h4 className="header__container-profile-info-name">
                    {user.fullName}
                  </h4>
                  <h3
                    // onClick={() => handleLogout()}
                    className="header__container-profile-info-role"
                  >
                    Logout
                  </h3>
                </div>
              </div>
            </div> */}

            {children}
          </>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
