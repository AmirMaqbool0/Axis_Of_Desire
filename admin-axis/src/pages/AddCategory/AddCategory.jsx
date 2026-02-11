import React, { useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, addDoc, collection, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ClockLoader } from 'react-spinners';
const AddCategory = () => {
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState(''); 
    const [image, setImage] = useState(null); 
    const [imageUrl, setImageUrl] = useState(''); 
    const [loading,setLoading] = useState(false)
    const db = getFirestore(app);
    const storage = getStorage(app);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const addCategoryToFirestore = async () => {
        setLoading(true)
        if (!category || !image) {
            console.log('Category name and image are required');
            return;
        }

        try {
            const imageRef = ref(storage, `category_images/${image.name}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);

            const categoryRef = collection(db, 'categories');
            const docRef = await addDoc(categoryRef, {
                name: category,
                coverImage: imageUrl,
                createdAt: Timestamp.fromDate(new Date()),
            });
            const newCategoryId = docRef.id;
            await updateDoc(docRef, {
                id: newCategoryId
            });

            setCategoryId(newCategoryId);
            setCategory('');
            setImage(null);
            setImageUrl(imageUrl);
            setLoading(false)
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div className='addcategory-container'>
            <span>Add Category</span>
            <input
                type="text"
                placeholder='Add Category....'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <input type="file" onChange={handleImageChange} />
            <button onClick={addCategoryToFirestore}>{loading ?<ClockLoader size={20} color='white' /> : 'Add Category' }</button>   
        </div>
    );
};

export default AddCategory;
