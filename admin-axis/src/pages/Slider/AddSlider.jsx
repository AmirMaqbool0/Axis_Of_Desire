import React, { useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ClockLoader } from 'react-spinners';

const AddSlider = () => {
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [cover, setCover] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleFileChange = (e) => {
    setCover(e.target.files[0]);
  };

  const uploadImage = async (image) => {
    if (!image) return '';
    const storageRef = ref(storage, `homeSlider/${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const AddSlider = async () => {
    setLoading(true)
    if (!title || !subTitle || !cover) {
      setError('All fields are required.');
      return;
    }

    try {
      const coverUrl = await uploadImage(cover);
      const collectionRef = collection(db, 'homeSlider');
      const sliderData = {
        title,
        subTitle,
        cover: coverUrl
      };

      await addDoc(collectionRef, sliderData);
      setError('');
      setTitle('');
      setSubTitle('');
      setCover(null);
      alert('Slider added successfully!');
      setLoading(false)
    } catch (err) {
      setError('Failed to add slider.');
      console.error('Error adding document: ', err);
    }
  };

  return (
    <div className='add-slider-container'>
      <div className="add-slider-heading">
        <span>Add Slide</span>
      </div>
      <div className="add-slider-form">
        <input 
          type="text" 
          placeholder='Title' 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder='subTitle' 
          value={subTitle} 
          onChange={(e) => setSubTitle(e.target.value)} 
        />
        <input 
          type="file" 
          onChange={handleFileChange} 
        />
        {error && <p className="error">{error}</p>}
        <button onClick={AddSlider}> {loading ? <ClockLoader color='white' size={20}/> :'Add Slider' }</button>
      </div>
    </div>
  );
};

export default AddSlider;
