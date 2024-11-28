// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mappingProfileData } from '../helpers';
import authService from '../services/authService';

const initialState = {
  token: localStorage.getItem('ACCESS_TOKEN'),
  isAuth: '',
  currentUser: null,
  mediaId: null,
};

export const fetchUpdateCurrentUser = createAsyncThunk('profile/fetchUpdateCurrentUser', async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    if (data.dataFile) {
      const resMedia = await authService.uploadMeida(data.dataFile);
      data.simple_local_avatar = { media_id: resMedia.data.id };
    }

    const res = await authService.updateInfo(data);
    const profile = mappingProfileData(res.data);

    return { data: profile, status: true };
  } catch (err) {
    return rejectWithValue({ status: false });
  }
});

export const fetchChangePassword = createAsyncThunk('profile/fetchChangePassword', async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    await authService.changePassword(data);
    return { status: true };
  } catch (err) {
    return rejectWithValue({ status: false });
  }
});

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const res = await authService.postLogin(params);
    const token = res.data.token;

    // dispatch(fetchCurrentUser(token));

    return { status: true, token };
  } catch (err) {
    return rejectWithValue({ status: false });
  }
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    await authService.postRegister(params);

    const { username, password } = params;

    dispatch(fetchLogin({ username, password }));

    return { status: true };
  } catch (err) {
    const errors = err.response.data;
    return rejectWithValue({ status: false, errors });
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (token, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await authService.getInfo(token);
    console.log(res);

    const data = mappingProfileData(res.data);
    return { data, status: true };
  } catch (err) {
    return rejectWithValue({ status: false, errors });
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    actLogout(state, action) {
      localStorage.removeItem('ACCESS_TOKEN');
      state.token = null;
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.fulfilled, (state, action) => {
        const token = action.payload.token;
        state.token = token;
        localStorage.setItem('ACCESS_TOKEN', token);
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        const token = action.payload.token;
        state.token = token;
        localStorage.setItem('ACCESS_TOKEN', token);
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      })
      .addCase(fetchUpdateCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      });
  },
});

const { actions, reducer } = slice;

export const { actLogout } = actions;

export default reducer;
