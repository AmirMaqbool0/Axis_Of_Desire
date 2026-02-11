import React, { useState } from 'react';
import './style.css';
import { Edit, Trash, X } from 'lucide-react';
import { app } from '../../firebase';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ClockLoader } from 'react-spinners';

const SlideCard = ({ data, refreshSlide }) => {
  const [title, setTitle] = useState(data.title);
  const [subTitle, setSubTitle] = useState(data.subTitle);
  const [image, setImage] = useState(data.cover);
  const [popup, setPopup] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);
  const storage = getStorage(app);

  const deleteSlide = async (id) => {
    setDeleteLoading(true)
    const docRef = doc(db, 'homeSlider', id);
    await deleteDoc(docRef);
    refreshSlide();
    setDeleteLoading(false)
  };

  const showPopup = () => {
    setPopup(!popup);
  };

  const handleFileChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const saveChanges = async (id) => {
    try {
      setLoading(true)
      let updatedImageURL = image;

      if (newImageFile) {
        // Upload new image to Firebase Storage
        const storageRef = ref(storage, `slides/${newImageFile.name}`);
        await uploadBytes(storageRef, newImageFile);
        updatedImageURL = await getDownloadURL(storageRef);
      }
      const docRef = doc(db, 'homeSlider',id );
      await updateDoc(docRef, {
        title,
        subTitle,
        cover: updatedImageURL,
      });
      setLoading(false)
      refreshSlide();
      showPopup();
    } catch (error) {
      console.error('Error updating slide: ', error);
      alert('Failed to update slide.');
    }
  };

  return (
    <div className='slide-card-container'>
      <img src={data?.cover} alt="" />
      <span>{data?.title}</span>
      <div className="message-row">
      <div onClick={showPopup}>
        <Edit />
      </div>
      <div onClick={() => deleteSlide(data.id)} style={{cursor:'pointer'}}>
        {
          deleteLoading ? <ClockLoader color='red' size={30} /> :  <Trash color='red' />
        }
       
      </div>
      </div>
      
      <div className={`${popup ? "slide-popup" : 'hide-popup'}`}>
        <div className="slide-popup-box">
          <input
            type="text"
            placeholder='Title...'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder='Sub title...'
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={()=>saveChanges(data.id)}> {loading ? <ClockLoader size={20} color='white' /> : 'Save Changes'}</button>
          <div className="cut-btn" onClick={showPopup}>
            <X />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
