import { Switch, Tooltip } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { successNotification } from '../../helpers/notificantion';
import { actLogout } from '../../store/authSlice';
import { actUpdateLang } from '../../store/postSlice';

function HeaderMenus() {
  const data = useSelector((state) => state.MENU.menu);
  const token = useSelector((state) => state.AUTH.token);
  const user = useSelector((state) => state.AUTH.currentUser);
  const [language, setLanguage] = useState('vi'); // Default language is Vietnamese
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  function renderMenus(items) {
    return items.map((item) => {
      return (
        <li key={item.id}>
          <a href="/">{item.title}</a>
          {item.childItems && <ul>{renderMenus(item.childItems)}</ul>}
        </li>
      );
    });
  }

  function handleLogOut(e) {
    // dispatch action logout
    dispatch(actLogout());
    navigate('/');
    successNotification('Đăng xuất thành công!');
  }

  const handleChange = (checked) => {
    const newLanguage = checked ? 'vi' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Dynamically change language
    dispatch(actUpdateLang(newLanguage));
  };

  const styles = {
    switch: {
      backgroundColor: '#5A67D8', // Optional: Customize the switch color
    },
  };

  return (
    <div className="tcl-col-6">
      <div className="header-nav">
        <ul className="header-nav__lists">{renderMenus(data)}</ul>
        <ul className="header-nav__lists">
          {token && (
            <li>
              <a href="#">
                <i className="icons ion-person" /> {user?.nickname}
              </a>
              <ul>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/password">Change Pass</Link>
                </li>
                <li>
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="#" onClick={handleLogOut}>
                    {t('logout')}
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {!token && (
            <li>
              <Link to="/login">
                <i className="icons ion-person" /> {t('account')}
              </Link>
            </li>
          )}
        </ul>

        {/* Conditionally render the VIE/ENG switch if URL is '/' */}
        {location.pathname === '/' && (
          <Tooltip title={language === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}>
            <Switch
              checked={language === 'vi'}
              onChange={handleChange}
              checkedChildren="VIE" // Text for Vietnamese
              unCheckedChildren="ENG" // Text for English
              style={styles.switch}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default HeaderMenus;
