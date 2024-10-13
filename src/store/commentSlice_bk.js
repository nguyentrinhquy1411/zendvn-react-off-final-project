import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import commentService from '../services/commentService';
import { mappingCommentData } from '../helpers';

const initialState = {
  postComments: {
    list: [],
    totalpages: 0,
    currentPage: 1,
    commentRemain: 0,
  },
  commentChildData: {
    list: [],
    totalpages: 0,
    currentPage: 0,
    commentRemain: 0,
  },
  newComment: null,
};

// const dataChildComment = {
//   79: {
//     list: [],
//     totalpages: 0,
//     currentPage: 0,
//     commentRemain: 0
//   },
//   56: {
//     list: [],
//     totalpages: 0,
//     currentPage: 0,
//     commentRemain: 0
//   }
// }

export const fetchNewComment = createAsyncThunk('detail/fetchNewComment', async (data, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await commentService.putNewComment(data);
    console.log(res);

    return { status: true, data };
  } catch (err) {
    console.log(err);
    rejectWithValue({ status: false });
  }
});

export const fetchNewChildComment = createAsyncThunk('detail/fetchNewChildComment', async (data, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await commentService.putNewComment(data);
    console.log(res);

    return { status: true, data };
  } catch (err) {
    console.log(err);
    rejectWithValue({ status: false });
  }
});

export const fetchComments = createAsyncThunk('detail/fetchComments', async (params = {}, thunkAPI) => {
  try {
    const res = await commentService.getComments(params);
    const totalpages = parseInt(res.headers['x-wp-totalpages']);
    const total = parseInt(res.headers['x-wp-total']);
    const commentRemain = total - params.currentPage * 5;

    const data = res.data.map(mappingCommentData);

    return { list: data, totalpages, commentRemain, currentPage: params.currentPage };
  } catch (err) {
    console.log(err);
  }
});

export const fetchChildComments = createAsyncThunk('detail/fetchChildComments', async (params = {}, thunkAPI) => {
  try {
    const res = await commentService.getChildComments(params);
    const totalpages = parseInt(res.headers['x-wp-totalpages']);
    const total = parseInt(res.headers['x-wp-total']);
    const commentRemain = total - params.currentPage * 2;

    console.log('res', res);

    const childComments = res.data.map(mappingCommentData);

    console.log('childComments', childComments);

    return { list: childComments, totalpages, currentPage: params.currentPage, commentRemain };
  } catch (err) {
    console.log(err);
  }
});

const slice = createSlice({
  name: 'comment',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        const payload = action.payload;
        const { list, currentPage } = payload;
        state.postComments = {
          ...state.postComments,
          ...payload,
          list: currentPage === 1 ? list : [...state.postComments.list, ...list],
        };
      })
      .addCase(fetchChildComments.fulfilled, (state, action) => {
        const payload = action.payload;
        const { list, currentPage } = payload;
        state.commentChildData = {
          ...state.commentChildData,
          ...payload,
          list: currentPage === 1 ? list : state.commentChildData.list.concat(action.payload.list),
        };
      })
      .addCase(fetchNewComment.fulfilled, (state, action) => {
        console.log(action.payload);

        state.newComment = action.payload.data;
        state.postComments.list.unshift(action.payload.data);
      })
      .addCase(fetchNewChildComment.fulfilled, (state, action) => {
        state.newComment = action.payload.data;
        state.commentChildData.list.unshift(action.payload.data);
        console.log(state.commentChildData.list);
      });
  },
});

const { actions, reducer } = slice;

export const {} = actions;

export default reducer;
