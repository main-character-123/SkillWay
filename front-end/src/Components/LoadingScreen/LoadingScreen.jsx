// Components/LoadingScreen/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
