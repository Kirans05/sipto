import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    coinData:[]
}

export const AssestsSlice = createSlice({
    name:"assestsDataSlice",
    initialState,
    reducers:{
        addAssestsData:(state, action) => {
            state.coinData = action.payload
        }
    }
})



export const {addAssestsData} = AssestsSlice.actions

export default AssestsSlice.reducer