// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mappingMenuData } from '../helpers';
import menuService from '../services/menuService';

const initialState = {
  menu: [],
};

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (params, thunkAPI) => {
  try {
    const res = await menuService.getMenu();

    const data = res.data.items;

    const menus = data.map(mappingMenuData);
    return menus;
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'menu',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.menu = action.payload;
    });
  },
});

const { actions, reducer } = slice;

export const {} = actions;

export default reducer;
