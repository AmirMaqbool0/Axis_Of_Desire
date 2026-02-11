import React from 'react'
import './style.css'
import Logo from '../../assets/logo.png'
import {ChevronRight} from 'lucide-react'
const PageBanner = ({heading,description}) => {
  return (
    <div className='page-banner-container'>             
     <span>{heading}</span>
     <p>{description}</p>
    </div>
  )
}

export default PageBanner