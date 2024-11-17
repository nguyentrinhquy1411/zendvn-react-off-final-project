import API from './api';

const usersService = {
  getUsers(inputParams = {}) {
    return API.callWithToken().get('wp/v2/users', {
      params: {
        per_page: 100,
        page: 1,
        lang: 'vi',
        ...inputParams,
      },
    });
  },
};

export default usersService;
