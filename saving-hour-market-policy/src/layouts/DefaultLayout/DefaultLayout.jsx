import React, { useState } from "react";
import "./DefaultLayout.scss";
import Header from "../../components/Header/Header";
import SideMenu from "../../components/SideMenu/SideMenu";

const DefaultLayout = ({ children }) => {
  const menuTabs = [
    {
      display: "Điều khoản dịch vụ",
      to: "/",
    },
    {
      display: "Chính sách bảo mật",
      to: "/PrivacyPolicy",
    },

    {
      display: "Chính sách giao hàng",
      to: "/ShippingPolicy",
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      <Header setOpen={setOpen} open={open} />
      <div className="layout-container">
        <SideMenu open={open} setOpen={setOpen} menuTabs={menuTabs} />
        <div className="layout-children">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
