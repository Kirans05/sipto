import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import userDataSlice from './UserSlice'

const combinedReducer = combineReducers({
    userDataSlice,
});

const masterReducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            userDataSlice: {
                userData: action.payload.userDataSlice.userData
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
