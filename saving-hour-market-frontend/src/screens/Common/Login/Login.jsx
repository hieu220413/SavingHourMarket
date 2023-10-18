import React, { useEffect, useState } from "react";
import LoginImg from "../../../assets/LoginImg.png";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { API } from "../../../contanst/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../feature/userSlice";
import { auth } from "../../../firebase/firebase.config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        navigate("/");
        return;
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "") {
      setErrEmail("Vui lòng không để trống");
      return;
    }
    if (password === "") {
      setErrPassword("Vui lòng không để trống");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log(userCredential);

        // Signed in
        const user = userCredential.user;
        const tokenId = await auth.currentUser.getIdToken();
        fetch(`${API.baseURL}/api/staff/getInfo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then((res) => res.json())
          .then((respond) => {
            const action = setUser(respond);
            dispatch(action);
            localStorage.setItem("user", JSON.stringify(respond));
            navigate("/");
          })
          .catch((err) => {
            console.log(err);
          });
        // ...
      })
      .catch((error) => {
        setError("Sai tên đăng nhập hoặc mật khẩu");
        setErrEmail("");
        setErrPassword("");
      });
  };
  return (
    <div className="login__container">
      <div className="login__container-img">
        <img src={LoginImg} alt="" />
      </div>
      <div className="login__container-right">
        <h2 className="login__container-right-title">Login Your Account</h2>
        {error && (
          <p
            style={{ fontSize: "14px", marginBottom: "-10px" }}
            className="text-danger"
          >
            {error}
          </p>
        )}
        <form action="" className="login__container-right-form">
          <div className="login__container-right-form-inputcontrol">
            <label htmlFor="email">
              Email <span>(*)</span>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              placeholder="Email"
              type="email"
            />
            {errEmail && (
              <p
                style={{ fontSize: "12px", marginBottom: "-5px" }}
                className="text-danger"
              >
                {errEmail}
              </p>
            )}
          </div>
          <div className="login__container-right-form-inputcontrol">
            <label htmlFor="password">
              Password <span>(*)</span>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              placeholder="Password"
              type="password"
            />
            {errPassword && (
              <p
                style={{ fontSize: "12px", marginBottom: "-5px" }}
                className="text-danger"
              >
                {errPassword}
              </p>
            )}
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
          <button
            onClick={(e) => handleLogin(e)}
            className="login__container-right-form-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
