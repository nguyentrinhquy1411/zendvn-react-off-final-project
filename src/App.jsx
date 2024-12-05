import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './pages/Admin/Index';
import AdminCategoryList from './pages/Admin/Category/Index';
import AdminCategoryCreate from './pages/Admin/Category/Create';
import AdminCategoryEdit from './pages/Admin/Category/Edit';
import EditUser from './pages/Admin/Profile/EditProfile';
import AddUser from './pages/Admin/Profile/AddUser';
import AdminDashboard from './pages/Admin/Dashboard';
import UsersList from './pages/Admin/Profile/UsersList';
import YourProfile from './pages/Admin/Profile/YourProfile';
import AdminPostList from './pages/Admin/Posts/Index';
import AdminAddNewPost from './pages/Admin/Posts/Create';
import AdminEditPost from './pages/Admin/Posts/Edit';
import CategoryPage from './pages/CategoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/ErrorPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import { fetchCurrentUser } from './store/authSlice';
import { fetchCategories } from './store/categorySlice';
import { fetchMenu } from './store/menuSlice';

function App() {
  // kích hoạt action
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.POST.lang);

  useEffect(() => {
    dispatch(fetchCategories({ lang }));
    dispatch(fetchMenu({ lang }));
    dispatch(fetchCurrentUser());
  }, [lang]);
  let location = useLocation();

  const isGuestLayout = !location.pathname.includes('admin');

  return (
    <>
      <div className="wrapper-content">
        {isGuestLayout && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/password" element={<ChangePasswordPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />}></Route>
            <Route path="category" element={<AdminCategoryList />} />
            <Route path="category/create" element={<AdminCategoryCreate />} />
            <Route path="category/:id/edit" element={<AdminCategoryEdit />} />
            <Route path="profile" element={<UsersList />} />
            <Route path="profile/create" element={<AddUser />} />
            <Route path="profile/:id/edit" element={<EditUser />} />
            <Route path="profile/me" element={<YourProfile />} />
            <Route path="posts/" element={<AdminPostList />} />
            <Route path="posts/create" element={<AdminAddNewPost />} />
            <Route path="posts/:id/edit" element={<AdminEditPost />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {isGuestLayout && (
          <>
            <div className="spacing" />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}

export default App;
