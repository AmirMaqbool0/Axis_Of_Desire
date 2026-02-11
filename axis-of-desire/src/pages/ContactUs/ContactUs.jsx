import React, { useState } from "react";
import "./style.css";

import Phone from "../../assets/svg/contactus/Phone.svg";
import MapPin from "../../assets/svg/contactus/Mappin.svg";
import Clock from "../../assets/svg/contactus/Clock.svg";
import PageBanner from "../../components/PageBanner/PageBanner";
import { app } from '../../firebase';
import { getFirestore, addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { ClockLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const db = getFirestore(app);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!subject) newErrors.subject = 'Subject is required';
    if (!message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const AddMessage = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const notify = () => toast("Message sent successfully");
    setLoading(true);
    try {
      const collectionRef = collection(db, 'messages');
      const docRef = await addDoc(collectionRef, {
        name,
        email,
        subject,
        message
      });
      await updateDoc(doc(db, 'messages', docRef.id), { uid: docRef.id });
      setMessage('');
      setName('');
      setEmail('');
      setSubject('');
      setErrors({});
      notify()
    } catch (error) {
      console.error('Error adding message: ', error);
    }
    setLoading(false);
  };

  return (
    <div className="contactus-container">
      <PageBanner heading={'Contact Us'} description={'For More Information About Our Product & Services. Please Feel Free To Drop Us An Email. Our Staff Always Be There To Help You Out. Do Not Hesitate!'} />
      <div className="contactus-content">
        <div className="contactus-text">
          <span>Get In Touch With Us</span>
        </div>
        <div className="contactus-inner-container">
          <div className="contactus-left">
            <div className="contactus-left-box">
              <img src={MapPin} alt="" />
              <div className="contactus-left-box-text">
                <span>Address</span>
                <p>236 5th SE Avenue, New Brampton NY10000, Canada</p>
              </div>
            </div>
            <div className="contactus-left-box">
              <img src={Phone} alt="" />
              <div className="contactus-left-box-text">
                <span>Phone</span>
                <p>Mobile: +(84) 546-6789 </p>
                <p>Hotline: +(84) 456-6789</p>
              </div>
            </div>
            <div className="contactus-left-box">
              <img src={Clock} alt="" />
              <div className="contactus-left-box-text">
                <span>Working Time</span>
                <p>Monday-Friday: 9:00 - 22:00</p>
                <p>Saturday-Sunday: 9:00 - 21:00</p>
              </div>
            </div>
          </div>
          <div className="contactus-form">
            <div className="contactus-input-box">
              <span>Full name</span>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="contactus-input-box">
              <span>Email</span>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="contactus-input-box">
              <span>Subject</span>
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {errors.subject && <p className="error">{errors.subject}</p>}
            </div>
            <div className="contactus-input-box">
              <span>Message</span>
              <textarea
                name=""
                id=""
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && <p className="error">{errors.message}</p>}
            </div>
            <div className="contactus-btn">
              <button onClick={AddMessage}>{loading ? <ClockLoader  size={20} color="white"/> : 'Submit'}</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
       className='toast'
      />
    </div>
  );
};

export default ContactUs;
