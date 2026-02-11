import React from "react";
import "./style.css";
import Logo from '../../assets/logo.png'
const Header = () => {
  return ( 
    <div className="header-container">
     <div className="header-logo">
      <img src={Logo} alt="" />
      <span>Axis of Desire</span>
     </div>
        <button>Logout</button>
    </div>
  );
};

export default Header;
