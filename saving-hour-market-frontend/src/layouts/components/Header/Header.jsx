import React from "react";
import "./Header.scss";
import UserIcon from "../../../assets/user.png";
import { auth } from "../../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import { setUser } from "../../../feature/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Menu, MenuItem } from "@mui/material";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.clear();
        const action = setUser(null);
        dispatch(action);
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div className="header__container">
      <div className="header__container-logo">
        <h1>Saving Hour Market</h1>
      </div>

      {user && (
        <div className="header__container-profile">
          <div className="header__container-profile-img">
            <img src={user.avatarUrl} alt="" />
          </div>
          {/* <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu> */}

          <div className="header__container-profile-info">
            <h4 className="header__container-profile-info-name">
              {user.fullName}
            </h4>
            <h3
              onClick={() => handleLogout()}
              className="header__container-profile-info-role"
            >
              Logout
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
