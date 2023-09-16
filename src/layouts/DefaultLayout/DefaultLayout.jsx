import React from "react";
import "./DefaultLayout.scss";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";

const DefaultLayout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="layout-container">
        <SideMenu />
        <div className="layout-children">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
