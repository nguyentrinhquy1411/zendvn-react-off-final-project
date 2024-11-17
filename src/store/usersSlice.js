// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import usersService from '../services/usersService';
import { mappingUsersData } from '../helpers';

const initialState = {
  token: localStorage.getItem('ACCESS_TOKEN'),
  usersPaging: {
    list: [],
    total: 0,
  },
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params, thunkAPI) => {
  try {
    const res = await usersService.getUsers();

    console.log(res);

    const data = res.data.map(mappingUsersData);
    return data;
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.usersPaging.list = action.payload;
    });
  },
});

const { actions, reducer } = slice;

export const { actLogout } = actions;

export default reducer;
