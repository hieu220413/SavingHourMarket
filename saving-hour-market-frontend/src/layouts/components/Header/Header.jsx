import React from "react";
import "./Header.scss";
import UserIcon from "../../../assets/user.png";

const Header = () => {
  return (
    <div className="header__container">
      <div className="header__container-logo">
        <h1>Saving Hour Market</h1>
      </div>
      <div className="header__container-profile">
        <div className="header__container-profile-img">
          <img src={UserIcon} alt="" />
        </div>

        <div className="header__container-profile-info">
          <h4 className="header__container-profile-info-name">Hà Anh Tú</h4>
          <h3 className="header__container-profile-info-role">Admin</h3>
        </div>
      </div>
    </div>
  );
};

export default Header;
