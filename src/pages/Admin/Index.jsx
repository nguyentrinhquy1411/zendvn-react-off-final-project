import React, { useState } from 'react';
import { BookOutlined, EditOutlined, PushpinOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, ConfigProvider, theme, Dropdown, Button } from 'antd'; // Correct import for 'theme'
import { Link, Outlet, useLocation } from 'react-router-dom';
import './index.css';
import logo from './assets/logo.png'; // Import your logo

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
  getItem(<Link to="/admin/dashboard">Dashboard</Link>, '/admin/dashboard'),
  getItem(<Link to="/admin/category">Category</Link>, '/admin/category', <PushpinOutlined />, [
    getItem(<Link to="/admin/category/">Categories</Link>, '/admin/category/all'),
    getItem(<Link to="/admin/category/create">Add new categories</Link>, '/admin/category/create'),
  ]),
  getItem(<Link to="/admin/profile">Profile</Link>, '/admin/profile', <UserOutlined />, [
    getItem(<Link to="/admin/profile/all">All users</Link>, '/admin/profile/all'),
    getItem(<Link to="/admin/profile/create">Add new user</Link>, '/admin/profile/create'),
    getItem(<Link to="/admin/profile/me">Your profile</Link>, '/admin/profile/me'),
  ]),
  getItem(<Link to="/admin/posts">Posts</Link>, '/admin/posts', <BookOutlined />, [
    getItem(<Link to="/admin/posts/all">All posts</Link>, '/admin/posts/all'),
    getItem(<Link to="/admin/posts/create">Add new post</Link>, '/admin/posts/create'),
  ]),
];

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken(); // Use the theme object

  // Dropdown menu items
  const dropdownItems = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/admin/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/admin/profile/me">Edit Profile</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/admin/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item key="4" danger>
        Logout
      </Menu.Item>
    </Menu>
  );

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
