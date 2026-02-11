

import { createSlice } from '@reduxjs/toolkit';

const initialState={
  uid:'',
  cart: [],
  quantity: 0,
  favriot:[]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    AddToCart: (state, action) => {
      const findIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (findIndex >= 0) {
       
        state.cart[findIndex].quantity += action.payload.quantity;
      } else {
        
        const newItem = { ...action.payload, quantity: action.payload.quantity };
        state.cart.push(newItem);
      }
      state.quantity += action.payload.quantity;
    },
    AddId:(state,action) =>{
      state.uid= action.payload
    },
   AddToFavriot : (state, action) => {
      const findIndex = state.favriot.findIndex(item => item.id === action.payload.id);
      if (findIndex >= 0) {
       
        state.favriot[findIndex].quantity += action.payload.quantity;
      } else {
        
        const newItem = { ...action.payload, quantity: action.payload.quantity };
        state.favriot.push(newItem);
      }
      state.quantity += action.payload.quantity;
    },
    
  },

});

export const { AddToCart ,AddId,AddToFavriot} = cartSlice.actions;
export default cartSlice.reducer;
