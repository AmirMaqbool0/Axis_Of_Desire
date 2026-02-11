import React, { useEffect, useState } from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import { app } from '../../firebase';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EditCategoryModal from './EditCategoryModal';
import { ClockLoader, MoonLoader } from 'react-spinners';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const db = getFirestore(app);

  const getCategory = async () => {
    try {
      setLoading(true);
      const collectionRef = collection(db, 'categories');
      const result = await getDocs(collectionRef);
      const arr = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(arr);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const deleteCategory = async (id) => {
    try {
      setDeleteLoading(true)
      const docRef = doc(db, 'categories', id);
      await deleteDoc(docRef);
      getCategory();
      setDeleteLoading(false)
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const editCategory = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const updateCategory = async (updatedCategory) => {
    if (!updatedCategory.name || !updatedCategory.coverImage) {
      alert('All fields are required.');
      return;
    }

    try {
      const docRef = doc(db, 'categories', updatedCategory.id);
      await updateDoc(docRef, {
        name: updatedCategory.name,
        coverImage: updatedCategory.coverImage,
      });
      setIsModalOpen(false);
      getCategory();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <div className='categories-container'>
      <div className="categories-header">
        <input 
          type="text" 
          placeholder='Search...' 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <NavLink to={'/addcategory'}>
          <button>Add Category</button>
        </NavLink>
      </div>

      <div className="category-boxes">
        {loading ? (
          
          <div className='loading-container'>
          <MoonLoader  color='#0B1E48' size={50}/>
          </div>
        ) : (
          currentItems.map((item) => (
            <div className="category-box" key={item.id}>
              <span>{item.name}</span>
              <div className="edit-box">
              <div onClick={() => editCategory(item)}>
                <Edit color='#0B1E48' />
              </div>
              <div onClick={() => deleteCategory(item.id)} style={{cursor:'pointer'}}>
                {
                  deleteLoading ? <ClockLoader  size={30} color='red' /> : <Trash color='red' />
                }
                
              </div>
              </div>
             
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={nextPage} disabled={currentPage * itemsPerPage >= filteredCategories.length}>Next</button>
      </div>

      {isModalOpen && 
        <EditCategoryModal 
          category={selectedCategory} 
          onClose={() => setIsModalOpen(false)} 
          onSave={updateCategory} 
        />
      }
    </div>
  );
};

export default Categories;
