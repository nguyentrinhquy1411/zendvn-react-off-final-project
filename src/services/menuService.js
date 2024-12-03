import API from './api';

const menuService = {
  getMenu(params) {
    return API.call().get(`menus/v1/menus/main-menu-${params.lang}`);
  },
};

export default menuService;
