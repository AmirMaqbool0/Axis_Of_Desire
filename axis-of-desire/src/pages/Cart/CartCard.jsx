import React, { useState } from 'react';
import './style.css';
import CartLogo from '../../assets/card.png';
import { Trash } from 'lucide-react';
import { app } from '../../firebase';
import { doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import ClipLoader from "react-spinners/ClockLoader";

const CartCard = ({ card, refreshCart, calculateTotal }) => {
  const [count, setCount] = useState(card?.quantity);
  const [deleteLoading,setdeleteLoading] = useState(false)
  const db = getFirestore(app);
  const id = useSelector((state) => state.cart.uid);

  const Increment = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await updateQuantity(newCount);
  };

  const Decrement = async () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      await updateQuantity(newCount);
    }
  };

  const updateQuantity = async (newCount) => {
    const docRef = doc(db, 'users', id, 'cart', card.id);
    await updateDoc(docRef, { quantity: newCount });
    refreshCart();
    calculateTotal();
  };

  const getFirstTwoWords = (name) => {
    const words = name.split(' ');
    return words.slice(0, 2).join(' ');
  };

  const DeleteDoc = async (productid) => {
    try {
      setdeleteLoading(true)
      const docRef = doc(db, 'users', id, 'cart', productid);
      await deleteDoc(docRef);
      console.log(`Document with ID ${productid} deleted successfully`);
      refreshCart(); 
      setdeleteLoading(false)
    } catch (error) {
      console.error('Error deleting document: ', error);
    }

  };

  return (
    <div className='cart-card-container'>
      <div className="cart-card-logo">
        <img src={card?.cover} alt="" />
      </div>
      <div className="cart-card-text">
        <div className="row-one">
          <span>{getFirstTwoWords(card?.name)}</span>
          <span>Rs.{card?.price}</span>
        </div>
        <div className="row2">
          <div className="product-quantity">
            <span onClick={Decrement}>-</span>
            <span>{count}</span>
            <span onClick={Increment}>+</span>
          </div>
          <span>Rs.{(card.price * count).toFixed(2)}</span>
          <div onClick={() => DeleteDoc(card.id)} style={{cursor:'pointer'}}>
            {
              deleteLoading ? <ClipLoader color='white' size={30} /> : <Trash color='red' />
            }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
