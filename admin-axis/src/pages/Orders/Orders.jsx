import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import OrderCard from './OrderCard';
import { NavLink } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { MoonLoader } from 'react-spinners';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;
  const db = getFirestore(app);

  const getOrders = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(db, 'orders');
      const result = await getDocs(collectionRef);
      const arr = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(arr);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className='orders-container'>
      <div className="orders-heading">
        <span>Users Orders</span>
      </div>
      <div className="orders-cards">
        {loading ? (
          
          <div className='loading-container'>
          <MoonLoader  color='#0B1E48' size={50}/>
          </div>
        ) : (
          currentOrders.map((order) => (
            <NavLink to={`/orders/orderdetail/${order.id}`} style={{ textDecoration: 'none' }} key={order.id}>
              <OrderCard data={order} />
            </NavLink>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
