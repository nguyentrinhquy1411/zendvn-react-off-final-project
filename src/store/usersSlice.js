// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import usersService from '../services/usersService';
import { mappingUsersData } from '../helpers';
import authService from '../services/authService';

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

export const deletetUser = createAsyncThunk('users/deletetUser', async (id, thunkAPI) => {
  try {
    await usersService.deleteUser(id);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

export const addUser = createAsyncThunk('profile/addUser', async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    console.log(data);

    if (data.dataFile) {
      const resMedia = await authService.uploadMeida(data.dataFile);
      data.simple_local_avatar = { media_id: resMedia.data.id };
    }

    await usersService.addUser(data);

    return { status: true };
  } catch (err) {
    console.log(err);
    return rejectWithValue({ status: false });
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
