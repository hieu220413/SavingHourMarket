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
      icon: faUser,
      display: "Trang cá nhân",
      to: "/",
    },
    {
      icon: faBarsProgress,
      display: "Quản lí",
      to: "/usermanagement",
    },
    {
      icon: faGear,
      display: "Cấu hình",
      to: "/config",
    },
  ];
  const productSelectionMenuTabs = [
    {
      icon: faUser,
      display: "Trang cá nhân",
      to: "/",
    },
    {
      icon: faBarsProgress,
      display: "Quản lí",
      to: "/supermarketmanagement",
    },
    {
      icon: faChartSimple,
      display: "Thống kê",
      to: "/productselectionreport",
    },
  ];
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="layout-container">
        {user?.role === "ADMIN" && <SideMenu menuTabs={adminMenuTabs} />}
        {user?.role === "STAFF_SLT" && (
          <SideMenu menuTabs={productSelectionMenuTabs} />
        )}

        <div className="layout-children">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
