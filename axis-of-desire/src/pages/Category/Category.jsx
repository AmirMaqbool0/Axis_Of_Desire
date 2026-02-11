import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase';
import CategoryCard from './CategoryCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';
import { Search } from 'lucide-react';
import { MoonLoader } from 'react-spinners';

const Category = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const { id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore(app); 
      const productsRef = collection(db, 'categories', id, 'products'); 

      try {
        const querySnapshot = await getDocs(productsRef);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching products: ', error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchProducts();
  }, [id]);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='category-container'>
      <div className="category-search">
        <input 
          type="text" 
          placeholder='Search...' 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <Search color='white' />
      </div>
      <div className="category-products">
        {
          loading ? (
            <div className='loding-container'>
              <MoonLoader size={40} color='#F8C471' />
            </div>
           
          ) : (
            
            filteredProducts.map((product) => (
              <div key={product.id} className="category-card">
                <CategoryCard product={product} cid={id} />
              </div>
            ))
          )
        }
      </div>
      {/* <div className="category-botom-btn">
        <span>showing {loading ? 0 : filteredProducts.length} of {products.length} products</span>
        <button>LOAD MORE</button>
      </div> */}
    </div>
  );
};

export default Category;
