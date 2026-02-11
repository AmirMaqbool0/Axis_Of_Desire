import React, { useState } from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductBannerCard = ({ data }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='product-banner-card-container'>
      <div className="product-banner-card-logo">
        {!imageLoaded && <Skeleton height={400} baseColor='#0B1E48' highlightColor='#081947' width={'100%'} />}
        <img 
          src={data?.coverImage} 
          alt="" 
          style={{ display: imageLoaded ? 'block' : 'none' }} 
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="product-banner-card-text">
        <h1>{data?.name}</h1>
        <NavLink to={`/category/${data?.id}`} style={{ textDecoration: 'none' }}>
          <span>Shop The Collection</span>
        </NavLink>
      </div>
    </div>
  );
};

export default ProductBannerCard;
