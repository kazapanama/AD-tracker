import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import unitReducer from './slices/unitSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    units: unitReducer
  },
});
