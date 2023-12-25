import React, { useState } from "react";
import "./SideMenu.scss";
import Logo from "../../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useLocation, useNavigate } from "react-router";
import {
  faCaretDown,
  faChevronDown,
  faChevronRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { setUser } from "../../../feature/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SideMenu = ({ menuTabs }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [menuList, setMenuList] = useState(
    menuTabs.map((item, index) => {
      return { ...item, isClose: false };
    })
  );

  console.log(menuList);

  const navigate = useNavigate();

  const active = menuList.findIndex((e) => e.to === pathname);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.clear();
        const action = setUser(null);
        dispatch(action);
        // navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div className="sidemenu-wrapper ">
      <div className="sidemenu-header">
        <img src={Logo} alt="" />
      </div>
      {menuList.map((item, i) => (
        <>
          <div
            onClick={() => {
              if (item.submenu.length > 0) {
                const newMenuList = [...menuList];
                newMenuList[i] = {
                  ...newMenuList[i],
                  isClose: !newMenuList[i].isClose,
                };
                setMenuList(newMenuList);
              }
              navigate(item.to);
            }}
            className={`sidemenu-tab ${i === active ? "active" : ""}`}
          >
            <FontAwesomeIcon className="sidemenu-tab-icon " icon={item.icon} />
            <h4 className="sidemenu-tab-display">{item.display}</h4>
            {item.submenu.length > 0 && (
              <FontAwesomeIcon
                className="sidemenu-tab-icon-dropdown "
                icon={item.isClose ? faChevronDown : faChevronRight}
              />
            )}
          </div>
          {item?.submenu.length > 0 && (
            <div className="sidemenu-tab-submenu-display">
              <ul className={`${item.isClose && "close"}`}>
                {item.submenu.map((menu, i) => {
                  return (
                    <li
                      className={`${menu.to === pathname ? "active" : ""}`}
                      onClick={() => navigate(menu.to)}
                    >
                      {menu.display}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      ))}
      <div
        onClick={() => {
          handleLogout();
        }}
        className={`sidemenu-tab `}
      >
        <FontAwesomeIcon
          className="sidemenu-tab-icon "
          icon={faRightFromBracket}
        />
        <h4 className="sidemenu-tab-display">Đăng xuất</h4>
      </div>
    </div>
  );
};

export default SideMenu;
