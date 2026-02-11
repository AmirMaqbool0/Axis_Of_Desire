import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';

const EditCategoryModal = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category.name);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(category.coverImage || '');

  const storage = getStorage(app);

  useEffect(() => {
    setName(category.name);
    setImageUrl(category.coverImage || '');
  }, [category]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    let updatedImageUrl = imageUrl;

    if (image) {
      const imageRef = ref(storage, `category_images/${image.name}`);
      await uploadBytes(imageRef, image);
      updatedImageUrl = await getDownloadURL(imageRef);
    }

    onSave({ ...category, name, coverImage: updatedImageUrl });
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>Edit Category</h2>
        <input 
          type="text" 
          placeholder='Category Name' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input type="file" onChange={handleImageChange} />
        {imageUrl && <img src={imageUrl} alt="Category Cover" width={100} />}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditCategoryModal;
