import React from "react";
import Header from "../components/Header/Header";
import "./HeaderOnly.scss";

const HeaderOnly = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="headeronly__container">{children}</div>
    </div>
  );
};

export default HeaderOnly;
