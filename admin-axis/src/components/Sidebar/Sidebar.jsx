import React from 'react'
import './style.css'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar-container'>
    <div className="side-bar-link">
       <ul>
     <NavLink to={'/'} style={{textDecoration:'none'}}>    <li>Add Products</li> </NavLink> 
      <NavLink to={'/category'} style={{textDecoration:'none'}}>    <li>categories</li>  </NavLink>
      <NavLink to={'/displayproduct'} style={{textDecoration:'none'}}> <li>Products</li> </NavLink>
      <NavLink to={'/messages'} style={{textDecoration:'none'}}> <li>Messgaes</li> </NavLink>
      <NavLink to={'/slider'} style={{textDecoration:'none'}}> <li>Home Slider</li> </NavLink>
      <NavLink to={'/featurevideo'} style={{textDecoration:'none'}}> <li>Feature Video</li> </NavLink>
      <NavLink to={'/orders'} style={{textDecoration:'none'}}> <li>Orders</li> </NavLink>
       </ul>
    </div>
   </div>

  )
}

export default Sidebar