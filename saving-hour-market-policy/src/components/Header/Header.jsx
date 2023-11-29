import React, { useEffect, useState } from "react";
import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({ open, setOpen }) => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  return (
    <div className="header__container">
      <div className="header__container-logo">
        {windowSize <= 768 && (
          <FontAwesomeIcon onClick={() => setOpen(!open)} icon={faBars} />
        )}

        <h1>Saving Hour Market</h1>
      </div>
      <div></div>
    </div>
  );
};

export default Header;
