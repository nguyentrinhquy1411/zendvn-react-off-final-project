// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import usersService from '../services/usersService';
import { mappingUsersData } from '../helpers';
import tagsService from '../services/tagsService';

const initialState = {
  token: localStorage.getItem('ACCESS_TOKEN'),
  usersPaging: {
    list: [],
    total: 0,
  },
};

export const addNewTag = createAsyncThunk('tags/addNewTag', async (params, thunkAPI) => {
  try {
    await tagsService.addNewTag(params);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'tags',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const { actions, reducer } = slice;

export const { actLogout } = actions;

export default reducer;
