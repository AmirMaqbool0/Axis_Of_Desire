import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Products from "../pages/Products/Products";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Categories from "../pages/Categories/Categories";
import AddCategory from "../pages/AddCategory/AddCategory";
import DisplayProducts from "../pages/DisplayProducts/DisplayProducts";
import Messages from "../pages/Messages/Messages";
import Slider from "../pages/Slider/Slider";
import AddSlider from "../pages/Slider/AddSlider";
import FeatureVideo from "../pages/FeatureVideo/FeatureVideo";
import Orders from "../pages/Orders/Orders";
import OrderDetail from "../pages/Orders/OrderDetail";

const Routing = () => {
  return (
    <div >
    
      <BrowserRouter>
      <Header />
      <div style={{display:'flex'}} >
        <Sidebar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/category" element={<Categories  />} />
          {/* <Route path="/addproduct" element={<Products  />} /> */}
          <Route path="/addcategory" element={<AddCategory  />} />
          <Route path="/displayproduct" element={<DisplayProducts  />} />
          <Route path="/messages" element={<Messages  />} /> 
          <Route path="/slider" element={<Slider  />} />          
          <Route path="/slider/addslider" element={<AddSlider  />} />
          <Route path="/featurevideo" element={<FeatureVideo  />} />
          <Route path="/orders" element={<Orders  />} />
          <Route path="/orders/orderdetail/:id" element={<OrderDetail  />} />
        </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Routing;
