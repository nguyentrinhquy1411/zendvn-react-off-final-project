// import { Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import './LoginPage/login.css';
import { fetchCurrentUser, fetchUpdateCurrentUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

function ProfilePage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    lastName: '',
    firstName: '',
    description: '',
    avatar: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [showMessage, setShowMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentProfile = useSelector((state) => state.AUTH.currentUser);

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((res) => {
      if (!res.payload) {
        console.log(res);
        navigate('/'); // Redirect if already authenticated
      }
    });
  }, [dispatch]);

  // Populate formData when currentProfile is updated
  useEffect(() => {
    if (currentProfile) {
      setFormData({
        nickname: currentProfile.nickname || '',
        lastName: currentProfile.last_name || '',
        firstName: currentProfile.first_name || '',
        description: currentProfile.description || '',
        avatar: currentProfile.file || '',
      });
      setAvatar(currentProfile.file || '');
    }
  }, [currentProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Cập nhật giá trị tương ứng với tên của input
    }));
  };

  function mappingData(item) {
    return {
      first_name: item.first_name,
      last_name: item.last_name,
      nickname: item.nickname,
      description: item.description,
      file: item.file,
    };
  }

  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    console.log(formData);

    if (formData.file) {
      const dataFile = new FormData();
      dataFile.append('file', formData.file); // Attach the file if present
      formData.dataFile = dataFile;
    }

    const res = await dispatch(fetchUpdateCurrentUser(formData));
    setIsLoading(false);

    if (res.payload.status) {
      // success
      console.log('123');

      // setShowMessage(<Alert severity="success">Cập nhật thành công.</Alert>);
    } else {
      // failed
      // setShowMessage(<Alert severity="error">Cập nhật thất bại</Alert>);
    }
  }

  if (!currentProfile) return <></>;

  function handleChangeImage(e) {
    console.log(e.target.files);

    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0], // Cập nhật giá trị tương ứng với tên của input
    }));
    setAvatar(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <main className="login">
      <div className="spacing" />
      <div className="tcl-container">
        <div className="tcl-row">
          <div className="tcl-col-12 tcl-col-sm-6 block-center">
            <h1 className="form-title text-center">Thông tin tài khoản</h1>
            <div className="form-login-register">
              {showMessage}
              <form autoComplete="off" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="avatar">Avatar</label>
                  <img src={avatar} alt="" />
                  <input type="file" name="file" id="avatar" onChange={handleChangeImage} />
                </div>
                <Input
                  type="email"
                  label="Email"
                  autoComplete="new-password"
                  value={currentProfile.email || ''} // Email is read-only
                  readOnly
                />
                <Input
                  type="text"
                  label="Nickname"
                  autoComplete="off"
                  name="nickname" // Add name for the input to work with handleChange
                  value={formData.nickname}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  label="Last Name"
                  autoComplete="new-password"
                  name="lastName" // Add name
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  label="First Name"
                  autoComplete="off"
                  name="firstName" // Add name
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  label="Description"
                  autoComplete="off"
                  name="description" // Add name
                  value={formData.description}
                  onChange={handleChange}
                />
                <div className="text-center">
                  <Button type="primary" size="large" htmlType="submit" loading={isLoading} disabled={isLoading}>
                    Thay đổi
                  </Button>
                  {/* <button className="btn btn-primary btn-size-large">Thay đổi</button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="spacing" />
    </main>
  );
}

export default ProfilePage;
