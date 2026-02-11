import React, { useState, useEffect } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ClockLoader } from 'react-spinners';

const FeatureVideo = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const addVideo = async () => {
    setLoading(true)
    if (!videoFile) {
      alert('Please select a video file first.');
      return;
    }

    try {
      const storageRef = ref(storage, `videos/${videoFile.name}`);
      await uploadBytes(storageRef, videoFile);
      const newVideoURL = await getDownloadURL(storageRef);
      const videoRef = doc(db, 'featureVideo', 'Ol7Y0oVIXmVcPGVUUKmw');

      await setDoc(videoRef, {
        videoURL: newVideoURL,
        createdAt: new Date(),
      }, { merge: true });

      setVideoURL(newVideoURL);
      alert('Video updated successfully!');
      setLoading(false)
    } catch (error) {
      console.error('Error uploading video: ', error);
      alert('Failed to update video.');
    }
  };

  const fetchCurrentVideo = async () => {
    try {
      const videoRef = doc(db, 'featureVideo', 'Ol7Y0oVIXmVcPGVUUKmw');
      const videoDoc = await getDoc(videoRef);
      if (videoDoc.exists()) {
        setVideoURL(videoDoc.data().videoURL);
      }
    } catch (error) {
      console.error('Error fetching current video: ', error);
    }
  };

  useEffect(() => {
    fetchCurrentVideo();
  }, []);

  return (
    <div className='feature-video-container'>
      <div className="feature-video-heading">
        <span>Feature Video</span>
      </div>
      <div className="feature-video-form">
        
        {videoURL && (
        <div className="current-video">
          <video controls width="500"  style={{borderRadius:'8px'}}>
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
         
        </div>
      )}
       <input type="file" onChange={handleFileChange} />
        <button onClick={addVideo}> { loading ? <ClockLoader  size={20} color='white'/> : 'Update Video' }</button>
      </div>
      
    </div>
  );
};

export default FeatureVideo;
