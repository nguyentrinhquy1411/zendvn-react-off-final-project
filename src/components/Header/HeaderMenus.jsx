import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { actLogout } from '../../store/authSlice';

function HeaderMenus() {
  const data = useSelector((state) => state.MENU.menu);
  const token = useSelector((state) => state.AUTH.token);
  const user = useSelector((state) => state.AUTH.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  }

  return (
    <div className="tcl-col-6">
      {/* Nav */}
      <div className="header-nav">
        <ul className="header-nav__lists">
          {renderMenus(data)}

          {/* <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/">Our Team</a>
            <ul>
              <li>
                <a href="/">Our Team 1</a>
              </li>
              <li>
                <a href="/">Our Team 2</a>
              </li>
              <li>
                <a href="/">Our Team 3</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/">Contact</a>
            <ul>
              <li>
                <a href="/">Contact 1</a>
              </li>
              <li>
                <a href="/">Contact 2</a>
              </li>
              <li>
                <a href="/">Contact 3</a>
                <ul>
                  <li>
                    <a href="/">Contact 11</a>
                  </li>
                  <li>
                    <a href="/">Contact 12</a>
                  </li>
                  <li>
                    <a href="/">Contact 13</a>
                  </li>
                </ul>
              </li>
            </ul>
          </li> */}
        </ul>
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
                    Đăng xuất
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {!token && (
            <li>
              <Link to="/login">
                <i className="icons ion-person" /> Tài khoản
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default HeaderMenus;
