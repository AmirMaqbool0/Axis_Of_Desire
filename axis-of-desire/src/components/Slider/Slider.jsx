// Slider.js
import React, { useState, useEffect } from 'react';
import './style.css';
import { useSwipeable } from 'react-swipeable';
import slide1 from '../../assets/card.png';
import slide2 from '../../assets/card2.png';
import slide3 from '../../assets/bannercard.png';
import slide4 from '../../assets/bannercard2.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { app } from '../../firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const slides = [
  {
    image: slide1,
    title: "Get 50% Off on Our New Collections",
    subtitle: "Starting From 1000€",
  },
  {
    image: slide2,
    title: "Explore Our Latest Electronics",
    subtitle: "Best Deals on Top Brands",
  },
  {
    image: slide3,
    title: "Upgrade Your Wardrobe",
    subtitle: "Fashion & Apparel Collection",
  },
  {
    image: slide4,
    title: "Home & Living Essentials",
    subtitle: "Modern Design and Comfort",
  }
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
   const db = getFirestore(app)
  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 3000); 

    return () => clearInterval(autoSlide);
  }, [currentSlide]);

  
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const getSlideData = async() =>{
    setLoading(true)
    const collectionRef = collection(db,'homeSlider')
    const result = await getDocs(collectionRef)
    const arr = result.docs.map((doc)=>(
      {id:doc.id,...doc.data()}
    ))
    setData(arr)
    setLoading(false)
  }
useEffect(()=>{
  getSlideData()
},[])
  return (
    <div className="slider-container" {...handlers}>
      <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {data.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.cover} alt={`Slide ${index + 1}`} />
            <div className="slide-text">
              <h2>{slide.title}</h2>
              <p>{slide.subTitle}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="prev-button" onClick={prevSlide}> <ChevronLeft color='white' /> </button>
      <button className="next-button" onClick={nextSlide}> <ChevronRight color='white' /> </button>
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active-slide' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
