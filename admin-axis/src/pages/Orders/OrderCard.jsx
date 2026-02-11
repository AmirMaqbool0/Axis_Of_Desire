import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, getDoc, doc } from 'firebase/firestore';

const OrderCard = ({ data }) => {
  const [user, setUser] = useState({});
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
  const db = getFirestore(app);

  const getUser = async () => {
    const docRef = doc(db, 'users', data.orderPlacedBy);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (data.createdAt) {
      const timestamp = data.createdAt.toDate(); 
      const formattedDate = timestamp.toLocaleDateString();
      const formattedTime = timestamp.toLocaleTimeString();
      setFormattedCreatedAt(`${formattedDate} ${formattedTime}`);
    }
  }, [data.createdAt]);

  return (
    <div className='order-card-container'>
      <span>{user?.firstName} {user?.lastName}</span>
      <span>{user?.phoneNumber}</span>
      <span>{user?.email}</span>
      <span>{formattedCreatedAt}</span>
    </div>
  );
};

export default OrderCard;
