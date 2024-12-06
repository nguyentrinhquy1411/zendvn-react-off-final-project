import axios from 'axios';

const API = {
  call() {
    return axios.create({
      baseURL: 'https://wp-api.codethanhthuongthua.asia/wp-json/',
    });
  },
  callWithToken: function (token) {
    if (!token) token = localStorage.getItem('ACCESS_TOKEN');

    return axios.create({
      baseURL: 'https://wp-api.codethanhthuongthua.asia/wp-json/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default API;
