// import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { fetchCurrentUser, fetchLogin } from '../../store/authSlice';
import './login.css';

function LoginPage() {
  const initialFormData = {
    username: '',
    password: '',
  };
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((res) => {
      console.log(res);

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
    e.preventDefault();
    const res = await dispatch(fetchLogin(formData));

    if (res.payload.status) {
      navigate('/');
    } else {
      setIsLogin(false);
      setFormData(initialFormData);
    }
  }

  return (
    <main className="login">
      <div className="spacing" />
      <div className="tcl-container">
        <div className="tcl-row">
          <div className="tcl-col-12 tcl-col-sm-6 block-center">
            <h1 className="form-title text-center">Đăng nhập</h1>
            <div className="form-login-register">
              {/* {!isLogin && <Alert severity="error">Thông tin đăng nhập sai.</Alert>} */}
              <form autoComplete="off">
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn ..."
                  autoComplete="new-password"
                />

                <div className="d-flex tcl-jc-between tcl-ais-center">
                  <Button type="primary" size="large" onClick={handleSubmit}>
                    Đăng nhập
                  </Button>
                  <Link to="/register">Đăng ký</Link>
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

export default LoginPage;
