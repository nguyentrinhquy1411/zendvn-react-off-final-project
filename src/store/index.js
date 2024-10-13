import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';
import commentReducer from './commentSlice';
import menuReducer from './menuSlice';
import postReducer from './postSlice';

const rootReducer = {
  POST: postReducer,
  CATEGORY: categoryReducer,
  MENU: menuReducer,
  AUTH: authReducer,
  COMMENT: commentReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
