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

  deleteUser(id) {
    return API.callWithToken().delete(`wp/v2/users/${id}`, {
      params: { force: true },
    });
  },
  addUser(data) {
    return API.callWithToken().post('wp/v2/users/', { ...data, lang: 'vi' });
  },
  updateUser(data) {
    return API.callWithToken().put(`wp/v2/users/${data.id}`, data);
  },
  updateMyProFile(data) {
    return API.callWithToken().put(`wp/v2/users/me`, data);
  },
  getUserById(data) {
    return API.callWithToken().get(`wp/v2/users/${data}`);
  },
};

export default usersService;
