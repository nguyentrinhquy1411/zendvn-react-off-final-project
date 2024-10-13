import API from './api';

const authService = {
  postLogin(params = {}) {
    return API.call().post('jwt-auth/v1/token', params);
  },
  postRegister(params = {}) {
    return API.call().post('wp/v2/users/register', params);
  },
  postAuth(token) {
    return API.callWithToken(token).post('wp/v2/users/me');
  },
  getInfo(token) {
    return API.callWithToken(token).get('wp/v2/users/me');
  },
  updateInfo(data) {
    return API.callWithToken().put('wp/v2/users/me', data);
  },
  changePassword(data) {
    return API.callWithToken().put('wp/v2/users/password', data);
  },
  uploadMeida(data) {
    return API.callWithToken().post('wp/v2/media', data);
  },
};

export default authService;
