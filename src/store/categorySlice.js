// 2. xu ly viết logic để thông tin tất cả category
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mappingCategoryData, mappingTagsData } from '../helpers';
import categoryService from '../services/categoryService';

const initialState = {
  list: [],
  selectedCategory: {},
  tags: [],
};

export const fetchCategories = createAsyncThunk('category/fetchCategories', async (params, thunkAPI) => {
  try {
    const res = await categoryService.getAll();
    console.log('category', res);
    const data = res.data.map(mappingCategoryData);

    return data;
  } catch (err) {
    console.log(err);
  }
});
export const fetchTags = createAsyncThunk('category/fetchTags', async (params, thunkAPI) => {
  try {
    const res = await categoryService.getTags();
    console.log('tags', res);

    const data = res.data.map(mappingTagsData);

    return data;
  } catch (err) {
    console.log(err);
  }
});

export const fetchAddCategory = createAsyncThunk('category/fetchAddCategory', async (data, thunkAPI) => {
  try {
    await categoryService.postCategory(data);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

export const fetchEditCategory = createAsyncThunk('category/fetchEditCategory', async (data, thunkAPI) => {
  try {
    await categoryService.updateCategory(data);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

export const fetchDeleteCategory = createAsyncThunk('category/fetchDeleteCategory', async (id, thunkAPI) => {
  try {
    await categoryService.deleteCategory(id);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    actSaveCategoryInfo(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags = action.payload;
    });
  },
});

const { actions, reducer } = slice;

export const { actSaveCategoryInfo } = actions;

export default reducer;
