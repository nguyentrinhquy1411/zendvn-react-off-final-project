// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mappingCategoryData, mappingTagsData } from '../helpers';
import categoryService from '../services/categoryService';

const initialState = {
  list: [],
  selectedCategory: {},
  adminList: {
    list: [],
    total: 0,
  },
};

export const fetchAdminCategories = createAsyncThunk('category/fetchAdminCategories', async (params = {}, thunkAPI) => {
  try {
    const res = await categoryService.getAll(params);
    const list = res.data.map(mappingCategoryData);
    const total = parseInt(res.headers['x-wp-total']);

    return { list, total };
  } catch (err) {}
});

export const fetchCategoryById = createAsyncThunk('category/fetchCategoryById', async (params = {}, thunkAPI) => {
  try {
    const res = await categoryService.getById(params);
    // const list = res.data.map(mappingCategoryData);
    // const total = parseInt(res.headers['x-wp-total']);
    return res.data;
  } catch (err) {}
});

export const fetchCategories = createAsyncThunk('category/fetchCategories', async (params = {}, thunkAPI) => {
  try {
    const res = await categoryService.getAll(params);
    const data = res.data.map(mappingCategoryData);

    return data;
  } catch (err) {}
});

export const fetchAddCategory = createAsyncThunk('category/fetchAddCategory', async (data, thunkAPI) => {
  try {
    await categoryService.postCategory(data);

    return { status: true };
  } catch (err) {}
});

export const fetchEditCategory = createAsyncThunk('category/fetchEditCategory', async (data, thunkAPI) => {
  try {
    await categoryService.updateCategory(data);

    return { status: true };
  } catch (err) {}
});

export const fetchDeleteCategory = createAsyncThunk('category/fetchDeleteCategory', async (id, thunkAPI) => {
  try {
    await categoryService.deleteCategory(id);

    return { status: true };
  } catch (err) {}
});

const slice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    actSaveCategoryInfo(state, action) {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchAdminCategories.fulfilled, (state, action) => {
      state.adminList = action.payload;
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.selectedCategory = action.payload;
    });
  },
});

const { actions, reducer } = slice;

export const { actSaveCategoryInfo } = actions;

export default reducer;
