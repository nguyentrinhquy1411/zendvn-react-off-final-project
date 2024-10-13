import API from './api';

const commentService = {
  getComments(params = {}) {
    return API.call().get(`wp/v2/comments`, {
      params: {
        per_page: 5,
        page: params.currentPage,
        post: params.articleId,
        parent: 0,
        order: 'asc',
      },
    });
  },
  getChildComments(params = {}) {
    return API.call().get(`wp/v2/comments`, {
      params: {
        per_page: params.perPage,
        page: params.currentPage,
        post: params.articleId,
        parent: params.parent,
        order: 'asc',
      },
    });
  },
  putNewComment(data) {
    return API.callWithToken().post(`wp/v2/comments`, data);
  },
};

export default commentService;
