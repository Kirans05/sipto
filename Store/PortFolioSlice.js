import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    positionsArr : []
}

export const portfolioSlice = createSlice({
    name:"portfolioDataSlice",
    initialState,
    reducers:{
        addPortfolioData:(state, action) => {
            state.positionsArr = action.payload
        }
    }
})


export const {addPortfolioData} = portfolioSlice.actions


export default portfolioSlice.reducer