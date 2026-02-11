import React from 'react'
import './style.css'
import { NavLink } from 'react-router-dom'


const HistoryProductCard = ({data,detail}) => {
      console.log(data)
  return (
    <div className='history-product-card-container'>
        <div className="history-product-card-logo">
            <img src={data.cover} alt="" />
        </div>
        <div className="history-product-card-text">
            <span>{data.name}</span>
             <span>Price : $ {data?.price}</span>
        </div>
        <div className="history-product-card-btn">
          <NavLink to={`/productdetail/${data.categoryId}/${data.id}`} style={{textDecoration:'none'}}>  <button>View Product</button> </NavLink>
            {/* <span>Buy Again</span> */}
        </div>
    </div>
  )
}

export default HistoryProductCard