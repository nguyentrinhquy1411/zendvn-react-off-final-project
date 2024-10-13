import API from './api';

const menuService = {
  getMenu() {
    return API.call().get('menus/v1/menus/main-menu-vi');
  },
};

export default menuService;
