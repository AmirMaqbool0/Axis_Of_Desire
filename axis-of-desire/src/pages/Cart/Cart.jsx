import React, { useEffect, useState } from "react";
import "./style.css";
import CartCard from "./CartCard";
import PageBanner from "../../components/PageBanner/PageBanner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { app } from '../../firebase';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { MoonLoader } from "react-spinners";
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const id = useSelector((state) => state.cart.uid);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const getCart = async () => {
    setLoading(true);
    const collectionRef = collection(db, 'users', id, 'cart');
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({
      id: doc.id,
      productId: doc.data().productId, 
      categoryId: doc.data().categoryId, 
      ...doc.data()
    }));
    setData(arr);
    calculateTotal(arr);
    setLoading(false);
  };

  useEffect(() => {
    getCart();
  }, []);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const refreshCart = () => {
    getCart();
  };

  const ClearCart = async () => {
    try {
      const collectionRef = collection(db, 'users', id, 'cart');
      const querySnapshot = await getDocs(collectionRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      console.log('Cart successfully cleared');
      refreshCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const makePayment = async () => {
    try {
      const stripe = await loadStripe("pk_test_51PiAAHRv0Tzi9A7AYLLoFPnhJ5Cz2PMxgAxKjGOWDoy00DkJnqbPmX0DxRyndEG4w3oZ2YerzBUFNDCKq8GaNPWY00WnJG7lFx");
  
      const body = {
        products: data
      };
  
      const response = await fetch("http://localhost:7000/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to create checkout session:', errorData);
        return;
      }
  
      const session = await response.json();
  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });
  
      if (result.error) {
        console.error('Error redirecting to checkout:', result.error.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderItems = data.map(item => ({
        productId: item.id,
        categoryId: item.categoryId,
        quantity: item.quantity,
        price: item.price
      }));

      const order = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        orderPlacedBy: id,
        transactionId: '', 
        products: orderItems,
        status: 'pending',
        total: total
      };

      const collectionRef = collection(db, 'orders');
      await addDoc(collectionRef, order);
      makePayment()
      // navigate('/checkout');
      ClearCart();

    } catch (error) {
      console.error('Error placing order: ', error);
    }
  };


  

  return (
    <div className="cart-container">
      <PageBanner heading={'Cart'} />
      <div className="cart-content">
        <div className="cart-boxs">
          <div className="cart-box-header">
            <div className="row-one">
              <span></span>
              <span>Product</span>
              <span className="price-header">Price</span>
            </div>
            <div className="row2">
              <span>Quantity</span>
              <span>Subtotal</span>
              <span></span>
            </div>
          </div>
          {loading ? (
            <div className="loading-container">
              <MoonLoader size={40} color="#F8C471" />
            </div>
          ) : data.length === 0 ? (
            <div className="empty-cart-message">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            data.map((item) => (
              <div className="cart-card" key={item.id}>
                <CartCard card={item} refreshCart={refreshCart} calculateTotal={calculateTotal} />
              </div>
            ))
          )}
        </div>
        <div className="cart-total">
          <div className="cart-total-heading">
            <span>Cart Totals</span>
          </div>
          <div className="cart-total-boxs">
            <div className="cart-total-text-box">
              <span>Subtotal</span>
              <p>Rs. {total.toFixed(2)}</p>
            </div>
            <div className="cart-total-text-box">
              <span>Total</span>
              <p style={{ color: '#B88E2F', fontSize: '16px' }}>Rs. {total.toFixed(2)}</p>
            </div>
            <div className="cart-total-btn">
              <button onClick={handleCheckout}>Check Out</button>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
