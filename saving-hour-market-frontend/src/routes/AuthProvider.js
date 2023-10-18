import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router";
import { routes } from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { setUser } from "../feature/userSlice";
import { auth } from "../firebase/firebase.config";

const AuthProvider = ({ children }) => {
  // const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appRoute = routes;
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) {
        localStorage.clear();
        const action = setUser(null);
        dispatch(action);
        navigate("/login");
        return;
      } else {
        const userTokenId = await userAuth
          .getIdToken(true)
          .then((token) => token)
          .catch(async (e) => {
            console.log(e);
            return null;
          });
        if (!userTokenId) {
          // sessions end. (revoke refresh token like password change, disable account, ....)
          localStorage.clear();
          const action = setUser(null);
          dispatch(action);
          navigate("/login");

          return;
        }
      }
    });
  }, []);

  const currentRoute = appRoute.find((item) => item.path === location.pathname);

  return currentRoute.role === user?.role || currentRoute.role === "All" ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default AuthProvider;
