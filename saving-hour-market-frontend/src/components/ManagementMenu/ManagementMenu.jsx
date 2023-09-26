import React from "react";
import "./ManagementMenu.scss";
import { Link, useLocation } from "react-router-dom";

const ManagementMenu = ({ menuTabs }) => {
  const { pathname } = useLocation();
  const active = menuTabs.findIndex((e) => e.to === pathname);

  return (
    <div className="managementmenu__wrapper">
      {menuTabs.map((item, i) => (
        <Link
          to={item.to}
          className={`managementmenu-tab ${i === active ? "active" : ""}`}
        >
          {item.display}
        </Link>
      ))}
    </div>
  );
};

export default ManagementMenu;
