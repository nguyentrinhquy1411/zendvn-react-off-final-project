import API from './api';

const categoryService = {
  getAll(inputParams = {}) {
    return API.call().get('wp/v2/categories', {
      params: {
        per_page: 100,
        page: 1,
        lang: inputParams.lang,
        ...inputParams,
      },
    });
  },
  getCategoryIdBySlug(params = {}) {
    return API.call().get(`wp/v2/categories?slug=${params.slug}&lang=${params.lang}`);
  },
  postCategory(data) {
    return (
      API.callWithToken().post('wp/v2/categories', data),
      {
        lang: 'vi',
      }
    );
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
  getById(params = {}) {
    return API.call().get(`wp/v2/categories/${params.id}`);
  },
};

export default categoryService;
