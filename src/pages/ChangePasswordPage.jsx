import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChangePassword, fetchCurrentUser } from '../store/authSlice';
import './LoginPage/login.css';
import { useNavigate } from 'react-router-dom';

function ChangePasswordPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showMessage, setShowMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((res) => {
      if (!res.payload) {
        console.log(res);
        navigate('/'); // Redirect if already authenticated
      }
    });
  }, [dispatch]);

  function mappingData(item) {
    return {
      password: item.oldPassword,
      new_password: item.newPassword,
      confirm_new_password: item.confirmPassword,
    };
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Cập nhật giá trị tương ứng với tên của input
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await dispatch(fetchChangePassword(mappingData(formData)));
    console.log(res);

    if (res.payload.status) {
      // success
      console.log('123');

      // setShowMessage(<Alert severity="success">Cập nhật thành công.</Alert>);
    } else {
      // failed
      // setShowMessage(<Alert severity="error">Cập nhật thất bại</Alert>);
    }
  }

  return (
    <main className="login">
      <div className="spacing" />
      <div className="tcl-container">
        <div className="tcl-row">
          <div className="tcl-col-12 tcl-col-sm-6 block-center">
            <div className="form-login-register">
              <h1 className="form-title">Change Password</h1>
              {showMessage}
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label>Old Password</label>
                  <input type="text" value={formData.oldPassword} onChange={handleChange} required name="oldPassword" />
                </div>
                <div className="form-control">
                  <label>New Password</label>
                  <input type="text" value={formData.newPassword} onChange={handleChange} required name="newPassword" />
                </div>
                <div className="form-control">
                  <label>Confirm Password</label>
                  <input
                    type="text"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    name="confirmPassword"
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-primary btn-size-large">Thay đổi</button>
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

export default ChangePasswordPage;
