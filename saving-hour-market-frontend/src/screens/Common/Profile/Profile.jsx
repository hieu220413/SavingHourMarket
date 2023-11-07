import React from "react";
import "./Profile.scss";

const Profile = () => {
  return (
    <div className="profile__wrapper">
      <div className="profile__container">
        <div className="profile__img">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media"
            alt=""
          />
        </div>
        <h2 className="profile__name">Hà Anh Tú</h2>
        <h2 className="profile__email">tuhase161714@fpt.edu.vn</h2>
        <h2 className="profile__email">Product selection</h2>
        <div className="profile__changepassword">Đổi mật khẩu</div>
      </div>
    </div>
  );
};

export default Profile;
