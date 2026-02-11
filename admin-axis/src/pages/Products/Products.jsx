import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, collection, getDocs, addDoc, Timestamp, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ClockLoader } from 'react-spinners';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);
  const storage = getStorage(app);

  const sizes = ['XL', 'SM', 'LG'];

  const getCategory = async () => {
    try {
      const collectionRef = collection(db, 'categories');
      const result = await getDocs(collectionRef);
      const categoryArray = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoryArray);
      if (categoryArray.length > 0) {
        setSelectedCategory(categoryArray[0]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleImageUpload = async (file) => {
    if (file) {
      const storageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProductImages([...productImages, url]);
    }
  };

  const handleCoverUpload = async (file) => {
    if (file) {
      const storageRef = ref(storage, `products/cover_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCoverImage(url);
    }
  };

  const addProductToCategory = async () => {
    if (!selectedCategory || !productName || !productPrice || !productDescription || productImages.length === 0 || !coverImage) {
      alert('All fields except sizes are required.');
      return;
    }

    setLoading(true);
    if (selectedCategory) {
      try {
        const categoryDocRef = doc(db, 'categories', selectedCategory.id);
        const productsCollectionRef = collection(categoryDocRef, 'products');

        await addDoc(productsCollectionRef, {
          name: productName,
          price: parseFloat(productPrice),
          description: productDescription,
          sizes: selectedSizes,
          images: productImages,
          cover: coverImage,
          createdAt: Timestamp.fromDate(new Date()),
          categoryId: selectedCategory.id,
        });

        console.log(`Product added to category: ${selectedCategory.name}`);
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setSelectedSizes([]);
        setProductImages([]);
        setCoverImage(null);
        setLoading(false);
      } catch (error) {
        console.error('Error adding product:', error);
        setLoading(false);
      }
    }
  };

  return (
    <div className='product-container'>
      <div className="product-header">
        {categories.map((item) => (
          <span
            key={item.id}
            onClick={() => setSelectedCategory(item)}
            className={`category-item ${selectedCategory?.id === item.id ? 'selected' : ''}`}
          >
            {item.name}
          </span>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="add-product-form">
          <h3>Add Product to {selectedCategory.name}</h3>
          <div className="row1">
            <input
              type="text"
              placeholder='Product Name'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder='Product Price'
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          
          <textarea
            placeholder='Product Description'
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          
          <div className="sizes">
            <span>Sizes (Optional)</span>
            <div className="sizes-boxes">
              {sizes.map((size) => (
                <div
                  key={size}
                  className={`size-box ${selectedSizes.includes(size) ? 'selected-size' : ''}`}
                  onClick={() => handleSizeToggle(size)}
                >
                  <span>{size}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-images">
            <span>Images</span>
            <div className="images">
              {productImages.map((image, index) => (
                <img key={index} src={image} alt={`Product ${index}`} className='product-image' />
              ))}
              <input
                type="file"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </div>
          </div>
          
          <div className="cover">
            <span>Cover</span>
            <div className="cover-box">
              {coverImage && <img src={coverImage} alt='Cover' className='cover-image' />}
              <input
                type="file"
                onChange={(e) => handleCoverUpload(e.target.files[0])}
              />
            </div>
          </div>
          
          <button onClick={addProductToCategory} className='Add-btn'> 
            {loading ? <ClockLoader size={20} color='white'/> : 'Add Product'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
