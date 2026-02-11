import React from "react";
import "./style.css";
import Logo from "../../assets/relatedcard.png";
const RelatedProductCard = () => {
  return (
    <div className="related-product-card-container">
      <div className="related-product-card-logo">
        <img src={Logo} alt="" />
      </div>
      <div className="related-card-text">
        <h1>Product Name</h1>
        <p>
          Santos watch, large model, mechanical movement with automatic winding,
          caliber 1847 MC. Steel case,...
        </p>
        <span>10,300c$</span>
        <button>ADD TO BAG</button>
      </div>
    </div>
  );
};

export default RelatedProductCard;
