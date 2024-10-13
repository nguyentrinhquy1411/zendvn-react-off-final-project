import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import { fetchCurrentUser, fetchRegister } from '../store/authSlice';
import './LoginPage/login.css';

function RegisterPage() {
  const initialFormData = {
    username: '',
    password: '',
    nickname: '',
    email: '',
  };
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: '',
  });
  const [isRegis, setIsRegis] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((res) => {
      if (res.payload.status) {
        navigate('/'); // Redirect if already authenticated
      }
    });
  }, [dispatch]); // Add dependencies

  const handleChange = (event) => {
    const { name, value } = event.target; // Lấy tên và giá trị của input
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Cập nhật giá trị tương ứng với tên của input
    }));
  };

  async function handleSubmit(e) {
    console.log(formData);
    e.preventDefault();
    const res = await dispatch(fetchRegister(formData));
    if (res.payload.status) {
      // success
      navigate('/');
    } else {
      // failed
      setFormData(initialFormData);
    }
  }

  return (
    <main className="login">
      <div className="spacing" />
      <div className="tcl-container">
        <div className="tcl-row">
          <div className="tcl-col-12 tcl-col-sm-6 block-center">
            <h1 className="form-title text-center">Đăng ký</h1>
            <div className="form-login-register">
              {/* {!isRegis && <Alert severity="error">{error}</Alert>} */}
              <form autoComplete="off">
                <Input
                  type="email"
                  label="Email"
                  placeholder="Nhập email ..."
                  autoComplete="new-password"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Tên đăng nhập"
                  placeholder="Nhập tên đăng nhập ..."
                  autoComplete="off"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Input
                  type="password"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn ..."
                  autoComplete="new-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Input
                  label="Nickname"
                  placeholder="Nhập Nickname"
                  autoComplete="off"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                />

                <div className="d-flex tcl-jc-between tcl-ais-center">
                  <Button type="primary" size="large" onClick={handleSubmit}>
                    Đăng ký
                  </Button>
                  <Link to="/login">Bạn đã có tài khoản?</Link>
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

export default RegisterPage;
