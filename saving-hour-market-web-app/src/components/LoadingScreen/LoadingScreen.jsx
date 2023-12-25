import React from "react";
import "./LoadingScreen.scss";
import { CircularProgress } from "@mui/material";

const LoadingScreen = () => {
  return (
    <div className="loading">
      <CircularProgress color="success" />
    </div>
  );
};

export default LoadingScreen;
