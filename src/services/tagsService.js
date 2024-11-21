import API from './api';

const tagsService = {
  addNewTag(data) {
    return API.callWithToken().post('wp/v2/tags', data);
  },
  getTags(param = {}) {
    return API.callWithToken().get('wp/v2/tags', {
      params: {
        per_page: 1000,
        // lang: 'vi',
      },
    });
  },
};

export default tagsService;
