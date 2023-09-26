import React, { useState } from "react";
import "./SideMenu.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useLocation, useNavigate } from "react-router";

const SideMenu = ({ menuTabs }) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const active = pathname.includes("management")
    ? 1
    : menuTabs.findIndex((e) => e.to === pathname);
  return (
    <div className="sidemenu-wrapper">
      {menuTabs.map((item, i) => (
        <div
          onClick={() => navigate(item.to)}
          className={`sidemenu-tab ${i === active ? "active" : ""}`}
        >
          <FontAwesomeIcon className="sidemenu-tab-icon " icon={item.icon} />
          <h4 className="sidemenu-tab-display">{item.display}</h4>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
