import React from 'react'
import './style.css'
import CardLogo from '../../assets/card2.png'
import { Link } from 'react-router-dom'
const FeatureProductCard = ({data}) => {
  return (
    <div className='feature-prouct-card-container'>
        <img src={data.cover} alt="" />
        <div className="featute-product-hover">
            <div className="feature-hover-btn">
            <Link to={`/productdetail/${data.categoryId}/${data.id}`} style={{textDecoration:'none'}}>    <span>DISCOVER</span> </Link>
            </div>
        </div>
    </div>
  )
}

export default FeatureProductCard