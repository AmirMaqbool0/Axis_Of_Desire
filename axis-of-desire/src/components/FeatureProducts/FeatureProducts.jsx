import React, { useEffect, useState } from "react";
import "./style.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import FeatureProductCard from "./FeatureProductCard";
import {app} from '../../firebase'
import { getFirestore ,getDocs,collection} from "firebase/firestore";
import { MoonLoader } from "react-spinners";
const FeatureProducts = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const db = getFirestore(app)
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 480, min: 0 },
      items: 1,
    },
  };
  const getProducts = async () =>{
    setLoading(true)
    const collectionRef = collection(db,'recentlyViewed')
    const result = await getDocs(collectionRef)
    const arr = result.docs.map((doc)=>(
      {id:doc.id,...doc.data()}
    ))
   setData(arr)
   setLoading(false)
  }
  useEffect(()=>{
    getProducts()
  },[])
  return (
    <div className="feature-product-cotainer">
      <div className="feature-product-heading">
        <span>Recently Viewed</span>
        <p>A Product with a pioneering spirit - always looking to the skies</p>
      </div>
      <div className="product-slider">
       
        <Carousel responsive={responsive}>
          {
            loading ? ( <div className="loading-container" style={{width:'100%'}}>
              <MoonLoader  size={40} color="#F8C471"/>
            </div> ) :(
               
        
                data.map((item)=>(
                    <div className="feature-product-card">
    
                        <FeatureProductCard data={item} />
                    </div>
                ))
              
            )
          }
              
        </Carousel>
        {/* <div className="feature-product-btn">
        <button>DISCOVER</button>
      </div>     */}
      </div>
 
    </div>
  );
};

export default FeatureProducts;
