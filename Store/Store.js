import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import userDataSlice from './UserSlice'
import basketDataSlice from './BasketSlice'
import portfolioDataSlice from './PortFolioSlice'
import assestsDataSlice from './AssestsSlice'

const combinedReducer = combineReducers({
    userDataSlice,
    basketDataSlice,
    portfolioDataSlice,
    assestsDataSlice
});

const masterReducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            userDataSlice: {
                userData: action.payload.userDataSlice.userData
            },
            basketDataSlice:{
              basketData:action.payload.basketDataSlice.basketData
            },
            portfolioDataSlice:{
              positionsArr:action.payload.portfolioDataSlice.positionsArr
            },
            assestsDataSlice:{
              coinData:action.payload.assestsDataSlice.coinData
            }
        }
        return nextState;
    } else {
    return combinedReducer(state, action)
  }
}

export const makeStore = () =>
  configureStore({
    reducer: masterReducer,
  });

export const wrapper = createWrapper(makeStore, { debug: true });
