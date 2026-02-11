import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const VideoProduct = () => {
  const [video, setVideo] = useState(null);
  const db = getFirestore(app);

  const getVideo = async () => {
    const docRef = doc(db, 'featureVideo', 'Ol7Y0oVIXmVcPGVUUKmw');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setVideo(docSnap.data());
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    getVideo();
  }, []);

  console.log(video);

  return (
    <div className='video-product-container'>
      <div className="video-product-video">
        {video ? (
          <video src={video.videoURL} controls autoPlay muted></video>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* <div className="video-product-text">
        <h1>Santos De Cartier</h1>
        <p>A watch with a pioneering spirit - always looking to the skies</p>
        <Link to={'/productdetail'} style={{ textDecoration: 'none' }}>
          <span>Shop The Collection</span>
        </Link>
      </div> */}
    </div>
  );
};

export default VideoProduct;
