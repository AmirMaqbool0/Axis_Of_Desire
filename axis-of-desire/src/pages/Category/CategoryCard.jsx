import React, { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AddToFavriot } from '../../redux/cartsystem';
import { app } from '../../firebase';
import { getFirestore, collection, doc, addDoc } from 'firebase/firestore';

const CategoryCard = ({ product, cid }) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = useSelector((state) => state.cart.uid);
  const db = getFirestore(app);

  const getFirstTwoWords = (name) => {
    const words = name.split(' ');
    return words.slice(0, 2).join(' ');
  };

  const truncateDescription = (description) => {
    if (description.length <= 100) {
      return description;
    } else {
      return description.substring(0, 100) + '...';
    }
  };

  const handleAddFavorite = () => {
    dispatch(AddToFavriot(product));
    AddToFirestore(product);
    setIsFavorite(true);
  };

  const AddToFirestore = async (item) => {
    const { id, ...itemWithoutId } = item; 
    const docRef = doc(db, 'users', userId);
    const collectionRef = collection(docRef, 'favorite');
    await addDoc(collectionRef, itemWithoutId);
    console.log('Item added to firestore..');
  };

  return (
    <div className="related-product-card-container">
      <div className="related-product-card-logo">
        <img src={product.cover} alt="" />
      </div>
      <div className="related-card-text">
        <h1>{getFirstTwoWords(product.name)}</h1>
        <p>{truncateDescription(product.description)}</p>
        <span>{product.price}$</span>
        <Link to={`/productdetail/${cid}/${product.id}`} style={{ textDecoration: 'none' }} className='btn-link'>
          <button>ADD TO BAG</button>
        </Link>
      </div>
      <div
        className="favorite-btn"
        onClick={isFavorite ? null : handleAddFavorite}
        style={{ cursor: isFavorite ? 'not-allowed' : 'pointer' }}
      >
        <Heart color={isFavorite ? 'red' : 'black'} />
      </div>
    </div>
  );
};

export default CategoryCard;
