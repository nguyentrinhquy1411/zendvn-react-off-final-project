import { PlusOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Image, Input, message, Row, Spin, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchCurrentUser, fetchUpdateCurrentUser } from '../../../store/authSlice';
import { updateMyProFile } from '../../../store/usersSlice';
import { errorNotification } from '../../../helpers/notificantion';

const schema = yup
  .object({
    username: yup.string().required('Hãy nhập tên đăng nhập'),
    email: yup.string().email('Invalid email').required('Hãy nhập email'),
  })
  .required();

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const YourProfile = () => {
  const dispatch = useDispatch();
  const editData = useSelector((state) => state.AUTH.currentUser);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: editData?.first_name || '',
      last_name: editData?.last_name || '',
      // username: editData?.user_name || '',
      nickname: editData?.nickname || '',
      email: editData?.email || '',
      avatar: null, // Default value for avatar file
    },
  });

  useEffect(() => {
    if (!editData) {
      dispatch(fetchCurrentUser());
    }

    if (editData?.file) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: editData.file, // URL of the avatar from editData
        },
      ]);
    }

    reset({
      first_name: editData?.first_name || '',
      // username: editData?.user_name || '',
      last_name: editData?.last_name || '',
      nickname: editData?.nickname || '',
      email: editData?.email || '',
      avatar: fileList[0] ? fileList[0]?.originFileObj : null, // Set the avatar file if present
    });
  }, [editData, dispatch, reset]);

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

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onSubmit = (data) => {
    setLoading(true);
    // Handle the form submission including avatar
    // You can access the avatar with data.avatar (which would be the file object)

    const avatarFile = fileList[0]?.originFileObj || null;
    const formData = { ...data, file: avatarFile };
    if (formData.file) {
      const dataFile = new FormData();
      dataFile.append('file', formData.file); // Attach the file if present
      formData.dataFile = dataFile;
    }
    dispatch(updateMyProFile(formData)).then((res) => {
      setLoading(false);
      if (res.payload.status) {
        navigate('/admin/profile');
        successNotification('Cập nhật thông tin thành công!!');
      } else {
        errorNotification('Cập nhật thất bại');
      }
    });
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
        marginBottom: '50px',
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
      {/* Avatar Section */}
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={1}
        beforeUpload={() => false}
        onRemove={() => setFileList([])} // Handle avatar removal
      >
        {fileList.length < 1 && uploadButton}
      </Upload>

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

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, width: '100%', marginTop: '30px' }}>
        <Row gutter={24}>
          <Col span={12}>
            <div>
              <label>First Name</label>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <Input {...field} className={`input ${errors.first_name ? 'is-invalid' : ''}`} />
                )}
              />
              <p className="error">{errors.first_name?.message}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label>Last Name</label>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.last_name ? 'is-invalid' : ''}`} />}
              />
              <p className="error">{errors.last_name?.message}</p>
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <div>
              <label>Nickname</label>
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="johndoe@example.com"
                    className={`input ${errors.email ? 'is-invalid' : ''}`}
                  />
                )}
              />
              <p style={{ color: 'red', fontWeight: '600' }} className="error">
                {errors.email?.message}
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
              <p className="error">{errors.email?.message}</p>
            </div>
          </Col>
          {/* <Col span={12}>
            <div>
              <label>Username</label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => <Input {...field} className={`input ${errors.username ? 'is-invalid' : ''}`} />}
              />
              <p className="error">{errors.username?.message}</p>
            </div>
          </Col> */}
        </Row>

        <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default YourProfile;
