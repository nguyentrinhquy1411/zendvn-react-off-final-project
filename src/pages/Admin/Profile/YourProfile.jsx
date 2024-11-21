import { PlusOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Image, Input, message, Row, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchCurrentUser, fetchUpdateCurrentUser } from '../../../store/authSlice';

const schema = yup
  .object({
    nickname: yup.string(),
    email: yup.string().email('Invalid email').required('Email is required'),
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: editData?.firstName || '',
      lastName: editData?.lastName || '',
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
      firstName: editData?.firstName || '',
      lastName: editData?.lastName || '',
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
    // Handle the form submission including avatar
    // You can access the avatar with data.avatar (which would be the file object)
    console.log(fileList);

    const avatarFile = fileList[0]?.url || null;
    const formData = { ...data, avatar: avatarFile };
    console.log(formData);
    dispatch(fetchUpdateCurrentUser(formData));
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
                name="firstName"
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
                name="lastName"
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
              <p className="error">{errors.nickname?.message}</p>
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
        </Row>

        <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default YourProfile;
