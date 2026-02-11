import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartsystem'; 

const store = configureStore({
  reducer: {
    cart: cartReducer 
  }
});

export default store;
