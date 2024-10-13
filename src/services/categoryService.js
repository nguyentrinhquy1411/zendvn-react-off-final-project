import API from './api';

const categoryService = {
  getAll() {
    return API.call().get('wp/v2/categories?per_page=100&page=1&lang=vi');
  },
  getCategoryIdBySlug(params = {}) {
    return API.call().get(`wp/v2/categories?slug=${params.slug}&lang=vi`);
  },
  postCategory(data) {
    return API.callWithToken().post('wp/v2/categories', data);
  },
  updateCategory(data) {
    console.log('id', data.id);

    return API.callWithToken().put(`wp/v2/categories/${data.id}`, data);
  },
  deleteCategory(id) {
    return API.callWithToken().delete(`wp/v2/categories/${id}`, {
      params: { force: true },
    });
  },
  getTags(param = {}) {
    return API.callWithToken().get('wp/v2/tags');
  },
};

export default categoryService;
