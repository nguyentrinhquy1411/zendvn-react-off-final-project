import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mappingPostData } from '../helpers/index.js';
import categoryService from '../services/categoryService.js';
import detailService from '../services/detailService.js';
import postService from '../services/postService.js';

const initialState = {
  postLatest: [],
  postPopular: [],
  postGeneral: {
    list: [],
    totalpages: 0,
    currentPage: 1,
  },
  postSearch: {
    list: [],
    totalpages: 0,
    total: 0,
    currentPage: 1,
  },
  postPaging: {
    list: [],
    totalpages: 0,
    total: 0,
    currentPage: 1,
  },
  postsByCategory: {
    list: [],
    totalpages: 0,
    total: 0,
    currentPage: 1,
  },

  postRelated: [],
  postDetail: null,
  allPosts: [],
  postSelected: {},
};

export const fetchLatest = createAsyncThunk('post/fetchLatest', async (params, thunkAPI) => {
  try {
    const res = await postService.getLatest();

    // mapping: đặt lại tên, lọc lấy những field thực sự cần
    const data = res.data.map(mappingPostData);

    return data;
  } catch (err) {
    console.log(err);
  }
});

export const fetchGeneral = createAsyncThunk('post/fetchGeneral', async (params = {}, thunkAPI) => {
  try {
    const { currentPage } = params;

    const res = await postService.getGeneral(params);
    const totalpages = parseInt(res.headers['x-wp-totalpages']);

    const data = res.data.map(mappingPostData);

    return {
      list: data,
      totalpages,
      currentPage,
    };
  } catch (err) {
    console.log(err);
  }
});

export const fetchSearch = createAsyncThunk('post/fetchSearch', async (params, thunkAPI) => {
  try {
    const { currentPage } = params;
    const res = await postService.getSearch(params);
    const totalpages = parseInt(res.headers['x-wp-totalpages']);
    const total = parseInt(res.headers['x-wp-total']);

    // mapping: đặt lại tên, lọc lấy những field thực sự cần
    const data = res.data.map(mappingPostData);
    console.log(data);

    return {
      list: data,
      totalpages,
      total,
      currentPage,
    };
  } catch (err) {
    console.log(err);
  }
});

export const fetchPaging = createAsyncThunk('post/fetchPaging', async (params = {}, thunkAPI) => {
  try {
    const { page } = params;
    console.log('page', page);

    const res = await postService.getAll(params);
    console.log(res);

    const total = parseInt(res.headers['x-wp-total']);
    const totalPages = parseInt(res.headers['x-wp-totalpages']);

    console.log('totalPages', totalPages);

    const data = res.data.map(mappingPostData);

    return {
      totalpages: totalPages,
      list: data,
      total,
      currentPage: page,
    };
  } catch (err) {
    console.log(err);
  }
});
export const fetchAdminPaging = createAsyncThunk('post/fetchAdminPaging', async (params = {}, thunkAPI) => {
  try {
    const { page } = params;

    const res = await postService.getAll(params);
    console.log(res);

    const total = parseInt(res.headers['x-wp-total']);

    const data = res.data.map(mappingPostData);

    return {
      list: data,
      total,
    };
  } catch (err) {
    console.log(err);
  }
});

export const fetchPopular = createAsyncThunk('post/fetchPopular', async (params, thunkAPI) => {
  try {
    const res = await postService.getPopular();

    const data = res.data.map(mappingPostData);

    return data;
  } catch (err) {
    console.log(err);
  }
});

export const fetchAuthorRelated = createAsyncThunk('post/fetchAuthorRelated', async (params = {}, thunkAPI) => {
  try {
    const res = await postService.getByAuthor(params);

    const data = res.data.map(mappingPostData);

    return data;
  } catch (err) {
    console.log(err);
  }
});

export const fetchByCategory = createAsyncThunk('post/fetchByCategory', async (params = {}, thunkAPI) => {
  try {
    const res = await categoryService.getCategoryIdBySlug(params);
    console.log('res', res);

    const categoryId = res.data[0].id;
    const { currentPage } = params;
    const res1 = await postService.getByCategory({ categoryId, currentPage });
    console.log('currentPage', currentPage);

    const totalpages = parseInt(res1.headers['x-wp-totalpages']);
    const total = parseInt(res1.headers['x-wp-total']);

    const data = res1.data.map(mappingPostData);

    return {
      list: data,
      total,
      totalpages,
      currentPage,
    };
  } catch (err) {
    console.log(err);
  }
});

export const fetchDetail = createAsyncThunk('detail/fetchDetail', async (params, thunkAPI) => {
  try {
    const res = await detailService.getDetail(params);

    const data = mappingPostData(res.data[0]);

    const { dispatch } = thunkAPI;

    dispatch(fetchAuthorRelated({ author: data.authorData.id, exclude: data.id }));

    return data;
  } catch (err) {
    console.log(err);
  }
});

export const fetchAll = createAsyncThunk('post/fetchAll', async (params, thunkAPI) => {
  try {
    const res = await postService.getAllPosts(params);
    const data = res.data.map(mappingPostData);

    return data;
  } catch (err) {
    console.log(err);
  }
});

export const fetchAddPost = createAsyncThunk('post/fetchAddPost', async (data, thunkAPI) => {
  try {
    await postService.postPosts(data);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

export const fetchEditPost = createAsyncThunk('category/fetchEditPost', async (data, thunkAPI) => {
  try {
    await postService.updatePost(data);

    return { status: true };
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    actUpdateQueryStr(state, action) {
      state.queryStr = action.payload;
    },
    actResetPostSearch(state, action) {
      state.postSearch.list = [];
    },
    actSavePostInfo(state, action) {
      state.postSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatest.fulfilled, (state, action) => {
        state.postLatest = action.payload;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.postPopular = action.payload;
      })
      .addCase(fetchByCategory.fulfilled, (state, action) => {
        const payload = action.payload;
        const { list, currentPage } = payload;
        state.postsByCategory = {
          ...state.postsByCategory,
          ...payload,
          list: currentPage === 1 ? list : [...state.postsByCategory.list, ...list],
        };
      })
      .addCase(fetchDetail.fulfilled, (state, action) => {
        state.postDetail = action.payload;
      })
      .addCase(fetchGeneral.fulfilled, (state, action) => {
        const payload = action.payload;
        const { list, currentPage } = payload;
        state.postGeneral = {
          ...state.postGeneral,
          ...payload,
          list: currentPage === 1 ? list : [...state.postGeneral.list, ...list],
        };
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        const payload = action.payload;
        const { list, currentPage } = payload;
        state.postSearch = {
          ...state.postSearch,
          ...payload,
          list: currentPage === 1 ? list : [...state.postSearch.list, ...list],
        };
      })
      .addCase(fetchPaging.fulfilled, (state, action) => {
        const payload = action.payload;
        const { list, currentPage } = payload;
        state.postPaging = {
          ...state.postPaging,
          ...payload,
          list: currentPage === 1 ? list : [...state.postPaging.list, ...list],
        };
      })
      .addCase(fetchAdminPaging.fulfilled, (state, action) => {
        state.postPaging = action.payload;
      })
      .addCase(fetchAuthorRelated.fulfilled, (state, action) => {
        state.postRelated = action.payload;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.allPosts = action.payload;
      });
  },
});

const { actions, reducer } = slice;

export const {
  actGetLastestPost,
  actGetPopulartPost,
  actUpdateQueryStr,
  actResetPostSearch,
  actResetPostComment,
  actSavePostInfo,
} = actions;

export default reducer;
