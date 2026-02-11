import React, { useEffect, useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import SlideCard from './SlideCrad';
import { app } from '../../firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { MoonLoader } from 'react-spinners';

const Slider = () => {
  const [slide, setSlide] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const slidesPerPage = 5;
  const db = getFirestore(app);

  const fetchSlide = async () => {
    setLoading(true);
    try {
      const productsRef = collection(db, 'homeSlider');
      const querySnapshot = await getDocs(productsRef);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlide(productsData);
    } catch (error) {
      console.error('Error fetching products: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlide();
  }, []);

  const refreshSlide = () => {
    fetchSlide();
  };

  const indexOfLastSlide = currentPage * slidesPerPage;
  const indexOfFirstSlide = indexOfLastSlide - slidesPerPage;
  const currentSlides = slide.slice(indexOfFirstSlide, indexOfLastSlide);

  const totalPages = Math.ceil(slide.length / slidesPerPage);

  return (
    <div className='slider-container'>
      <div className="slider-header">
        <span></span>
        <span>Home Slider</span>
        <Link to={'/slider/addslider'}>
          <button>Add Slider</button>
        </Link>
      </div>

      <div className="slide-card">
        {loading ? (
          
          <div className='loading-container'>
          <MoonLoader  color='#0B1E48' size={50}/>
          </div>
        ) : (
          currentSlides.map((item) => (
            <SlideCard key={item.id} data={item} refreshSlide={refreshSlide} />
          ))
        )}
      </div>

      <div className="pagination" style={{marginTop:'15px'}}>
        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Slider;
