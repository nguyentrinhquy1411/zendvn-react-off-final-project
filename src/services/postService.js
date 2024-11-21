import API from './api';

const postService = {
  getAll(inputParams = {}) {
    return API.call().get('wp/v2/posts', {
      params: {
        per_page: 3,
        page: 1,
        lang: 'vi',
        ...inputParams,
      },
    });
  },
  getGeneral(params = {}) {
    return this.getAll({ per_page: 2, page: params.currentPage });
  },
  getLatest() {
    return this.getAll();
  },
  getSearch(params = {}) {
    return this.getAll({ per_page: 1, page: params.currentPage, search: params.queryStr });
  },
  getPopular() {
    return this.getAll({ orderby: 'post_views' });
  },
  getByCategory(params = {}) {
    return this.getAll({ categories: params.categoryId, per_page: 2, page: params.currentPage });
  },
  getByAuthor(params = {}) {
    return this.getAll({ author: params.authorId, exclude: params.articleId });
  },
  getAllPosts(param = {}) {
    return API.call().get('wp/v2/posts?lang=vi');
  },
  postPosts(data) {
    return API.callWithToken().post('wp/v2/posts', { ...data, lang: 'vi' });
  },
  updatePost(data) {
    return API.callWithToken().put(`wp/v2/posts/${data.id}`, data);
  },
  getById(params = {}) {
    return API.call().get(`/wp/v2/posts/${params.id}`);
  },
  deletePost(id) {
    return API.callWithToken().delete(`wp/v2/posts/${id}`, {
      params: { force: true },
    });
  },
};

export default postService;
