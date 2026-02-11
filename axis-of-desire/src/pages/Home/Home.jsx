import React, { useEffect, useState } from "react";
import "./style.css";
import { CompanyQuality, FeatureProducts, ProductBannerCard, VideoProduct } from "../../components";
import { useDispatch } from 'react-redux';
import { AddId } from '../../redux/cartsystem';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from "../../firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Slider from "../../components/Slider/Slider";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        dispatch(AddId(user.uid));
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const getCategory = async () => {
    setLoading(true);
    const collectionRef = collection(db, 'categories');
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCategory(arr);
    setLoading(false);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <Slider />
        <div className="home-product-box">
          {loading ? (
            <>
              <Skeleton height={400}   baseColor='#0B1E48' highlightColor='#081947' width={600}/>
              <Skeleton height={400}   baseColor='#0B1E48' highlightColor='#081947' width={600}/>
            </>
          ) : (
            <>
              <div className="home-product">
                <ProductBannerCard data={category[0]} />
              </div>
              <div className="home-product">
                <ProductBannerCard data={category[1]} />
              </div>
            </>
          )}
        </div>
        <VideoProduct />
        {loading ? <Skeleton height={400}   baseColor='#0B1E48' highlightColor='#081947' width={'100%'}  /> : <ProductBannerCard data={category[2]} />}
  {
    isLoggedin ? <FeatureProducts /> : null
  }
        
      </div>
      <CompanyQuality />
    </div>
  );
};

export default Home;
