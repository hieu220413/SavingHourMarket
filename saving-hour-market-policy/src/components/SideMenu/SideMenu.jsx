import React, { useState } from "react";
import "./SideMenu.scss";

import { useLocation, useNavigate } from "react-router";

const SideMenu = ({ menuTabs, open, setOpen }) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const active = menuTabs.findIndex((e) => e.to === pathname);

  return (
    <div className={`sidemenu-wrapper ${open && "open"}`}>
      {menuTabs.map((item, i) => (
        <div
          onClick={() => {
            navigate(item.to);
            setOpen(!open);
          }}
          className={`sidemenu-tab ${i === active && "active"}`}
        >
          {/* <FontAwesomeIcon className="sidemenu-tab-icon " icon={item.icon} /> */}
          <h4 className="sidemenu-tab-display">{item.display}</h4>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
