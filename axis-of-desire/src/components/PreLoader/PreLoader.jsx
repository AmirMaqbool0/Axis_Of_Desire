import React, { useEffect } from "react";
import { preLoaderAnim } from "../../animations/index";
import './style.css'
const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
      <div className="texts-container">
      <span>Quality,</span>
        <span>Style,</span>
        <span>Elegance.</span>
      </div>
    </div>
  );
};

export default PreLoader;