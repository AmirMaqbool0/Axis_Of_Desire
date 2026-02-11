import React, { useState } from 'react'
import Logo from '../../assets/card2.png'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { doc, deleteDoc, getFirestore } from 'firebase/firestore';
import { ClockLoader } from 'react-spinners';
const WishListCard = ({data,refreshCart}) => {
  const id = useSelector((state) => state.cart.uid);
   const [loading,setLoading] = useState(false)
  const getFirstTwoWords = (name) => {
    const words = name.split(' ');
    return words.slice(0, 2).join(' ');
  };
  const truncateDescription = (description) => {
    if (description.length <= 100) {
      return description;
    } else {
      return description.substring(0, 100) + '...';
    }
  };
  const db = getFirestore(app)
  const DeleteDoc = async (productid) => {
    try {
      setLoading(true)
      const docRef = doc(db, 'users', id, 'favorite', productid);
      await deleteDoc(docRef);
      console.log(`Document with ID ${productid} deleted successfully`);
      refreshCart(); 
      setLoading(false)
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  return (
    <div className="wishlist-card-container">
    <div className="wishlist-card-logo">
      <img src={data?.cover} alt="" />
    </div>
    <div className="wishlist-card-text">
      <h1>{  getFirstTwoWords(data?.name) }</h1>
      <p>
        {truncateDescription(data?.description)}
      </p>
      <span>{data?.price}</span>
    <Link to={'/productdetail'} className='btn-link'><button>ADD TO BAG</button> </Link>
    </div>
    <div className="wishlist-closed-btn" onClick={()=>DeleteDoc(data?.id)}>
      {
        loading ? <ClockLoader size={20} color='white' /> :  <X />
      }
       
    </div>
  </div>
  )
}

export default WishListCard