import './assets/css/bootstrap-tcl.css';
import './assets/css/main.css';
import { Provider } from 'react-redux';
import store from './store/index.js';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './lang/i18n.js'; // Import the i18n configuration

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
