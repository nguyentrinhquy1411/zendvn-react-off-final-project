import { BookOutlined, PushpinOutlined, UserOutlined } from '@ant-design/icons';
import { ConfigProvider, Dropdown, Layout, Menu, theme } from 'antd'; // Correct import for 'theme'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../../store/authSlice';
import logo from './assets/logo.png'; // Import your logo
import './index.css';
import { infoNotification } from '../../helpers/notificantion';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link>Category</Link>, '/admin/category', <PushpinOutlined />, [
    getItem(<Link to="/admin/category/">Categories</Link>, '/admin/category/'),
    getItem(<Link to="/admin/category/create">Add new categories</Link>, '/admin/category/create'),
  ]),
  getItem(<Link>Profile</Link>, '/admin/profile', <UserOutlined />, [
    getItem(<Link to="/admin/profile/">All users</Link>, '/admin/profile/'),
    getItem(<Link to="/admin/profile/create">Add new user</Link>, '/admin/profile/create'),
    // getItem(<Link to="/admin/profile/me">Your profile</Link>, '/admin/profile/me'),
  ]),
  getItem(<Link>Posts</Link>, '/admin/posts', <BookOutlined />, [
    getItem(<Link to="/admin/posts/">All posts</Link>, '/admin/posts/'),
    getItem(<Link to="/admin/posts/create">Add new post</Link>, '/admin/posts/create'),
  ]),
];

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken(); // Use the theme object
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dropdown menu items
  const dropdownItems = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/admin/profile/me">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((res) => {
      console.log(res);

      if (res.payload?.status !== true) {
        navigate('/error'); // Redirect if already authenticated
      } else {
        infoNotification('Xin chào bạn đã quay trở lại!!');
      }
    });
  }, [dispatch]); // Add dependencies

  return (
    <ConfigProvider
      theme={{
        token: {
          itemColor: '#ffffff',
        },
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline" items={items} />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              background: colorBgContainer,
              justifyContent: 'space-between',
            }}
          >
            {/* Logo in the header */}
            <Link to="/">
              <img src={logo} alt="Logo" className="header-logo" />
            </Link>
            {/* User Icon and Dropdown */}
            <Dropdown overlay={dropdownItems} trigger={['click']}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <UserOutlined style={{ fontSize: '20px', color: '#000', marginRight: '20px' }} />
                {/* Adjusted icon size */}
              </div>
            </Dropdown>
          </Header>

          <Content
            style={{
              margin: '16px',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
