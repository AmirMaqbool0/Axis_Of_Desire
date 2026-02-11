import React, { useEffect, useState } from 'react'
import './style.css'
import PageBanner from '../../components/PageBanner/PageBanner'
import WishListCard from './WishListCard'
import { useSelector } from "react-redux";
import { app } from '../../firebase';
import { getFirestore, collection, getDocs } from "firebase/firestore";

const WishList = () => {
  const [data, setData] = useState([]);
  
  const id = useSelector((state) => state.cart.uid);
  const db = getFirestore(app);

  const getCart = async () => {
    const collectionRef = collection(db, 'users', id, 'favorite');
    const result = await getDocs(collectionRef);
    
    const arr = result.docs.map((doc) => (
      { id: doc.id, ...doc.data() } 
    ));
    setData(arr);
  };
 
  useEffect(() => {
    getCart();
  }, []);

 
  const refreshCart = () => {
    getCart();
  };

  const item = data.length
  return (
    <div className='wishlist-container'>
        <PageBanner  heading={'Wish List'}/>
        <div className="wishlist-content">
            <div className="wishlist-text">
                <span>You Have {item} Items Saved</span>
                <p>If you are not signed in, your lists are only available on this device and will expire at the end of this session.</p>
            </div>
            <div className="wishlist-cards">
                {
                    data?.map((item)=>(
                        <div className="wishlist-card">

                            <WishListCard data={item} refreshCart={refreshCart} />
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default WishList