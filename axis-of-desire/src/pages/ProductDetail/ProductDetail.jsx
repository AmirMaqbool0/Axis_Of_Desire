import React, { useEffect, useState } from 'react';
import './style.css';
import { Star } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch } from 'react-redux';
import { AddId, AddToCart } from '../../redux/cartsystem';

const ProductDetail = () => {
  const [count, setCount] = useState(1);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToSignup, setRedirectToSignup] = useState(false); // State to track redirection
  const dispatch = useDispatch();
  const { cid, pid } = useParams();

  const Increment = () => {
    setCount(count + 1);
  };

  const Decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    } else {
      setCount(1);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        dispatch(AddId(user.uid));
        setIsLoggedin(true);
        console.log("User logged in");
      } else {
        setIsLoggedin(false);
        console.log('User not logged in');
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const db = getFirestore(app);
      const productRef = doc(db, `categories/${cid}/products`, pid);

      try {
        const docSnapshot = await getDoc(productRef);
        if (docSnapshot.exists()) {
          const productData = docSnapshot.data();
          setProduct({ id: docSnapshot.id, ...productData });
          setCurrentImage(productData.cover);
        } else {
          console.log('No such product document!');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product: ', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [cid, pid]);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setErrorMessage(''); 
  };

  const navigate = useNavigate()
  const handleAddToCart = async () => {
    if (!isLoggedin) {
      setRedirectToSignup(true); 
      return;
    }

    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMessage('Please select a size before adding to cart.');
    } else {
      dispatch(AddToCart({ ...product, quantity: count, size: selectedSize || '' }));
           navigate('/cart')
      if (user) {
        const db = getFirestore(app);
        const userCartRef = doc(db, `users/${user.uid}/cart`, product.id);
        const recentlyViewedCollection = collection(db, 'recentlyViewed');
        const currentTime = new Date();
        const sixteenDaysAgo = new Date(currentTime);
        sixteenDaysAgo.setDate(sixteenDaysAgo.getDate() - 16);

        try {
          const userCartSnapshot = await getDoc(userCartRef);
          if (userCartSnapshot.exists()) {
            await updateDoc(userCartRef, {
              quantity: userCartSnapshot.data().quantity + count,
              size: selectedSize || '',
            });
          } else {
            await setDoc(userCartRef, {
              ...product,
              quantity: count,
              size: selectedSize || '',
            });
          }
          console.log('Product added to Firestore cart');

          const recentlyViewedQuery = query(recentlyViewedCollection, where('id', '==', product.id));
          const recentlyViewedSnapshot = await getDocs(recentlyViewedQuery);

          let shouldAdd = true;

          recentlyViewedSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.timestamp.toDate() >= sixteenDaysAgo) {
              shouldAdd = false;
            }
          });

          if (shouldAdd) {
            await setDoc(doc(recentlyViewedCollection), {
              ...product,
              timestamp: currentTime,
            });
            console.log('Product added to recently viewed');
          } else {
            console.log('Product already viewed within 16 days');
          }
        } catch (error) {
          console.error('Error adding product to Firestore: ', error);
        }
      }
    }
  };

  return (
    <div className='product-detail-container'>
      {
        loading ? (
          <div className='product-detail-loading-container'>
            <div className="product-loading-left">
              <Skeleton height={420} width='90%' borderRadius={12} baseColor='#0B1E48' highlightColor='#081947' />
            </div>
            <div className="product-loading-right">
              <Skeleton width={'60%'} height={35} style={{ marginBottom: '10px' }} baseColor='#0B1E48' highlightColor='#081947' />
              <Skeleton width={'30%'} height={20} style={{ marginBottom: '10px' }} baseColor='#0B1E48' highlightColor='#081947' />
              <Skeleton width={'50%'} height={15} style={{ marginBottom: '10px' }} baseColor='#0B1E48' highlightColor='#081947' />
              <Skeleton count={4} height={15} width={'90%'} style={{ marginBottom: '5px' }} baseColor='#0B1E48' highlightColor='#081947' />
              <Skeleton height={50} width={100} style={{ marginBottom: '10px' }} baseColor='#0B1E48' highlightColor='#081947' />
              <Skeleton height={40} width={'60%'} baseColor='#0B1E48' highlightColor='#081947' />
            </div>
          </div>
        ) : (
          <div className="product-detail-content">
            <div className="product-detail-left">
              <div className="product-detail-images">
                {product?.images.map((item, index) => (
                  <div key={index} className="product-detail-img-box" onClick={() => handleImageClick(item)}>
                    <img src={item} alt={`Image ${index + 1}`} />
                  </div>
                ))}
              </div>
              <div className="product-detail-cover">
                <img src={currentImage} alt="Product Cover" />
              </div>
            </div>
            <div className="product-detail-right">
              <h1>{product?.name}</h1>
              <span>{product?.price}$</span>
              <div className="product-rating">
                <div className="product-rating-stars">
                  {Array(product?.rating).fill().map((_, index) => (
                    <Star key={index} color='yellow' size={18} />
                  ))}
                </div>
                <p>{product?.reviews} Customer Reviews</p>
              </div>
              <p>{product?.description}</p>
              {product?.sizes && product.sizes.length > 0 && (
                <div className="product-detail-sizes">
                  <span>Sizes</span>
                  <div className="product-size-boxes">
                    {product.sizes.map((size, index) => (
                      <div
                        key={index}
                        className={`product-size-box ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        <span>{size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="product-detail-btn">
                <div className="product-detail-quantity">
                  <h1 onClick={Decrement}>-</h1>
                  <span>{count}</span>
                  <h1 onClick={Increment}>+</h1>
                </div>
                {redirectToSignup ? (
                  <Link to="/signup">
                    <button>
                      Add to Cart
                    </button>
                  </Link>
                ) : (
                 
                  <button onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                 
                )}
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ProductDetail;
