import React from "react";
import "./Profile.scss";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  console.log("user", user);
  return (
    <div className="profile__wrapper">
      <div className="profile__container">
        <div className="profile__img">
          <img src={user.avatarUrl} alt="" />
        </div>
        <h2 className="profile__name">{user.fullName}</h2>
        <h2 className="profile__email">{user.email}</h2>
        <h2 className="profile__email">{user.role}</h2>
        <div className="profile__changepassword">Đổi mật khẩu</div>
      </div>
    </div>
  );
};

export default Profile;
