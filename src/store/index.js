import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';
import commentReducer from './commentSlice';
import menuReducer from './menuSlice';
import postReducer from './postSlice';
import userReducer from './usersSlice';
import tagsReducer from './TagsSlice';

const rootReducer = {
  POST: postReducer,
  CATEGORY: categoryReducer,
  MENU: menuReducer,
  AUTH: authReducer,
  COMMENT: commentReducer,
  USERS: userReducer,
  TAGS: tagsReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
