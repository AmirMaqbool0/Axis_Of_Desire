import React, { useEffect, useState } from 'react'
import './style.css'
import HistoryProductCard from './HistoryProductCard'

const OrderHistoryCard = ({data,products}) => {
    const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
    
    console.log(data,products)
    useEffect(() => {
        if (data.createdAt) {
          const timestamp = data.createdAt.toDate(); 
          const formattedDate = timestamp.toLocaleDateString();
          const formattedTime = timestamp.toLocaleTimeString();
          setFormattedCreatedAt(`${formattedDate} ${formattedTime}`);
        }
      }, [data.createdAt]);
  return (
    <div className='history-card-container'>
        <div className="history-card-header">
            <div className="history-card-order-box">
                <h1>Date Of Order</h1>
                <span>{formattedCreatedAt}</span>
            </div>
            <div className="history-card-order-box">
                <h1>Payment Status</h1>
                <span>{data.status}</span>
            </div>
            <div className="history-card-order-box">
                <h1>Total Cost</h1>
                <span>{data?.total}</span>
            </div>
        </div>
        <div className="order-history-product-cards">
            {
                products.map((product)=>(
                    <HistoryProductCard data={product} detail={data}/>
                ))
            }
        </div>
    </div>
  )
}

export default OrderHistoryCard