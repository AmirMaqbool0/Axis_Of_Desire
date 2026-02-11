import React from 'react'
import './style.css'
import { Link, NavLink } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='footer-container'>
     <div className="footer-content">
        <div className="footer-site-info">
            <span>Axis of desire</span>
            <p>400 University Drive Suite 200 Coral Gables,
                <br />
            FL 33134 USA</p>
        </div>
        <div className="footer-links">
            <div className="footer-link-box">
                <span>Links</span>
            <Link to={'/'} style={{textDecoration:'none'}}><p>Home</p> </Link>
              {/* <Link to={'/category'} style={{textDecoration:'none'}}><p>Category</p> </Link> */}
             
               <Link to={'/about'} style={{textDecoration:'none'}}> <p>About</p> </Link>
               <Link to={'/contactus'} style={{textDecoration:'none'}}> <p>Contact us</p> </Link>
            </div>
            <div className="footer-link-box">
                <span>Helps</span>
                <p>Payment Options</p>
                <p>Returns</p>
                <p>Privacy Policies</p>
                
            </div>
        </div>
     </div>
     <div className="footer-bottom">
        <span>2024 Axis of desire. All rights reverved</span>
       </div>
    </div>
  )
}

export default Footer