import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    basketData:[]
}


export const basketSlice = createSlice({
    name:"basketDataSlice",
    initialState,
    reducers:{
        addBasketData:(state, action) => {
            state.basketData = action.payload
        }
    }
})



export const {addBasketData} = basketSlice.actions

export default basketSlice.reducer