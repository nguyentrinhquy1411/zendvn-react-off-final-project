// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import usersService from '../services/usersService';
import { mappingTagsData, mappingUsersData } from '../helpers';
import tagsService from '../services/tagsService';

const initialState = {
  token: localStorage.getItem('ACCESS_TOKEN'),
  usersPaging: {
    list: [],
    total: 0,
  },
  tags: [],
};

export const addNewTag = createAsyncThunk('tags/addNewTag', async (params, thunkAPI) => {
  try {
    await tagsService.addNewTag(params);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

export const fetchTags = createAsyncThunk('category/fetchTags', async (params, thunkAPI) => {
  try {
    const res = await tagsService.getTags();

    const data = res.data.map(mappingTagsData);

    return data;
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'tags',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags = action.payload;
    });
  },
});

const { actions, reducer } = slice;

export const { actLogout } = actions;

export default reducer;
