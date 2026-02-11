import React, { useState, useEffect } from 'react';
import './style.css';
import PageBanner from '../../components/PageBanner/PageBanner';
import OrderHistoryCard from './OrderHistoryCard';
import { useSelector } from 'react-redux';
import { app } from '../../firebase';
import { getFirestore, getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { MoonLoader } from 'react-spinners';
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const id = useSelector((state) => state.cart.uid);
  const db = getFirestore(app);

  const getOrders = async () => {
   
    const collectionRef = collection(db, 'orders');
    const q = query(collectionRef, where('orderPlacedBy', '==', id));
    const querySnapshot = await getDocs(q);
    const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersList);
    fetchProducts(ordersList);
  };

  const fetchProducts = async (ordersList) => {
    let allProducts = [];
    setLoading(true)
    for (const order of ordersList) {
      for (const product of order.products) {
        const categoryDocRef = doc(db, 'categories', product.categoryId);
        const categoryDoc = await getDoc(categoryDocRef);
        if (categoryDoc.exists()) {
          const subCollectionRef = collection(categoryDocRef, 'products'); 
          const subCollectionSnapshot = await getDocs(subCollectionRef);
          subCollectionSnapshot.forEach(subDoc => {
            if (subDoc.id === product.productId) {
              allProducts.push({ ...subDoc.data(), id: subDoc.id, orderId: order.id });
            }
          });
        }
      }
    }
    setProducts(allProducts);
    setLoading(false)
  };

  useEffect(() => {
    if (id) {
      getOrders();
    }
  }, [id]);
  return (
    <div className='order-history-container'>
      <PageBanner heading={'Order History'} />
      <div className={`${loading ? 'history-box' : 'order-history-content'}`}>
        {
          loading ?   (
            <div className='loading-container' style={{marginTop:'-130px'}}>
              <MoonLoader size={40} color='#F8C471' />
            </div>
          ): 
              (
                <div className={"order-history-content-box"}>
                <div className="order-history-heading">
                  <span>Check The Status Of Recent Orders</span>
                </div>
                <div className="order-history">
                  
                   
                      
                     {
       orders.map(order => (
        <OrderHistoryCard data={order} products={products} />
      ))
                     } 
                     
                      
                    
                  
                  
                </div>
              </div>
              )
        }
      
      </div>
    </div>
  );
};

export default OrderHistory;
