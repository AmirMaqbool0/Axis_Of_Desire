import React, { useEffect, useState } from 'react';
import './style.css';
import { app } from '../../firebase';
import { getFirestore, getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { MoonLoader } from 'react-spinners';

const OrderDetail = () => {
    const [order, setOrder] = useState({});
    const [productsData, setProductsData] = useState([]);
    const [newStatus, setNewStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const db = getFirestore(app);
    const { id } = useParams();

    const getOrder = async () => {
        try {
            const docRef = doc(db, 'orders', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setOrder(docSnap.data());
                setNewStatus(docSnap.data().status || ''); 
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsData = async () => {
        try {
            setProductsLoading(true);
            const products = order.products || [];
            const productsDetails = [];

            for (const product of products) {
                const categoryId = product.categoryId;
                const productId = product.productId;
                const categoryDocRef = doc(db, 'categories', categoryId);
                const categoryDocSnap = await getDoc(categoryDocRef);

                if (categoryDocSnap.exists()) {
                    const productsCollectionRef = collection(categoryDocRef, 'products');
                    const productDocRef = doc(productsCollectionRef, productId);
                    const productDocSnap = await getDoc(productDocRef);

                    if (productDocSnap.exists()) {
                        const productData = productDocSnap.data();
                        const productWithQuantity = {
                            ...productData,
                            quantity: product.quantity,
                            totalPrice: productData.price * product.quantity,
                        };
                        productsDetails.push(productWithQuantity);
                    } else {
                        console.log(`Product with ID ${productId} not found in category ${categoryId}`);
                    }
                } else {
                    console.log(`Category with ID ${categoryId} not found`);
                }
            }

            setProductsData(productsDetails);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setProductsLoading(false);
        }
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleSaveChanges = async () => {
        try {
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, {
                status: newStatus,
            });
            console.log('Status updated successfully!');
            setOrder({
                ...order,
                status: newStatus,
            });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        getOrder();
    }, [id]);

    useEffect(() => {
        if (order.products) {
            fetchProductsData();
        }
    }, [order]);

    return (
        <div className='order-detail-container'>
            <div className='order-detail-heading'>
                <span>Order Detail</span>
            </div>
            <div className='order-products'>
                {productsLoading ? (
                   <div className='loading-container'>
                   <MoonLoader  color='#0B1E48' size={50}/>
                   </div>
                ) : (
                    productsData.map((product, index) => (
                        <div key={index} className='product-details'>
                            <img src={product.cover} alt='' />
                            <span>{product.name}</span>
                            <span>{product.price}</span>
                            <span>{product.quantity}</span>
                            <span>{product.totalPrice}</span>
                        </div>
                    ))
                )}
            </div>
            <div className='order-status'>
                <div className="status-dropdown">
                    <select value={newStatus} onChange={handleStatusChange}>
                        <option value="PENDING">Pending</option>
                        <option value='DISPATCH'>DISPATCH</option>
                        <option value='INTRANSIT'>INTRANSIT</option>
                        <option value='COMPLETED'>COMPLETED</option>
                        <option value='REJECTED'>REJECTED</option>
                        <option value='DELIVERED'>DELIVERED</option>
                    </select>
                </div>
                <div className="total-amount">
                    <div className="total-amount-box">
                        <span>{loading ? <Skeleton width={100} /> : `$${order.total}`}</span>
                    </div>
                </div>
            </div>
            <div className='order-detail-btn'>
                <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
};

export default OrderDetail;
