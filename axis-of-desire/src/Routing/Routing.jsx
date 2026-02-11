import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Header from '../components/Header/Header'
import { Footer } from '../components'
import Category from '../pages/Category/Category'
import CartCard from '../pages/Cart/CartCard'
import Cart from '../pages/Cart/Cart'
import ContactUs from '../pages/ContactUs/ContactUs'
import Signup from '../pages/Signup/Signup'
import Signin from '../pages/Signin/Signin'
import WishList from '../pages/WishList/WishList'
import CheckOut from '../pages/CheckOut/CheckOut'
import ProductDetail from '../pages/ProductDetail/ProductDetail'
import ScrollToTop from '../utils/ScrollToTop'
import About from '../pages/About/About'
import OrderHistory from '../pages/OrderHistory/OrderHistory'

const Routing = () => {
  return (
    <div>
        <BrowserRouter>
        <ScrollToTop />
        <Header />
          <Routes>
            <Route  path='/' element={<Home />}/>
            <Route  path='/productdetail/:cid/:pid' element={<ProductDetail />}/>
            <Route  path='/category/:id' element={<Category />}/>
            <Route  path='/cart' element={<Cart  />}/>
            <Route  path='/contactus' element={<ContactUs  />}/>
            <Route  path='/signup' element={<Signup  />}/>
            <Route  path='/signin' element={<Signin  />}/>
            <Route  path='/wishlist' element={<WishList  />}/>
            <Route  path='/checkout' element={<CheckOut  />}/>
            <Route  path='/about' element={<About  />}/>
            <Route  path='/orderhistory' element={<OrderHistory  />}/>
          </Routes>
          <Footer />
        </BrowserRouter>
    </div>
  )
}

export default Routing