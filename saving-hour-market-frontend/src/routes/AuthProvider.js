import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router";
import { routes } from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { setUser } from "../feature/userSlice";
import { auth, database } from "../firebase/firebase.config";
import { onValue, ref } from "firebase/database";

const AuthProvider = ({ children }) => {
  // const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appRoute = routes;
  const user = useSelector((state) => state.user.user);
  const [timeoutId, setTimeoutId] = useState(null);
  const dispatch = useDispatch();
  const [triggerAuthChange, setTriggerAuthChange] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) {
        console.log("a");
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
    return unsubscribe;
  }, []);

  useEffect(() => {
    onValue(ref(database, "isDisableStaff"), async (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data);
        try {
          await auth.currentUser.getIdToken(true);
        } catch (error) {
          console.log(error);
        }
      }
    });
    // onValue(ref(database, "systemStatus"), async (snapshot) => {
    //   const data = snapshot.val();
    //   console.log(data);
    //   if (data !== null) {
    //     if (data === 0) {
    //       if (user?.role !== "ADMIN") {
    //         localStorage.clear();
    //         const action = setUser(null);
    //         dispatch(action);
    //         navigate("/login");
    //       }
    //     }
    //   }
    // });
  }, []);

  const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
  ];

  let timer;

  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      events.forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      handleLogout();
    }, 30 * 60 * 1000); // 10000ms = 10secs
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    events.forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.clear();
        const action = setUser(null);
        dispatch(action);
        clearTimeout(timeoutId);
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const currentRoute = appRoute.find((item) => item.path === location.pathname);

  return currentRoute.role === user?.role || currentRoute.role === "All" ? (
    children
  ) : (
    <>
      {user?.role === "STAFF_SLT" && <Navigate to="/supermarketmanagement" />}
      {user?.role === "ADMIN" && <Navigate to="/usermanagement" />}
      {user?.role === "STAFF_MKT" && <Navigate to="/vouchermanagement" />}
    </>
  );
};

export default AuthProvider;
