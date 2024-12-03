import React, { useState } from 'react';
import { Button, Col, Row, Upload, Image, message, Input, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../store/usersSlice';
import { errorNotification, successNotification } from '../../../helpers/notificantion';
import { useNavigate } from 'react-router-dom';

// Validation schema using yup
const schema = yup
  .object({
    username: yup.string().required('Hãy nhập tên đăng nhập'),
    email: yup.string().email('Invalid email').required('Hãy nhập email'),
  })
  .required();

// Helper function to convert file to base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddUser = () => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      nickname: '', // Default value for nickname
      avatar: null, // Avatar managed separately
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    setLoading(true);
    const avatarFile = fileList[0].originFileObj || null;
    const formData = { ...data, file: avatarFile };
    if (formData.file) {
      const dataFile = new FormData();
      dataFile.append('file', formData.file); // Attach the file if present
      formData.dataFile = dataFile;
    }
    dispatch(addUser(formData)).then((res) => {
      setLoading(false);
      if (res.payload.status) {
        navigate('/admin/posts');
        successNotification('Thêm người dùng thành công!!');
      } else {
        errorNotification('Thêm mới thất bại');
      }
    });
  };

  // Handle file preview
  const handlePreview = async (file) => {
    try {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    } catch (error) {
      message.error('Failed to preview image.');
    }
  };

  // Handle file upload changes
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Custom upload button
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
      }}
    >
      {/* Loading spinner covering the page */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 800, width: '100%' }}>
        {/* Avatar Upload Section */}
        <Row justify="center" style={{ marginBottom: '30px' }}>
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload
            onRemove={() => setFileList([])} // Clear file on removal
          >
            {fileList.length < 1 && uploadButton}
          </Upload>
        </Row>

        {/* Preview Image */}
        {previewImage && (
          <Image
            wrapperStyle={{
              display: 'none',
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
            src={previewImage}
          />
        )}

        {/* Form Fields */}
        <Row gutter={24}>
          <Col span={12}>
            <div>
              <label>Username</label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.name ? 'is-invalid' : ''}`} />}
              />

              <p style={{ color: 'red', fontWeight: '600' }} className="error">
                {errors.username?.message}
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label>Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.email ? 'is-invalid' : ''}`} />}
              />
              <p style={{ color: 'red', fontWeight: '600' }} className="error">
                {errors.email?.message}
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label>First Name</label>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.firstName ? 'is-invalid' : ''}`} />}
              />
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label>Last Name</label>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.lastName ? 'is-invalid' : ''}`} />}
              />
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label>Nickname</label>
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.nickname ? 'is-invalid' : ''}`} />}
              />
              <p className="error">{errors.nickname?.message}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label>Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="password" className={`input ${errors.password ? 'is-invalid' : ''}`} />
                )}
              />
              <p className="error">{errors.password?.message}</p>
            </div>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row justify="center">
          <Button type="primary" size="large" htmlType="submit">
            Submit
          </Button>
        </Row>
      </form>
    </div>
  );
};

export default AddUser;
