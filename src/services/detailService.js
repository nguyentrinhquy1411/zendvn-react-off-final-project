import API from './api';

const detailService = {
  getDetail(params) {
    return API.call().get(`wp/v2/posts?slug=${params.slug}`);
  },
};

export default detailService;
