import React, { useEffect, useState } from "react";
import "./style.css";
import Logo from '../../assets/logo.png';
import User from '../../assets/svg/header/User.svg';
import Heart from '../../assets/svg/header/Heart.svg';
import Shop from '../../assets/svg/header/Shop.svg';
import History from '../../assets/svg/header/History.svg';
import LogoutLogo from '../../assets/svg/header/Logout.svg';
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import { collection, getFirestore, getDocs } from "firebase/firestore";

const Header = () => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [category, setCategory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const toggleSubMenu = (event) => {
    event.stopPropagation();
    setIsSubMenuVisible(!isSubMenuVisible);
  };

  const hideSubMenu = () => {
    setIsSubMenuVisible(false);
  };

  const ShowSideBar = () => {
    setSideNav(!sideNav);
  };

  const auth = getAuth(app);

  const logOut = () => {
    signOut(auth);
  };

  const db = getFirestore(app);

  const getCategory = async () => {
    const collectionRef = collection(db, 'categories');
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => (
      { id: doc.id, ...doc.data() }
    ));
    setCategory(arr);
  };

  useEffect(() => {
    getCategory();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // Close submenu when route changes
    hideSubMenu();
  }, [location]);

  useEffect(() => {
    // Close submenu when clicking anywhere on the document
    const handleClickOutside = () => {
      hideSubMenu();
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="header-container" onClick={(e) => e.stopPropagation()}>
      <div className="header-logo">
        <img src={Logo} alt="Logo" />
        <span>Axis of desire</span>
      </div>
      
      <div className={`${sideNav ? 'sidebar' : 'header-menu'}`}>
        <NavLink to={'/'} style={{ textDecoration: 'none' }}><span>Home</span></NavLink>
        <span onClick={toggleSubMenu} className="category-menu">
          Category
          {isSubMenuVisible && (
            <ul className="sub-menu">
              {category?.map((data) => (
                <NavLink to={`/category/${data.id}`} style={{ textDecoration: 'none' }} key={data.id}>
                  <li>{data.name}</li>
                </NavLink>
              ))}
            </ul>
          )}
        </span>
        <NavLink to={'/about'} style={{ textDecoration: 'none' }}><span>About</span></NavLink>
        <NavLink to={'/contactus'} style={{ textDecoration: 'none' }}><span>Contact</span></NavLink>
      </div>
      <div className="header-right">
        <div className="menu-icon" onClick={ShowSideBar}>
          <Menu color="white" />
        </div>
        {!isLoggedIn && <NavLink to={'/signup'}><img src={User} alt="User" /></NavLink>}
        {isLoggedIn && <img src={LogoutLogo} alt="Logout" onClick={logOut} style={{marginTop:'5px'}}/>}
        <NavLink to={'/wishlist'}><img src={Heart} alt="Heart" /></NavLink>
        <NavLink to={'/cart'}><img src={Shop} alt="Shop" /></NavLink>
        <NavLink to={'/orderhistory'}><img src={History} alt="History" style={{width:'21.2px', height:'21.2px'}} /></NavLink>
      </div>
    </div>
  );
};

export default Header;
