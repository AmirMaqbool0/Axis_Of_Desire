import React from 'react'
import './style.css'
import Quality from '../../assets/svg/companyQuality/Quality.svg'
import Protection from '../../assets/svg/companyQuality/Protection.svg'
import Shipping from '../../assets/svg/companyQuality/Shipping.svg'
import Support from '../../assets/svg/companyQuality/Support.svg'


const data =[
    {
        title:'High Quality',
        subTitle:'Lorem ipsum dolor sit amet.',
        cover:Quality
    },
    {
        title:'Warranty Protection',
        subTitle:'Lorem ipsum dolor sit amet.',
        cover:Protection
    },
    {
        title:'Free Shipping',
        subTitle:'Lorem ipsum dolor sit amet.',
        cover:Shipping
    },
    {
        title:'24 / 7 Support',
        subTitle:'Lorem ipsum dolor sit amet.',
        cover:Support
    },
]
const CompanyQuality = () => {
  return (
    <div className='company-quality-container'>
        {
            data?.map((item)=>(
                <div className="company-quality-box">
                <img src={item.cover} alt="" />
                <span>{item?.title}</span>
                <p>{item?.subTitle}</p>
            </div>
            ))
        }
       
    </div>
  )
}

export default CompanyQuality