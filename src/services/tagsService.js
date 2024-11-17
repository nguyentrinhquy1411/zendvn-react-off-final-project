import API from './api';

const tagsService = {
  addNewTag(data) {
    return API.call().post('wp/v2/tags', data);
  },
};

export default tagsService;
