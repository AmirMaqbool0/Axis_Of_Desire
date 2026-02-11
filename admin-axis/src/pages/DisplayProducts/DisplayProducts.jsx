import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit, Search, Trash, X } from 'lucide-react';
import { ClockLoader, MoonLoader } from 'react-spinners';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const DisplayProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updateLoading,setUpdateLoading] = useState(false)
    const [editableProduct, setEditableProduct] = useState({
        name: '',
        price: '',
        description: '',
        sizes: [],
        images: [],
        cover: ''
    });
    const productsPerPage = 3;
    const db = getFirestore(app);
    const storage = getStorage(app);

    const sizes = ['XL', 'SM', 'LG'];

    const getCategory = async () => {
        try {
            setLoading(true);
            const collectionRef = collection(db, 'categories');
            const result = await getDocs(collectionRef);
            const categoryArray = result.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(categoryArray);
            if (categoryArray.length > 0) {
                setSelectedCategoryId(categoryArray[0].id);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const fetchProducts = async (categoryId) => {
        try {
            setLoading(true);
            const productsRef = collection(db, 'categories', categoryId, 'products');
            const querySnapshot = await getDocs(productsRef);
            const productsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            fetchProducts(selectedCategoryId);
        }
    }, [selectedCategoryId]);

    const deleteProduct = async (productId) => {
        try {
            setDeleteLoading(true);
            const docRef = doc(db, 'categories', selectedCategoryId, 'products', productId);
            await deleteDoc(docRef);
            console.log(`Product with ID ${productId} deleted successfully`);
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
            setDeleteLoading(false);
        } catch (error) {
            console.error('Error deleting product: ', error);
            setDeleteLoading(false);
        }
    };

    const updateProduct = async () => {
        try {
            setUpdateLoading(true)
            const docRef = doc(db, 'categories', selectedCategoryId, 'products', editableProduct.id);
            await updateDoc(docRef, editableProduct);
            setProducts(prevProducts => prevProducts.map(p => p.id === editableProduct.id ? editableProduct : p));
            setIsModalOpen(false);
            setUpdateLoading(false)
        } catch (error) {
            console.error('Error updating product: ', error);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditableProduct(product);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSizeToggle = (size) => {
        setEditableProduct(prevProduct => {
            const newSizes = prevProduct.sizes.includes(size)
                ? prevProduct.sizes.filter(s => s !== size)
                : [...prevProduct.sizes, size];
            return { ...prevProduct, sizes: newSizes };
        });
    };

    const handleImageUpload = async (file, type) => {
        if (file) {
            const storageRef = ref(storage, `products/${type}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            if (type === 'cover') {
                setEditableProduct(prevProduct => ({ ...prevProduct, cover: url }));
            } else {
                setEditableProduct(prevProduct => ({ ...prevProduct, images: [...prevProduct.images, url] }));
            }
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className='display-product-container'>
            <div className="display-product-header">
                {categories.map((item) => (
                    <span 
                        key={item.id} 
                        onClick={() => setSelectedCategoryId(item.id)} 
                        className={selectedCategoryId === item.id ? 'selected' : ''}
                    >
                        {item.name}
                    </span>
                ))}
            </div>
            <div className="display-product-search">
                <input 
                    type="text" 
                    placeholder='Search...' 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <Search />
            </div>
            <div className="products">
                {loading ? (
                    <div className='loading-container'>
                    <MoonLoader  color='#0B1E48' size={50}/>
                    </div>
                ) : (
                    currentProducts.length > 0 ? (
                        currentProducts.map(product => (
                            <div className="product-box" key={product.id}>
                                <img src={product.cover} alt={product.name} />
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <div className="message-row">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleEditClick(product)}>
                                    <Edit color='black' />
                                </div>
                                <div style={{ cursor: 'pointer' }} onClick={() => deleteProduct(product.id)}>
                                   {deleteLoading ? <ClockLoader size={30} color='red' /> : <Trash color='red' />}
                                </div>
                                </div>
                              
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )
                )}
            </div>
            <div className="pagination">
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

            <Modal 
                isOpen={isModalOpen} 
                onRequestClose={handleModalClose}
                contentLabel="Update Product"
            >
                {editableProduct && (
                    <div className="modal-container">
                         <div className="modal-row1">
                            <input 
                                type="text" 
                                placeholder='Name' 
                                name="name" 
                                value={editableProduct.name} 
                                onChange={handleInputChange} 
                            />
                            <input 
                                type="text" 
                                placeholder='Price' 
                                name="price" 
                                value={editableProduct.price} 
                                onChange={handleInputChange} 
                            />
                         </div>
                         <textarea 
                             placeholder='Description....' 
                             name="description" 
                             value={editableProduct.description} 
                             onChange={handleInputChange} 
                         />
                         <div className="sizes-boxs">
                            <span>Sizes</span>
                            <div className="sizes-boxes">
                                {sizes.map(size => (
                                    <div 
                                        key={size} 
                                        className={`size-box ${editableProduct.sizes.includes(size) ? 'selected-size' : ''}`} 
                                        onClick={() => handleSizeToggle(size)}
                                    >
                                        <span style={{color:'#F8C471'}}>{size}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                         <div className="modal-images">
                            <span>Images</span>
                            <div className="modal-images-box">
                                {editableProduct.images.map((image, index) => (
                                    <img key={index} src={image} alt={`Product ${index}`} className='product-image' />
                                ))}
                                <input 
                                    type="file" 
                                    onChange={(e) => handleImageUpload(e.target.files[0], 'image')} 
                                />
                            </div>
                         </div>
                         <div className="modal-cover">
                            <span>Cover</span>
                            <div className="modal-cover-box">
                                {editableProduct.cover && <img src={editableProduct.cover} alt='Cover' className='cover-image' />}
                                <input 
                                    type="file" 
                                    onChange={(e) => handleImageUpload(e.target.files[0], 'cover')} 
                                />
                            </div>
                         </div>
                         <button type="submit" onClick={updateProduct}> {updateLoading ? <ClockLoader size={20} color='white' /> : 'Update' } </button>
                         <button type="button" onClick={handleModalClose} className='cancel-btn'><X color='white' /></button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DisplayProducts;
