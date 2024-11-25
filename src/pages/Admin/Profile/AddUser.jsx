import React, { useState } from 'react';
import { Button, Col, Row, Upload, Image, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../store/usersSlice';
import { successNotification } from '../../../helpers/notificantion';
import { useNavigate } from 'react-router-dom';

// Validation schema using yup
const schema = yup
  .object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    first_name: yup.string(),
    last_name: yup.string(),
    password: yup.string().required('Password is required'),
    nickname: yup.string().required('Nickname is required'), // Added validation for nickname
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
    const avatarFile = fileList[0].originFileObj || null;
    const formData = { ...data, file: avatarFile };
    if (formData.file) {
      const dataFile = new FormData();
      dataFile.append('file', formData.file); // Attach the file if present
      formData.dataFile = dataFile;
    }
    console.log('Submitted Data:', formData);
    dispatch(addUser(formData)).then((res) => {
      if (res.payload.status) {
        navigate('/admin/posts');
        successNotification('Thêm người dùng thành công!!');
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
  console.log('fileList', fileList);

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
              <p className="error">{errors.name?.message}</p>
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
              <p className="error">{errors.email?.message}</p>
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
