import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Trash, X } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ClockLoader, MoonLoader } from 'react-spinners';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [popup, setPopup] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;

  const db = getFirestore(app);

  const getMessages = async () => {
    setLoading(true);
    const collectionRef = collection(db, 'messages');
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMessages(arr);
    setLoading(false);
  };

  useEffect(() => {
    getMessages();
  }, []);

  const deleteMessage = async (id) => {
    setDeleteLoading(true)
    const docRef = doc(db, 'messages', id);
    await deleteDoc(docRef);
    setDeleteLoading(false)
    getMessages();
  };

  const showPopup = (id) => {
    setPopup((prevPopup) => ({ ...prevPopup, [id]: !prevPopup[id] }));
  };

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  return (
    <div className='messages-container'>
      <div className="messages-heading">
        <span>Messages</span>
      </div>
      <div className="messages">
        {loading ? (
          
          <div className='loading-container'>
          <MoonLoader  color='#0B1E48' size={50}/>
          </div>
        ) : (
          currentMessages.map((message) => (
            <div key={message.id} className="messages-box">
              <span>{message.name}</span>
              <span>{message.email}</span>
              <span>{message.subject}</span>
              <div className='message-row'>
              <div style={{ cursor: 'pointer',marginTop:'7px' }} onClick={() => deleteMessage(message.id)}>
                {
                  deleteLoading ? <ClockLoader  size={20} color='red'/> :  <Trash color='red' />
                }
               
              </div>
              <div style={{ cursor: 'pointer' }} onClick={() => showPopup(message.id)}>
                <span>View</span>
              </div>
              </div>
            

              {popup[message.id] && (
                <div className='message-popup'>
                  <div className="message-popup-box">
                    <div className="message-popup-box-heading">
                      <span>Message</span>
                    </div>
                    <div className="message-info">
                      <div className="text-box">
                        <span>Name</span>
                        <p>{message.name}</p>
                      </div>
                      <div className="text-box">
                        <span>Email</span>
                        <p>{message.email}</p>
                      </div>
                      <div className="text-box">
                        <span>Subject</span>
                        <p>{message.subject}</p>
                      </div>
                      <div className="text-box">
                        <span>Message</span>
                        <p>{message.message}</p>
                      </div>
                    </div>
                    <div className="popup-close-btn" onClick={() => showPopup(message.id)}>
                      <X />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
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
    </div>
  );
};

export default Messages;
