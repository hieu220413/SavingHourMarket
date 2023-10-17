import React from "react";
import LoginImg from "../../../assets/LoginImg.png";
import "./Login.scss";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login__container">
      <div className="login__container-img">
        <img src={LoginImg} alt="" />
      </div>
      <div className="login__container-right">
        <h2 className="login__container-right-title">Login Your Account</h2>
        <form action="" className="login__container-right-form">
          <div className="login__container-right-form-inputcontrol">
            <label htmlFor="email">
              Email <span>(*)</span>
            </label>
            <input name="email" placeholder="Email" type="email" />
          </div>
          <div className="login__container-right-form-inputcontrol">
            <label htmlFor="password">
              Password <span>(*)</span>
            </label>
            <input name="password" placeholder="Password" type="password" />
          </div>
          <div className="login__container-right-form-features">
            <div className="login__container-right-form-features-rememberpassword">
              <input type="checkbox" />
              <p>Remember Password</p>
            </div>
            <Link className="login__container-right-form-features-forgotpassword">
              Forgot Password ?
            </Link>
          </div>
          <button className="login__container-right-form-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
